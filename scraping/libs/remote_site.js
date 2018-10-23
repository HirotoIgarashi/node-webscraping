/*
 * remote_site.js - リモートサイトにアクセスするモジュール
*/

/*jslint          node    : true, continue  : true,
  devel   : true, indent  : 2,    maxerr    : 50,
  newcap  : true, nomen   : true, plusplus  : true,
  regexp  : true, sloppy  : true, vars      : false,
  white   : true
*/
/*global */

// ---------- プライベートプロパティ開始 ----------
'use strict';
var
  getURL,
  downloadContents,
  config,
  download,
  getPage,
  showLink,
  getImage;
// ---------- プライベートプロパティ終了 ----------

// ---------- プライベートメソッド開始 ------------

// ---------- ブライベートメソッド/getURL/開始 --------------
// ---------- ブライベートメソッド/downloadContents/開始 ----
// 目的: ベースURLと相対URLを受け取りURLを返す
// 引数:
//  * baseURL      : ベースURL
//  * relativeURL  : 相対URL
// 戻り値 : 絶対URL
getURL = function (baseURL, relativeURL) {
  var
    URL     = require('url');

  return URL.resolve(baseURL, relativeURL);
};
// ---------- ブライベートメソッド/getURL/終了 ----

// ---------- ブライベートメソッド/downloadContents/開始 ----
downloadContents = function (url, savePath) {
// 目的: URLと保存パスを受け取りコンテンツを保存する
// 引数:
//  * url       : URL
//  * savePath  : 保存パス
// 戻り値 : boolean
//  * true
//  * false
  var
    request = require('request'),
    fs      = require('fs');

  request(url).pipe(fs.createWriteStream(savePath));
};
// ---------- ブライベートメソッド/downloadContents/終了 ----
// ---------- プライベートメソッド終了 ------------

// ---------- パブリックメソッド開始 --------------
config = function () {
  console.log('** remote_site config start **');
};

download = function (url, savepath, callback) {
  var
    http = require('http'),
    fs = require('fs'),
    outfile = fs.createWriteStream(savepath);

  http.get(url, function(res) {
    res.pipe(outfile);
    res.on('end', function() {
      outfile.close();
      callback();
    });
  });
};

getPage = function () {
  var
    client = require('cheerio-httpcli'),
    url = 'https://www.aozora.gr.jp/index_pages/person81.html',
    param = {},
    body;

  client.fetch(url, param, function (err, $/* ,res */){
    if (err) {
      console.log('Error:', err);
      return;
    }
    body = $.html();
    console.log(body);
  });
};

showLink = function () {
  var
    client  = require('cheerio-httpcli'),
    url     = 'https://www.aozora.gr.jp/index_pages/person81.html',
    param   = {};

  console.log('showLink start');

  client.fetch(url, param, function(err, $/*, res*/) {
    if (err) {
      console.log('error');
      console.log('err.code: ' + err.code);
      return;
    }

    console.log( 'contents:' + $ );
    $('a').each(function(/*idx*/) {
      var
        text = $(this).text(),
        href = $(this).attr('href'),
        href2;

      if (!href) {
        return;
      }
      href2 = getURL(url, href);
      console.log(text + ' : ' + href);
      console.log(' => ' + href2 + '\n');
    });
  });

  console.log('showLink end');

};

getImage = function () {
  var
    client  = require('cheerio-httpcli'),
    fs      = require('fs'),
    URL     = require('url'),
    url     = 'https://ja.wikipedia.org/wiki/%E3%83%8D%E3%82%B3',
    param   = {},
    savedir,
    fname;

  // ダウンロード先のディレクトリを作る
  savedir = __dirname + '/img';

  if (!fs.existsSync(savedir)) {
    fs.mkdirSync(savedir);
  }

  // HTMLファイルの取得
  client.fetch(url, param, function (err, $/*, res*/) {
    if (err) {
      console.log('error');
      return;
    }

    // リンクを抽出する
    $('img').each(function (/*idx*/) {
      var
        src = $(this).attr('src'),
        fnameArray;

      // 相対パスを絶対パスに変換
      src = getURL(url, src);

      // 保存用のファイル名を作成
      fname = URL.parse(src).pathname;

      fnameArray = fname.split('/');

      fname = savedir + '/' + fnameArray[fnameArray.length -1].replace(/[^a-zA-Z0-9.]+/g, '_');

      // ダウンロード
      downloadContents(src, fname);
    });
  });
};

module.exports = {
  config    : config,
  download  : download,
  getPage   : getPage,
  showLink  : showLink,
  getImage  : getImage
};
// ---------- パブリックメソッド終了 --------------

// ---------- モジュール初期化開始   --------------
console.log('** remote_site start **');
// ---------- モジュール初期化終了   --------------
