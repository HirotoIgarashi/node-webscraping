/*
 * filesystem.js - Node.jsのファイルシステムのモジュール
*/

// ---------- プライベートプロパティ開始 ----------
'use strict';
var
  config,
  initModule,
  saveFile,
  appendFile;

const
  path  = require('path'),
  fs    = require('fs-extra');
  

// ---------- プライベートプロパティ終了 ----------

// ---------- プライベートメソッド開始 ------------

// ---------- プライベートメソッド終了 ------------

// ---------- パブリックメソッド開始 --------------

// パブリックメソッド/config/開始 -----------------------------
config = function () {

  console.log('** filesystem config start **');

};
// パブリックメソッド/config/終了 -----------------------------

// パブリックメソッド/initModule/開始 -------------------------
initModule = function () {

  console.log('** filesystem initModule start **');

};
// パブリックメソッド/initModule/終了 -------------------------

// パブリックメソッド/saveFile/開始 ---------------------------
// 目的     : ファイルを書き込む
// 引数     :
//  * filepath  - ファイルを書き込むパス
//  * content   - 書き込む内容
// 設定     :
// 動作     :
// 戻り値   : なし
// 例外発行 : なし
// 使用例   :
//
saveFile = async function(filepath, content) {

  // ファイルに保存する
  try {
    await fs.outputFile(
      path.join(__dirname, '..', filepath),
      content
    );
  }
  catch (error) {
    console.log('ファイル書き込みエラーです。');
    console.log(error);
  }

};
// パブリックメソッド/saveFile/終了 ---------------------------

// パブリックメソッド/appendFile/開始 -------------------------
// 目的     : ファイルに追記する
// 引数     :
//  * filepath  - ファイルを書き込むパス
//  * content   - 書き込む内容
// 設定     :
// 動作     : outputFileの第3引数{flag: 'a'}は追記するオプション
// 戻り値   : なし
// 例外発行 : なし
// 使用例   :
//
appendFile = async function(filepath, content) {

  try {
    await fs.outputFile(
      path.join(__dirname, '..', filepath),
      content,
      {flag: 'a'}
    );
    console.log('ファイルに追記しました。');
  }
  catch (error) {
    console.log('ファイル書き込みエラーです。');
    console.log(error);
  }

};
// パブリックメソッド/appendFile/終了 -------------------------
module.exports = {
  config      : config,
  initModule  : initModule,
  saveFile    : saveFile,
  appendFile  : appendFile
};
// ---------- パブリックメソッド終了 --------------

// ---------- モジュール初期化開始   --------------
console.log('** filesystme module start **');
// ---------- モジュール初期化終了   --------------
