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

// プライベートメソッド/isIndexed/開始 -----------------------------------------
const isIndexed = function(data) {
  return _.isArray(data) || _.isString(data);
};
// プライベートメソッド/isIndexed/開始 -----------------------------------------

// プライベートメソッド/fail/開始 ----------------------------------------------
const fail = function(thing) {
  // throw new Error(thing);
  console.log(['失敗:', thing].join(''));
};
// プライベートメソッド/fail/終了 ----------------------------------------------

// プライベートメソッド/divide/開始 --------------------------------------------
const divide = (a, b) => a / b;
// プライベートメソッド/divide/終了 --------------------------------------------

// プライベートメソッド/size/開始 ----------------------------------------------
const size = arr => arr.length;
// プライベートメソッド/size/終了 ----------------------------------------------

// プライベートメソッド/total/開始 ---------------------------------------------
const total = arr => arr.reduce(sum);
// プライベートメソッド/total/終了 ---------------------------------------------

// プライベートメソッド/sum/開始 -----------------------------------------------
const sum = (total, current) => total + current;
// プライベートメソッド/sum/終了 -----------------------------------------------

// ---------- プライベートメソッド終了 -----------------------------------------

// ---------- パブリックメソッド開始 -------------------------------------------

// パブリックメソッド/trim/開始 ------------------------------------------------
/**
 * trim :: String -> String
 * 前後のスペースをカット
 *
 * @param {String}
 * @returns {String}
 */
const trim = (str) => str.replace(/^\s+|\s+$/g, '');
// パブリックメソッド/trim/終了 ------------------------------------------------

// パブリックメソッド/normalize/開始 -------------------------------------------
/**
 * normalize :: String -> String
 * 入力文字列からダッシュ記号を除去
 *
 * @returns {String}
 */
const normalize = (str) => str.replace(/-/g, '');
// パブリックメソッド/normalize/終了 -------------------------------------------

// パブリックメソッド/average/開始 ---------------------------------------------
const average = arr => divide(total(arr), size(arr));
// パブリックメソッド/average/終了----------------------------------------------

// パブリックメソッド/run/開始 -------------------------------------------------
const run = (...functions) => x => {
  functions.reverse().forEach(func => x = func(x));
  return x;
};
// パブリックメソッド/run/終了 -------------------------------------------------

// パブリックメソッド/increment/開始 -------------------------------------------
/**
 * increment 与えられた引数に1を加える
 *
 * @returns {Number}
 */
const increment = counter => counter + 1;
// パブリックメソッド/increment/終了 -------------------------------------------

// パブリックメソッド/nth/開始 -------------------------------------------------
/**
 * nth インデックス指定可能なデータ型をもったデータから、有効なインデックスで
 * 指定される要素を返す
 *
 * @param a インデックス指定可能なデータ
 * @param index インデックス
 * @returns {undefined}
 */
const nth = function(a, index) {
  if (!_.isNumber(index)) {
    fail('インデックスは数値である必要があります');
    return false;
  }
  if (!isIndexed(a)) {
    fail('インデックス指定可能ではないデータ型はサポートされていません');
    return false;
  }
  if ((index < 0) || (index > a.length - 1)) {
    fail('インデックスは範囲外です');
    return false;
  }
  return a[index];
};
// パブリックメソッド/nth/終了 -------------------------------------------------

// パブリックメソッド/second/開始 ----------------------------------------------
const second = function(a) {
  return nth(a, 1);
};
// パブリックメソッド/second/終了 ----------------------------------------------

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

// パブリックメソッド/doWhen/開始 ----------------------------------------------
const doWhen = function(cond, action) {
  if (truthy(cond)) {
    return action();
  }
  else {
    return undefined;
  }
};
// パブリックメソッド/doWhen/終了 ----------------------------------------------

// パブリックメソッド/invoker/開始 ---------------------------------------------
/**
 * invoker メソッドを引数に取り、ターゲットとなるオブジェクトでそのメソッドを
 * 実行する関数を返す
 *
 * @param name
 * @param method
 * @returns {undefined}
 */
const invoker = function(name, method) {
  return function(target /* 任意の数の引数 */) {
    if (!existy(target)) {
      fail('Must provide a target');
    }

    var targetMethod = target[name];
    var args = _.drop(arguments);

    return doWhen((existy(targetMethod) && method === targetMethod), function() {
      return targetMethod.apply(target, args);
    });
  };
};
// パブリックメソッド/invoker/終了 ---------------------------------------------

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
/**
 * div 割り算の計算結果を返す
 *
 * @param n 割られる数
 * @param d 悪数
 * @returns {Number}
 */
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

// パブリックメソッド/deepClone/開始 -------------------------------------------
const deepClone = function(obj) {
  if (!existy(obj) || !_.isObject(obj)) {
    return obj;
  }

  let temp = new obj.constructor();
  for (let key in obj) {
    if (obj.hasOwnProperty(key)) {
      temp[key] = deepClone(obj[key]);
    }
  }
  return temp;
};
// パブリックメソッド/deepClone/終了 -------------------------------------------

// パブリックメソッド/curry2/開始 ----------------------------------------------
/**
 * curry2 関数を引数にとり、2段階までカリー化を行う
 *
 * @param fun
 * @returns {undefined}
 */
const curry2 = function(fun) {
  return function(secondArg) {
    return function(firstArg) {
      return fun(firstArg, secondArg);
    };
  };
};
// パブリックメソッド/curry2/終了 ----------------------------------------------

// パブリックメソッド/merge/開始 -----------------------------------------------
const merge = function(/* 任意の数のオブジェクト */) {
  return _.extend.apply(null, construct({}, arguments));
};
// パブリックメソッド/merge/開始 -----------------------------------------------

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

// パブリックメソッド/isEmpty/開始 ---------------------------------------------
/**
 * isEmpty ''が与えられるとtrueを返す。' '(空白)でもtrueを返すようにtrim()を適用
 * している。
 *
 * @param s 文字列
 * @returns {Boolean}
 */
const isEmpty = s => !s || !s.trim();
// パブリックメソッド/isEmpty/終了 ---------------------------------------------

// パブリックメソッド/isValid/開始 ---------------------------------------------
/**
 * isValid 引数valが未定義ではなく、nullでもない場合trueを返す
 *
 * @returns {Boolean}
 */
const isValid = val => !_.isUndefined(val) && !_.isNull(val);
// パブリックメソッド/isValid/終了 ---------------------------------------------

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

// ---------- パブリックプロパティ開始 -----------------------------
// パブリックプロパティ/rand/開始 ----------------------------------
var rand = partial1(_.random, 1);
// パブリックメソッド/rand/終了 -------------------------------------

// ---------- パブリックプロパティ終了 -----------------------------

module.exports = {
  trim          : trim,
  normalize     : normalize,
  average       : average,
  run           : run,
  increment     : increment,
  nth           : nth,
  second        : second,
  existy        : existy,
  truthy        : truthy,
  doWhen        : doWhen,
  invoker       : invoker,
  cat           : cat,
  construct     : construct,
  div           : div,
  partial1      : partial1,
  repeatedly    : repeatedly,
  deepClone     : deepClone,
  curry2        : curry2,
  rand          : rand,
  merge         : merge,
  isArray       : isArray,
  isNumber      : isNumber,
  isEmpty       : isEmpty,
  isValid       : isValid,
  getRandomInt  : getRandomInt,
  timestampLog  : timestampLog,
  initModule    : initModule
};
// ---------- パブリックメソッド終了 --------------------------------

// ---------- モジュール初期化開始   --------------------------------
timestampLog('util start');
_.times(4, function() {console.log('Major');});
// ---------- モジュール初期化終了   --------------------------------
