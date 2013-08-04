/*
 * GET users listing.
 */

var path = require('path');

exports.pushPackage = function (req, res) {
    var websitePushID = req.params.websitePushID;
    console.log("respond with a resource, " + websitePushID);
    res.status(200).sendfile(path.resolve('./public/', 'pushpackage/a.zip'));
};

exports.register = function (req, res) {
    console.log("registering");
    console.log("body: " + JSON.stringify(req.body));
    console.log("params: " + JSON.stringify(req.params));
    /*
     var deviceToken = req.params.deviceToken;
     var websitePushID = req.params.websitePushID;
     var userId = req.params.userId;
     */

    //todo

    console.log("Registered!");
    res.send(200);
};

exports.unregister = function (req, res) {
    console.log("unregistering");
    console.log("body: " + JSON.stringify(req.body));
    console.log("params: " + JSON.stringify(req.params));
    console.log("Unregistered!");
    res.send(200);
};

var fs = require('fs');
var crypto = require('crypto');
var tls = require('tls');

var certPem = fs.readFileSync('/opt/conf/WebsitePush-cert.pem', encoding = 'ascii');
var keyPem = fs.readFileSync('/opt/conf/WebsitePush-key-noenc.pem', encoding = 'ascii');
var caCert = fs.readFileSync('/opt/conf/AppleWWDRCA.cer', encoding = 'ascii');
var options = { key: keyPem, cert: certPem, ca: [ caCert ] };

function connectAPN(next) {

    var stream = tls.connect(2195, 'gateway.sandbox.push.apple.com', options, function () {
        // connected
        next(!stream.authorized, stream);
    });

    // 'aps' is required
    var pushnd = {
        "aps": {
            "alert": {
                "title": "Orcs is coming",
                "body": "The Orc get a push notification on Mavericks.",
                "action": "View"
            },
            "url-args": ["aType", "aValue"]
        }
    }

    var hextoken = '5107AACD26F6ABB8A2ACCD061FDF582B7E4C4E6FFC6B9318EFF7ECA79ED42225'; // Push token from iPhone app. 32 bytes as hexadecimal string
    var token = hextobin(hextoken);
    var payload = JSON.stringify(pushnd);
    var payloadlen = Buffer.byteLength(payload, 'utf-8');
    var tokenlen = 32;
    var buffer = new Buffer(1 + 4 + 4 + 2 + tokenlen + 2 + payloadlen);
    var i = 0;
    var msgid = 0xbeefcace; // message identifier, can be left 0
    var seconds = Math.round(new Date().getTime() / 1000) + 1 * 60 * 60; // expiry in epoch seconds (1 hour);
    var payload = JSON.stringify(pushnd);

    buffer[i++] = 1; // command
    buffer[i++] = msgid >> 24 & 0xFF;
    buffer[i++] = msgid >> 16 & 0xFF;
    buffer[i++] = msgid >> 8 & 0xFF;
    buffer[i++] = msgid & 0xFF;

    // expiry in epoch seconds (1 hour)
    buffer[i++] = seconds >> 24 & 0xFF;
    buffer[i++] = seconds >> 16 & 0xFF;
    buffer[i++] = seconds >> 8 & 0xFF;
    buffer[i++] = seconds & 0xFF;

    buffer[i++] = tokenlen >> 8 & 0xFF; // token length
    buffer[i++] = tokenlen & 0xFF;
    token = hextobin(hextoken);
    token.copy(buffer, i, 0, tokenlen)
    i += tokenlen;
    buffer[i++] = payloadlen >> 8 & 0xFF; // payload length
    buffer[i++] = payloadlen & 0xFF;

    payload = Buffer(payload);
    payload.copy(buffer, i, 0, payloadlen);
    stream.write(buffer);  // write push notification

    stream.on('data', function (data) {
        var command = data[0] & 0x0FF;  // always 8
        var status = data[1] & 0x0FF;  // error code
        var msgid = (data[2] << 24) + (data[3] << 16) + (data[4] << 8 ) + (data[5]);

        console.log(command + ':' + status + ':' + msgid);
    });

};

function hextobin(hexstr) {
    buf = new Buffer(hexstr.length / 2);

    for (var i = 0; i < hexstr.length / 2; i++) {
        buf[i] = (parseInt(hexstr[i * 2], 16) << 4) + (parseInt(hexstr[i * 2 + 1], 16));
    }

    return buf;
};

exports.pushMessage = function (req, res) {
    connectAPN(function () {
    });
    res.send(200);
};