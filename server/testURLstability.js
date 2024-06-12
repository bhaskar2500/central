const crypto = require('crypto');
const moment = require('moment');
const https = require('https');

const accessKey = "0cade253cc494bb39cc15ea1a2e7f0c2";
const secretKey = "881adcddb8702c0f1c00b760d39d6af912ae2715782253b8";
const httpMethod = 'GET';
const host = 's3-api.us-geo.objectstorage.softlayer.net';
const region = 'us-geo';
const endpoint = 'https://' + host;
const bucket = 'spplus-test';
const objectKey = 'applicableChannels.PNG'
const expiration = 86400  // time in seconds

// hashing and signing methods
function hash(key, msg) {
    var hmac = crypto.createHmac('sha256', key);
    hmac.update(msg, 'utf8');
    return hmac.digest();
}

function hmacHex(key, msg) {
    var hmac = crypto.createHmac('sha256', key);
    hmac.update(msg, 'utf8');
    return hmac.digest('hex');
}

function hashHex(msg) {
    var hash = crypto.createHash('sha256');
    hash.update(msg);
    return hash.digest('hex');
}

// region is a wildcard value that takes the place of the AWS region value
// as COS doesn't use the same conventions for regions, this parameter can accept any string
function createSignatureKey(key, datestamp, region, service) {
    keyDate = hash(('AWS4' + key), datestamp);
    keyString = hash(keyDate, region);
    keyService = hash(keyString, service);
    keySigning = hash(keyService, 'aws4_request');
    return keySigning;
}

function createHexSignatureKey(key, datestamp, region, service) {
    keyDate = hashHex(('AWS4' + key), datestamp);
    keyString = hashHex(keyDate, region);
    keyService = hashHex(keyString, service);
    keySigning = hashHex(keyService, 'aws4_request');
    return keySigning;
}

function printDebug() {
    // this information can be helpful in troubleshooting, or to better
    // understand what goes into signature creation
    console.log('These are the values used to construct this request.');
    console.log('Request details -----------------------------------------');
    console.log(`httpMethod: ${httpMethod}`);
    console.log(`host: ${host}`);
    console.log(`region: ${region}`);
    console.log(`endpoint: ${endpoint}`);
    console.log(`bucket: ${bucket}`);
    console.log(`objectKey: ${objectKey}`);
    console.log(`timestamp: ${timestamp}`);
    console.log(`datestamp: ${datestamp}`);

    console.log('Standardized request details ----------------------------');
    console.log(`standardizedResource: ${standardizedResource}`);
    console.log(`standardizedQuerystring: ${standardizedQuerystring}`);
    console.log(`standardizedHeaders: ${standardizedHeaders}`);
    console.log(`signedHeaders: ${signedHeaders}`);
    console.log(`payloadHash: ${payloadHash}`);
    console.log(`standardizedRequest: ${standardizedRequest}`);

    console.log('String-to-sign details ----------------------------------');
    console.log(`credentialScope: ${credentialScope}`);
    console.log(`string-to-sign: ${sts}`);
    console.log(`signatureKey: ${signatureKey}`);
    console.log(`signature: ${signature}`);

    console.log('Because the signature key has non-ASCII characters, it is');
    console.log('necessary to create a hexadecimal digest for the purposes');
    console.log('of checking against this example.');

    signatureKeyHex = createHexSignatureKey(secretKey, datestamp, region, 's3')

    console.log(`signatureKey (hexidecimal): ${signatureKeyHex}`);

    console.log('Header details ------------------------------------------');
    console.log(`pre-signed url: ${requestUrl}`);    
}

// assemble the standardized request
var time = moment().utc();
var timestamp = time.format('YYYYMMDDTHHmmss') + 'Z';
var datestamp = time.format('YYYYMMDD');

var standardizedQuerystring = 'X-Amz-Algorithm=AWS4-HMAC-SHA256' +
    '&X-Amz-Credential=' + encodeURIComponent(accessKey + '/' + datestamp + '/' + region + '/s3/aws4_request') +
    '&X-Amz-Date=' + timestamp +
    '&X-Amz-Expires=' + expiration.toString() +
    '&X-Amz-SignedHeaders=host';

var standardizedResource = '/' + bucket + '/' + objectKey;

var payloadHash = 'UNSIGNED-PAYLOAD';
var standardizedHeaders = 'host:' + host;
var signedHeaders = 'host';

var standardizedRequest = httpMethod + '\n' +
    standardizedResource + '\n' +
    standardizedQuerystring + '\n' +
    standardizedHeaders + '\n' +
    '\n' +
    signedHeaders + '\n' +
    payloadHash;

// assemble string-to-sign
var hashingAlgorithm = 'AWS4-HMAC-SHA256';
var credentialScope = datestamp + '/' + region + '/' + 's3' + '/' + 'aws4_request';
var sts = hashingAlgorithm + '\n' +
    timestamp + '\n' +
    credentialScope + '\n' +
    hashHex(standardizedRequest);

// generate the signature
signatureKey = createSignatureKey(secretKey, datestamp, region, 's3');
signature = hmacHex(signatureKey, sts);

// create and send the request
// the 'requests' package autmatically adds the required 'host' header
var requestUrl = endpoint + '/' +
    bucket + '/' +
    objectKey + '?' +
    standardizedQuerystring +
    '&X-Amz-Signature=' +
    signature;

console.log(`requestUrl: ${requestUrl}`);

console.log(`\nSending ${httpMethod} request to IBM COS -----------------------`);
console.log('Request URL = ' + requestUrl);

// create and send the request
console.log(`\nSending ${httpMethod} request to IBM COS -----------------------`);
console.log('Request URL = ' + requestUrl);

var request = https.get(requestUrl, function (response) {
    console.log('\nResponse from IBM COS ----------------------------------');
    console.log(`Response code: ${response.statusCode}\n`);

    response.on('data', function (chunk) {
        console.log('Response: ' + chunk);
        printDebug();
    });
});

request.end();