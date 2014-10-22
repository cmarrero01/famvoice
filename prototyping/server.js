var _cons = require('consolidate');
var _express = require('express');
var _bodyParser = require('body-parser');
var _app = _express();
_app.engine('html', _cons.hogan);
_app.set('view engine', 'html');
_app.set('views', __dirname + '/tpl');
_app.use(_bodyParser.urlencoded({ extended: true }));
_app.use(_bodyParser.json());
_app.use('/',_express.static('./tpl'));
_app.listen(8080);

// var http = require('http');

// var server = http.createServer(function (req, res) {
//   var body = '';
//   req.setEncoding('utf8');
//   req.on('data', function (chunk) {
//     body += chunk;
//   })
//   req.on('end', function () {
//     try {
//       var data = JSON.parse(body);
//     } catch (er) {
//       res.statusCode = 400;
//       return res.end('error: ' + er.message);
//     }
//     res.write(typeof data);
//     res.end();
//   })
// })
// server.listen(9000);

var fs = require("fs");
var ss = fs.createReadStream('./records/record.mp3');

