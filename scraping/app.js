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

const puppet        = require('./libs/puppet');
const filesystem    = require('./libs/filesystem');

filesystem.config();
filesystem.initModule();

filesystem.saveFile('download/sample.txt', 'テキストファイルです');
filesystem.appendFile('download/sample.txt', '追記したテキストファイルです');

// puppetの初期化モジュール
// 現在はconsole.logを呼んでいるだけ
puppet.initModule();

// headlessをfalseにしてブラウザを起動するように設定する
// slowMoを50に設定して指定のミリ秒スローモーションで実行する
puppet.setLaunchOptions({
  headless  : false,
  slowMo    : 50
});

(async () => {
  let
    page_content,
    page_contents,
    page_links,
    internalLinks,
    imageFiles,
    imageFile;

  // ブラウザの起動
  await puppet.launch();
  // puppeteerを使用してサイトにアクセスする
  await puppet.setSiteOptions({
    url: 'http://www.aozora.gr.jp/index_pages/person81.html'
  });

  // 青空文庫の宮沢賢治を開く
  await puppet.openPage();
  // ページを取得する
  page_content = await puppet.fetchSourceCode();
  // ページを保存する
  filesystem.saveFile('download/miyazawakenji.html', page_content);
  // ページを閉じる
  await puppet.closePage();

  // 青空文庫の夏目漱石を開く
  await puppet.setSiteOptions({
    url: 'http://www.aozora.gr.jp/index_pages/person148.html'
  });
  await puppet.openPage();
  // 内部リンクを取得する
  internalLinks = await puppet.fetchInternalLinks();

  console.log(internalLinks);

  // ページを取得する
  page_content = await puppet.fetchSourceCode();
  // ページを保存する
  filesystem.saveFile('download/natumesoseki.html', page_content);
  // ページを閉じる
  await puppet.closePage();

  // urlを指定する
  await puppet.setSiteOptions({
    url: 'https://example.com'
  });
  // 起動を待ってからexample.comを開く
  await puppet.openPage();

  // ページを取得する
  page_content = await puppet.fetchSourceCode();

  // ページを保存する
  filesystem.saveFile('download/example.html', page_content);

  // 開くのを待ってからページを評価する
  await puppet.evaluate();
  // ページを閉じる
  await puppet.closePage();

  // urlを指定する
  await puppet.setSiteOptions({
    url: 'https://google.com'
  });
  // 開くのを待ってからgoogle.comを開く
  await puppet.openPage();

  // ページを取得する
  page_content = await puppet.fetchSourceCode();

  // リンクを取得する
  page_links = await puppet.fetchLinks();

  console.log(page_links);

  filesystem.saveFile('download/google.html', page_content);

  // 開くのを待ってからページを評価する
  await puppet.evaluate();
  // ページを閉じる
  await puppet.closePage();

  // urlを指定する
  await puppet.setSiteOptions({
    url: 'http://ja.wikipedia.org/wiki/ネコ'
  });
  // ページを開く
  await puppet.openPage();

  // 画像のリストを取得する
  imageFiles = await puppet.fetchImageFile('img.thumbimage');

  for (imageFile of imageFiles ) {
    filesystem.saveFile('download/' + imageFile.name, imageFile.buffer);
  }

  // ページを閉じる
  await puppet.closePage();

  // urlを指定する
  await puppet.setSiteOptions({
    url: 'https://nodejs.org/api/'
  });
  // ページを開く
  await puppet.openPage();

  // 3階層先までのソースコードを取得する
  page_contents = await puppet.fetchSourceCodes(3);

  // console.log(page_contents);

  // ページを閉じる
  await puppet.closePage();

  // 評価が終わってから10秒待ってブラウザをクローズする
  // await setTimeout(function() {
  //   puppet.close();
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
