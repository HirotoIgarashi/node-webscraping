/*
 * filesystem.js - Node.jsのファイルシステムのAPIを利用したモジュール
*/

// ---------- プライベートプロパティ開始 ---------------------------------------
'use strict';

const path  = require('path');
const fs    = require('fs-extra');
const util  = require('./util');

let pathname;

// ---------- プライベートプロパティ終了 ---------------------------------------

// ---------- プライベートメソッド開始 -----------------------------------------

// ---------- プライベートメソッド終了 -----------------------------------------

// ---------- パブリックメソッド開始 -------------------------------------------
// パブリックメソッド/config/開始 ----------------------------------------------

/**
 * config
 *
 * @param option {pathname: <保存するパス>}
 * @returns {Boolean}
 */

const config = function (option) {
  util.timestampLog('filesystem config start');

  pathname = option.pathname;

  return true;
};
// パブリックメソッド/config/終了 ----------------------------------------------

// パブリックメソッド/initModule/開始 ------------------------------------------
/**
 * initModule '** filesystem initModule start **'というログを出力している
 *
 * @returns {undefined}
 */
const initModule = function () {
  util.timestampLog('filesystem initModule start');
};
// パブリックメソッド/initModule/終了 ------------------------------------------

// パブリックメソッド/saveFile/開始 --------------------------------------------
// 目的     : ファイルを書き込む
// 設定     :
// 動作     :
// 戻り値   : なし
// 例外発行 : なし
// 使用例   :
//
/**
 * 
 *
 * @param filepath 書き込むファイルのパス
 * @param content 書き込む値
 * @returns {Boolean}
 */
const saveFile = async function(filepath, content) {
  // ファイルに保存する
  try {
    await fs.outputFile(
      path.join(__dirname, '..', pathname, filepath),
      content
    );
    return true;
  }
  catch (error) {
    console.log('ファイル書き込みエラーです。');
    console.log(error);
    return false;
  }
};
// パブリックメソッド/saveFile/終了 --------------------------------------------

// パブリックメソッド/appendFile/開始 ------------------------------------------
// 目的     : ファイルに追記する
// 設定     :
// 動作     : outputFileの第3引数{flag: 'a'}は追記するというオプション
// 戻り値   : なし
// 例外発行 : なし
// 使用例   :
//
/**
 * 
 *
 * @param filepath 書き込むファイルのパス
 * @param content 追記する値
 * @returns {Boolean}
 */

const appendFile = async function(filepath, content) {
  try {
    await fs.outputFile(
      path.join(__dirname, '..', filepath),
      content,
      {flag: 'a'}
    );
    console.log('ファイルに追記しました。');
    return true;
  }
  catch (error) {
    console.log('ファイル書き込みエラーです。');
    console.log(error);
    return false;
  }
};
// パブリックメソッド/appendFile/終了 ------------------------------------------
module.exports = {
  config      : config,
  initModule  : initModule,
  saveFile    : saveFile,
  appendFile  : appendFile
};
// ---------- パブリックメソッド終了 -------------------------------------------

// ---------- モジュール初期化開始   -------------------------------------------
util.timestampLog('filesystme module start');
// ---------- モジュール初期化終了   -------------------------------------------
