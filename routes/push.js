/*
 * GET users listing.
 */

var path = require('path');

exports.pushPackage = function (req, res) {
    var websitePushID = req.params.websitePushID;
    console.log("respond with a resource, " + websitePushID);
    res.status(200).sendfile(path.resolve('./public/', 'pushpackage/a.zip'));
};