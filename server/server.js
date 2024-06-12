// server.js
const express = require('express');
const path = require('path');
const app = express();
const fs = require('fs');
const passport = require('passport');
var SamlStrategy = require('passport-saml').Strategy;
var request = require('request');
var imageStorage = require('./imageStorage')
var util = require('util');

var userSecurity = require("./config/userSecurity.json")
var jwt = require('jsonwebtoken');

var bodyParser = require('body-parser');
require('body-parser-xml')(bodyParser);

app.use(require('express-session')({ secret: 'keyboard cat', resave: true, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());
// As with any middleware it is quintessential to call next()
// if the user is authenticated
app.use(function (req, res, next) {
  if ( req.url.includes('images') ||req.url.includes('login') || req.isAuthenticated()) {
    return next();
  }
  res.redirect('/login');
});

// Run the app by serving the static files
// in the dist directory
app.use(express.static(__dirname));
// Start the app by listening on the default
// Heroku port

app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(bodyParser.json());
app.use(bodyParser.raw());
app.use(bodyParser.text());
app.use(bodyParser.xml());

// If an incoming request uses
// a protocol other than HTTPS,
// redirect that request to the
// same url but with HTTPS
const forceSSL = function () {
  return function (req, res, next) {
    if (req.headers['x-forwarded-proto'] !== 'https') {
      return res.redirect(
        ['https://', req.get('Host'), req.url].join('')
      );
    }
    next();
  }
}

// Instruct the app
// to use the forceSSL
// middleware
// app.use(forceSSL());


// For all GET requests, send back index.html
// so that PathLocationStrategy can be used
//All the incoming requests check if saml is present if not redirect to sso .

app.get('/login',
  passport.authenticate('saml', { failureRedirect: '/', failureFlash: true }),
  function (req, res) {
    res.redirect('/');
  }
);
app.get('/lc/*', function (req, res) {
  res.redirect("/");
})

headers = {
  accept: 'application/json',
  "x-ibm-client-id": "c5d3308f-b488-41d2-85e5-29ac197108c5",
  "x-ibm-client-secret": 'sG5uT0fI3oN3fM8lN4oF5cT2xW3kU3gG0qO4hO6nE2cG7yW4dO',
}

app.get("/rt", function (req, res) {
  request({
    headers: headers,
    uri: 'https://api.us.apiconnect.ibmcloud.com/gpearsonsppluscom-dev/sb/v1.0.0/userProfiles/' + req.header("email1"),
  }, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      res.send(JSON.stringify({ "token": response.headers["token"] ,"status":200}));
    }
    else {
      res.send(JSON.stringify({ "token": "Not found" ,"status":500 }));
    }
  })
});
app.post('/loginSuccess', passport.authenticate('saml', { failureRedirect: '/', failureFlash: true }),
  function (req, res, next) {
    request({
      headers: headers,
      uri: 'https://api.us.apiconnect.ibmcloud.com/gpearsonsppluscom-dev/sb/v1.0.0/userProfiles/' + req.user.email1,
    }, function (error, response, body) {
      if (!error && response.statusCode == 200) {
      let roles = userSecurity; 
      let userEntitments;
      let lcToken;
      let responseObj = JSON.parse(response.body);
       if(roles && roles.length>0){
         userEntitments = roles.find((role)=>{ return responseObj.roleDescription == role.role});
         }
        lcToken = jwt.sign({ "user": req.user.email1, "email": req.user.nameID, "token": response.headers["token"], "body": JSON.stringify(JSON.parse(response.body)), "entitlements": userEntitments }, 'myProlifics');
        res.cookie('userInfo', lcToken, { expire: new Date() + 1800000 });
        res.redirect('/')
      }
      else {
        res.cookie('userInfo', JSON.stringify({ "user": req.user.email1, "email": req.user.nameID, "token": "Not found in APIC" }));
        res.redirect('/')
      }
    })
  }
);

/* Handle Logout */
app.get('/logout', function (req, res) {
  if (!req.user) res.redirect('/');
  return passport._strategy('saml').logout(req, function (err, uri) {
    return res.redirect(uri);
  });
});

app.get('/logoutSuccess', function (req, res) {
  req.logout();
  res.redirect('/');
});

passport.serializeUser(function (user, done) {
  done(null, JSON.stringify(user));
});

passport.deserializeUser(function (userString, done) {
  done(null, JSON.parse(userString));
});

var samlStrategy = new SamlStrategy(
  {
    path: '/loginSuccess',
    entryPoint: 'https://portal.spplus.com/secureAuth42/',
    logoutUrl: 'https://portal.spplus.com/secureAuth42/restart.aspx',
    issuer: 'passport-saml',
    logoutCallbackUrl: '/logoutSuccess',
    acceptedClockSkewMs: -1
  },
  function (profile, done) {
    return done(null, profile);
  })

passport.use(samlStrategy);

passport.logoutSaml = function (req, res) {
  //Here add the nameID and nameIDFormat to the user if you stored it someplace.
  req.user.nameID = req.user.saml.nameID;
  req.user.nameIDFormat = req.user.saml.nameIDFormat;
  samlStrategy.logout(req, function (err, request) {
    if (!err) {
      //redirect to the IdP Logout URL
      res.redirect(request);
    }
  });
};

var writeLog = function (message) {
  dir = 'loginSuccessResponse'
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
  }
  fs.writeFile(dir + '/ImageUploadedSucces_' + Date.now().toString() + '.json', message, function (err) {
    if (err) {
      return console.error(err);
    }
  });
}
fileManager = imageStorage();

app.post('/storeImage', fileManager.upload.single('uploadedFiles'), function (req, res) {
  res.send(JSON.stringify(req.file));
});

app.get('/images/:imagename', function (req, res) {
  fileName = req.params.imagename;
  fileManager.getImagesByLocation(fileName).then(function(result) {
        
        res.type(result.Metadata.mimetype);
        res.write(result.Body,'binary');
        res.end(null, 'binary');
    }, function(err) {
        console.log(err);
         res.status(500).json({status:"500",message:"Internal Server exception occured."});
    });
});


app.listen(process.env.PORT || 4200, function () { console.log('Listening....') });