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
  config,
  getPage;
// ---------- プライベートプロパティ終了 ----------

// ---------- プライベートメソッド開始 ------------
// ---------- プライベートメソッド終了 ------------

// ---------- パブリックメソッド開始 --------------
config = function () {
  console.log("** remote_site config start **");
};

getPage = function () {
  var
    http = require('http'),
    fs = require('fs'),
    url = "http://kujirahand.com/",
    savepath = "download/test.html",
    outfile = fs.createWriteStream(savepath);

  http.get(url, function(res) {
    res.pipe(outfile);
    res.on('end', function() {
      outfile.close();
      console.log("** page get end **");
    });
  });
};

module.exports = {
  config  : config,
  getPage : getPage
};
// ---------- パブリックメソッド終了 --------------

// ---------- モジュール初期化開始   --------------
console.log("** remote_site start **");
// ---------- モジュール初期化終了   --------------
