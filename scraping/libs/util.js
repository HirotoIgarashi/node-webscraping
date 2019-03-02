/*
 * util.js - Node.js用のユーティリティ関数
*/
'use strict';
// ---------- プライベートプロパティ開始 ---------------------------------------
const _ = require('lodash');
// ---------- プライベートプロパティ終了 ---------------------------------------

// ---------- プライベートメソッド開始 -----------------------------------------
/**
 * get_time 現在時刻を返す
 *
 * @returns {String}
 */

// const get_time = function() {
//   return new Date().toISOString();
// };

// プライベートメソッド/get_timestamp_time/開始 --------------------------------
/**
 * get_timestamp_time 現在時刻をyyyy-mm-ss hh:mm:ss形式で返す
 *
 * @returns {String} yyyy-mm-dd hh:mm:ss
 */
const get_timestamp_time = function() {
  let time = new Date();

  function pad(number) {
    if (number < 10) {
      return '0' + number;
    }
    return number;
  }
  return time.getUTCFullYear() +
    '-' + pad(time.getUTCMonth() + 1) +
    '-' + pad(time.getUTCDate()) +
    ' ' + pad(time.getUTCHours()) +
    ':' + pad(time.getUTCMinutes()) +
    ':' + pad(time.getUTCSeconds());
};
// プライベートメソッド/get_timestamp_time/終了 --------------------------------
// ---------- プライベートメソッド終了 -----------------------------------------

// ---------- パブリックメソッド開始 -------------------------------------------

// パブリックメソッド/existy/開始 ----------------------------------------------
/**
 * existy 存在するかどうかの判別
 * 存在しないことを表す値はnullとundefined
 *
 * @param x
 * @returns {Boolean}
 */
const existy = function(x) {
  return x != null;
};
// パブリックメソッド/existy/終了 ----------------------------------------------

// パブリックメソッド/truthy/開始 ----------------------------------------------
/**
 * truthy 与えられた値がtrueかどうか
 *
 * @param x 与えられた値
 * @returns {Boolean}
 */
const truthy = function(x) {
  return (x !== false) && existy(x);
};
// パブリックメソッド/truthy/終了 ----------------------------------------------

// パブリックメソッド/cat/開始 -------------------------------------------------
const cat = function(/* いくつかの配列 */) {
  const head = _.first(arguments);
  if (existy(head)) {
    return head.concat.apply(head, _.drop(arguments));
  }
  else {
    return [];
  }
};
// パブリックメソッド/cat/終了 -------------------------------------------------

// パブリックメソッド/construct/開始 -------------------------------------------
const construct = function(head, tail) {
  return cat([head], _.toArray(tail));
};
// パブリックメソッド/construct/終了 -------------------------------------------

// パブリックメソッド/div/開始 -------------------------------------------------
const div = function(n, d) {
  return n / d;
};
// パブリックメソッド/div/開始 -------------------------------------------------

// パブリックメソッド/partial1/開始 --------------------------------------------
/**
 * partial1 1つめの引数を部分適用する関数
 *
 * @param fun 関数
 * @param arg1
 * @returns {undefined} partial1から返される関数は、partial1の実行時にその引数
 * arg1を確保し、引数リストの先頭に追加します
 */
const partial1 = function(fun, arg1) {
  return function(/* args */) {
    let args = construct(arg1, arguments);

    return fun.apply(fun, args);
  };
};
// パブリックメソッド/partial1/終了 --------------------------------------------

// パブリックメソッド/repeatedly/開始 ------------------------------------------
/**
 * repeatedly ある計算を何度か繰り返す関数
 *
 * @param times 繰り返す回数
 * @param fun ある計算
 * @returns {Array}
 */
const repeatedly = function(times, fun) {
  return _.map(_.range(times), fun);
};
// パブリックメソッド/repeatedly/終了 ------------------------------------------

// パブリックメソッド/isArray/開始 ---------------------------------------------
/**
 * isArray 配列かどうかを判定する
 *
 * @param value 判定する値
 * @returns {Boolean}
 */

const isArray = function (value) {
  return value &&
    typeof value === 'object' &&
    typeof value.length === 'number' &&
    typeof value.splice === 'function' &&
    !(value.propertyIsEnumerable('length'));
};
// パブリックメソッド/isArray/終了 ---------------------------------------------

/**
 * isNumber 数値かどうかを判定する
 *
 * @param value 判定する値
 * @returns {Boolean}
 */
const isNumber = function(value) {
  return typeof value === 'number' &&
    isFinite(value);
};

/**
 * getRandomInt 呼び出されるたびにランダムな整数を返す
 *
 * @param min 最小値
 * @param max 最大値
 * @returns {Number} 整数
 */

const getRandomInt = function(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const timestampLog = function(text) {
  console.log(get_timestamp_time(), text);
};
const initModule = function () {
  timestampLog('util initModule start');
};

module.exports = {
  existy        : existy,
  truthy        : truthy,
  cat           : cat,
  construct     : construct,
  div           : div,
  partial1      : partial1,
  repeatedly    : repeatedly,
  isArray       : isArray,
  isNumber      : isNumber,
  getRandomInt  : getRandomInt,
  timestampLog  : timestampLog,
  initModule    : initModule
};
// ---------- パブリックメソッド終了 --------------------------------

// ---------- モジュール初期化開始   --------------------------------
timestampLog('util start');
_.times(4, function() {console.log('Major');});
// ---------- モジュール初期化終了   --------------------------------
