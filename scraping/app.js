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

var createError   = require('http-errors');
var express       = require('express');
var path          = require('path');
var cookieParser  = require('cookie-parser');
var logger        = require('morgan');
var indexRouter   = require('./routes/index');
var usersRouter   = require('./routes/users');

let browser;
let page;

const puppet        = require('./libs/puppet');
const filesystem    = require('./libs/filesystem');

filesystem.config({pathname: 'download'});
filesystem.initModule();

// filesystem.saveFile('sample.txt', 'テキストファイルです');
// filesystem.appendFile('sample.txt', '追記したテキストファイルです');

// puppetの初期化モジュール
// 現在はconsole.logを実行しているだけ
puppet.initModule();

// headlessをfalseにしてブラウザを起動するように設定する
// slowMoを50に設定して指定のミリ秒スローモーションで実行する
// ブラウザを最大にするためにwidthに0、heightに0を指定する。こうすると解像度に
// よって最大になる。
puppet.setLaunchOptions({
  headless        : false,
  slowMo          : 50,
  defaultViewport : {
    width   : 0,
    height  : 0
  }
});

// puppet.setSiteOptions({url : 'https://amazon.co.jp'});
puppet.setSiteOptions(
  {url : 'https://www.amazon.co.jp/gp/site-directory/ref=nav__fullstore'}
);

(async () => {

  // ブラウザを立ち上げる
  browser = await puppet.openBrowser();

  // ページをオープンする
  page = await puppet.openPage(browser);
  // TOPページに移動する
  page = await puppet.gotoPage(page, 'https://amazon.co.jp');

  // カテゴリのリンクを取得する
  let category_link = await puppet.fetchInternalLinks(page);

  await console.log(category_link);

  // 対象となるカテゴリを選択する

  // カテゴリページの最初のページに移動する

  // 次のページを表示する

  // 最後のページまで表示する

  // 評価が終わってから10秒待ってブラウザをクローズする
  // await setTimeout(async function() {
  //   await puppet.closeBrowser();
  // }, 10000);

})();

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
app.use(function(err, req, res/*, next*/) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
