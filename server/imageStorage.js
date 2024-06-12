const fs = require('fs');
const path = require('path');

var AWS = require('ibm-cos-sdk');
var util = require('util');
var config = require("./config/objectStoreServiceCred.json")
var multer  = require('multer')
var multerS3 = require('multer-s3')
 
var readConfig = {
    endpoint: 's3-api.us-geo.objectstorage.softlayer.net',
    apiKeyId: config['apikey'],
    ibmAuthEndpoint: 'https://iam.ng.bluemix.net/oidc/token',
    serviceInstanceId: config['resource_instance_id']
};

var readWriteconfig = {
    endpoint: 's3-api.us-geo.objectstorage.softlayer.net',
    apiKeyId: config['apikey'],
    ibmAuthEndpoint: 'https://iam.ng.bluemix.net/oidc/token',
    serviceInstanceId: config['resource_instance_id']
};

var readWritecos = new AWS.S3(readWriteconfig);
var readOnlyCos = new AWS.S3(readConfig);



var fileManager = function(){

var uploadImage = function(){
    console.log("Inside upload Image");
       return multer({
        storage: multerS3({
          s3: readWritecos,
          bucket: 'spplus-test',
          metadata: function (req, file, cb) {
            cb(null, {fieldName: file.fieldname, locationcode: req.body.locationCode, mimetype: file.mimetype});
          },
          key: function (req, file, cb) {
            cb(null, file.originalname)
          }
        })
      })
}

var getImagesByLocation = function(fileName){
    return readOnlyCos.getObject({
        Key :fileName,  
        Bucket:'spplus-test',
        ResponseContentType:'application/json',
    }).promise();
}

return{
    upload: uploadImage(),
    getImagesByLocation: getImagesByLocation
};
}


module.exports = fileManager;