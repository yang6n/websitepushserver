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