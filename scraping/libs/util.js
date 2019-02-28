/*
 * util.js - Node.js用のユーティリティ関数
*/

// ---------- プライベートプロパティ開始 ----------
'use strict';
// ---------- プライベートプロパティ終了 ----------

// ---------- プライベートメソッド開始 ------------
const get_time = function() {
  return new Date().toISOString();
};
// ---------- プライベートメソッド終了 ------------

// ---------- パブリックメソッド開始 --------------
// 目的     :
// 引数     :
//  * 引数1 - 引数1の説明
// 設定     :
// 動作     :
// 戻り値   :
// 例外発行 :
// 使用例   :
//
const isArray = function (value) {
  return value &&
    typeof value === 'object' &&
    typeof value.length === 'number' &&
    typeof value.splice === 'function' &&
    !(value.propertyIsEnumerable('length'));
};

const isNumber = function(value) {
  return typeof value === 'number' &&
    isFinite(value);
};

const getRandomInt = function(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const timestampLog = function(text) {
  console.log(get_time(), text);
};
const initModule = function () {
  timestampLog('** util initModule start **');
};

module.exports = {
  isArray       : isArray,
  isNumber      : isNumber,
  getRandomInt  : getRandomInt,
  timestampLog  : timestampLog,
  initModule    : initModule
};
// ---------- パブリックメソッド終了 --------------

// ---------- モジュール初期化開始   --------------
timestampLog('** util start **');
// ---------- モジュール初期化終了   --------------
