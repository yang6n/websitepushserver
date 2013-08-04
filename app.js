
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , push = require('./routes/push')
  , https = require('https')
  , fs = require('fs')
  , path = require('path');

var app = express();

// all environments
app.set('port', process.env.PORT || 443);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.cookieParser('7z0S52Jrqduoi20Nge2GiABz6EGYggrsCSXcnu4p'));
app.use(express.session());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));
app.use("/pushpackage", express.static(path.join(__dirname, '/pushpackage')));


// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}


app.post('/v1/log', routes.log);
app.post('/v1/pushPackages/:websitePushID', push.pushPackage);
app.post('/v1/devices/:deviceToken/registrations/:websitePushID', push.register);
app.delete('/v1/devices/:deviceToken/registrations/:websitePushID', push.unregister);

app.post('/v1/pushMessage', push.pushMessage);



/*
http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
*/

var options = {
    key: fs.readFileSync('/opt/conf/api.zhangxianli.cn_ssl.key'),
    cert: fs.readFileSync('/opt/conf/api.zhangxianli.cn_ssl.crt')
};

https.createServer(options, function(){
    console.log('Express server listening on port ' + app.get('port'));
}).listen(app.get('port'));