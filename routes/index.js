/*
 * GET home page.
 */

exports.index = function (req, res) {
    res.render('index', { title: 'Express' });
};

exports.log = function (req, res) {
    console.log("log: " + JSON.stringify(req.body));
    res.send(200);
};