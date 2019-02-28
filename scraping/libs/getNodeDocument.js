/*
 * getNodeDocument.js - Node.jsのドキュメントを3階層まで
 * ダウンロードするモジュール
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
  // remote_site = require('./remote_site'),
  initModule;
// ---------- プライベートプロパティ終了 ----------

// ---------- プライベートメソッド開始 ------------

// ---------- プライベートメソッド終了 ------------

// ---------- パブリックメソッド開始 --------------
initModule = function () {
  // リンクを解析してダウンロード for Node.js
  // --- モジュールの取り込み ---
  var
    client  = require('cheerio-httpcli'),
    // request = require('request'),
    URL     = require('url'),
    fs      = require('fs'),
    path    = require('path'),
    // 関数の定義
    downloadRec,
    checkSaveDir,
    // 共通の指定
    LINK_LEVEL  = 3,
    // 基準となるページURL
    TARGET_URL  = 'https://nodejs.org/api/',
    list        = {};

  console.log('** getNodeDocument initModule start **');

  // 指定のurlを最大レベルlevelまでダウンロード
  downloadRec = function (url, level) {
    var
      us,
      base;

    // 最大レベルチェック
    if (level >= LINK_LEVEL) {
      return;
    }

    // 既出のサイトは無視する
    if (list[url]) {
      return;
    }
    list[url] = true;

    // 基準ページ以外なら無視する
    us = TARGET_URL.split('/');
    us.pop();
    base = us.join('/');

    if (url.indexOf(base) < 0) {
      return;
    }

    // HTMLを取得する
    client.fetch(url, {}, function(err, $, res) {
      var
        savepath;

      // ページの取得で失敗したらエラーを表示する
      if (err) {
        console.log('ページの取得を失敗しました');
        return;
      }
      else {
        console.log(res.statusCode);
      }

      // リンクされているページを取得
      $('a').each(function (/* idx */) {
        var
          href;

        // <a>タグのリンク先を得る
        href = $(this).attr('href');
        if (!href) {
          return;
        }

        // 絶対パスを相対パスに変換
        href = URL.resolve(url, href);

        // '#'以降を無視する(a.html#aaとa.html#bbは同じもの)
        // 末尾の#を消す
        href = href.replace(/#.+$/, '');
        downloadRec(href, level + 1);
      });
      // ページを保存(ファイル名を決定する)
      if (url.substr(url.length - 1, 1) === '/') {
        // インデックスを自動追加
        url += 'index.html';
      }

      savepath = url.split('/').slice(2).join('/');
      checkSaveDir(savepath);
      console.log(savepath);
      fs.writeFileSync(savepath, $.html());

    });
  };

  // 保存先のディレクトリが存在するか確認
  checkSaveDir = function (fname) {
    var
      // ディレクトリ部分だけを取り出す
      dir     = path.dirname(fname),
      // ディレクトリを再帰的に作成する
      dirlist = dir.split('/'),
      p       = '',
      i;

    for ( i in dirlist ) {
      p += dirlist[i] + '/';
      if (!fs.existsSync(p)) {
        fs.mkdirSync(p);
      }
    }
  };

  // メイン処理
  downloadRec(TARGET_URL, 0);

};

module.exports = {
  initModule  : initModule,
};
// ---------- パブリックメソッド終了 --------------

// ---------- モジュール初期化開始   --------------
// ---------- モジュール初期化終了   --------------
