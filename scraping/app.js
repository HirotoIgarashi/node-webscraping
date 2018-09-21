/*
 * app.js - サーバを開始する
*/

/*jslint          node    : true, continue  : true,
  devel   : true, indent  : 2,    maxerr    : 50,
  newcap  : true, nomen   : true, plusplus  : true,
  regexp  : true, sloppy  : true, vars      : false,
  white   : true
*/
/*global */

var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
// var remote_site = require('./libs/remote_site');
// var get_node_document = require('./libs/getNodeDocument');
var puppet = require('./libs/puppet');

// remote_site.config();

// remote_site.download(
//   'http://www.aozora.gr.jp/index_pages/person81.html',
//   'miyazawakenji.html',
//   function () {
//     console.log( 'ok, kenji.' );
//   }
// );

// remote_site.download(
//   'http://www.aozora.gr.jp/index_pages/person148.html',
//   'natumesoseki.html',
//   function () {
//     console.log( 'ok, soseki.' );
//   }
// );

// remote_site.getPage();

//remote_site.showLink();

// remote_site.getImage();

// get_node_document.initModule();

// puppeteerを使用してサイトにアクセスする
puppet.initModule();
puppet.config({headless : false});
puppet.launch();
// puppet.close();

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
