/*
 * template.js - Node.jsのモジュールのテンプレート
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
  initModule;
// ---------- プライベートプロパティ終了 ----------

// ---------- プライベートメソッド開始 ------------

// ---------- プライベートメソッド終了 ------------

// ---------- パブリックメソッド開始 --------------
config = function () {
  var
    template;
};

initModule = function () {
  // リンクを解析してダウンロード for Node.js
  // --- モジュールの取り込み ---
  var
    template;

  console.log("** template initModule start **");

};

module.exports = {
  config      : config,
  initModule  : initModule
};
// ---------- パブリックメソッド終了 --------------

// ---------- モジュール初期化開始   --------------
console.log("** template start **");
// ---------- モジュール初期化終了   --------------
