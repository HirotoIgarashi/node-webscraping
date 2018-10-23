/*
 * puppet.js - Node.jsのモジュールのテンプレート
*/

//  パブリックメソッド一覧
//  setSiteOptions      : アクセスするサイトの情報をセットする
//  setLaunchOptions    : ブラウザをラウンチするときのオプション
//  launch              : ブラウザをラウンチする
//  openPage            : ページを開く
//  fetchSourceCode     : ソースコードを返す
//  fetchSourceCodes    : ソースコードを返す
//  fetchLinks          : 全てのリンクを返す
//  fetchInternalLinks  : 内部リンクを返す
//  fetchImageFile      : イメージファイルを返す
//  evaluate            : ページを評価する
//  closePage           : ページを閉じる
//  close               : ブラウザをクローズする
//
// ---------- プライベートプロパティ開始 ----------
'use strict';
const
  debug         = require('debug')('puppet'),
  puppeteer     = require('puppeteer');

var
  // ラウンチするときのオプション
  launch_option,
  // puppeteerのbrowserの定義
  browser,
  page;

let
  current_url,
  base_url;

// ---------- プライベートプロパティ終了 ----------
debug('Hello!');

// ---------- プライベートメソッド開始 ------------
// プライベートメソッド/fetchFile/開始 ------------
const fetchFile = async (image_url) => {
  let
    image_page,
    buffer;

  const responseHandler = async (response) => {
    // responseが返ってきたときのイベントハンドラー

    if (response.url() !== image_url) {
      return;
    }

    try {
      buffer = await response.buffer();
    }
    catch (err) {
      console.error('response.buffer()! エラーが発生しました!');
      console.error(err);
    }

  };

  image_page = await browser.newPage();

  // responseが返ってきたときのイベントハンドラーを登録する
  image_page.on('response', responseHandler);

  // エラーをキャッチする
  image_page.on('error', async (error) => {
    console.error('error event! there was an error!');
    console.error(error);
  });

  // エラーをキャッチする
  image_page.on('pageerror', async (error) => {
    console.error('pageerror event! there was an error!');
    console.error(error);
  });

  try {
    await image_page.goto(image_url);
  }
  catch (error) {
    console.error(image_url + ' を取得するときにエラーが発生しました!');
    console.log(error);
    // image_page.removeListener('response', responseHandler);
    // responseリスナーを削除しようとしたが動作しなかった
    await image_page.close();
    return false;
  }

  await image_page.close();

  return buffer;

};
// プライベートメソッド/fetchFile/終了 ------------
// プライベートメソッド/fetchFileRecursive/開始 ---
// const fetchFileRecursive = async (level) => {
//   let
//     source_codes;
// 
//   if ( level === 0 ) {
//     return source_codes;
//   }
// 
//   level = level - 1;
// 
//   fetchFileRecursive(level);
// };
// プライベートメソッド/fetchFileRecursive/終了 ---
// ---------- プライベートメソッド終了 ------------

// ---------- パブリックメソッド開始 --------------
// パブリックメソッド/initModule/開始 -------------
const initModule = function () {
  console.log('puppet initModule start');
};
// パブリックメソッド/initModule/終了 -------------
// パブリックメソッド/setSiteOptions/開始 ---------
const setSiteOptions = function (site_options) {

  console.log('** puppet setSiteOptions start **');
  current_url = new URL(site_options.url);

  base_url = current_url.origin;

  console.log(base_url);

};
// パブリックメソッド/setSiteOptions/終了 -------------------------

// パブリックメソッド/setLaunchOptions/開始 -------------------
const setLaunchOptions = (option) => {
  launch_option = option;
};
// パブリックメソッド/setLaunchOptions/終了 -------------------

// パブリックメソッド/launch/開始 -----------------------------
const launch = async () => {
  console.log('** puppet launch start **');

  browser = await puppeteer.launch(launch_option);

};
// パブリックメソッド/launch/終了 -----------------------------

// パブリックメソッド/openPage/開始 ---------------------------
const openPage = async (urlString) => {
  let
    site_url;

  console.log('** puppet openPage start **');

  site_url = urlString || current_url;

  page = await browser.newPage();

  if (site_url) {
    await page.goto(site_url);
    current_url = new URL(await page.url());
    base_url = current_url.origin;
  }
  else {
    console.log('** urlが不正です **');
  }

};
// パブリックメソッド/openPage/終了 ---------------------------

// パブリックメソッド/fetchSourceCode/開始 --------------------------
const fetchSourceCode = async () => {
  const page_content = await page.content();

  return page_content;
};
// パブリックメソッド/fetchSourceCode/終了 --------------------------

// パブリックメソッド/fetchSourceCodes/開始 -----------------
const fetchSourceCodes = async (level) => {
  let
    link,
    index,
    source_codes = [],
    internalLinks = [];

  // 最大レベルチェック
  if (level === 0) {
    return source_codes;
  }

  source_codes.push(await fetchSourceCode());
  console.log(level);

  internalLinks = await fetchInternalLinks();

  for (index = 0; index < internalLinks.length; index = index + 1) {
    console.log(internalLinks[index]);
  }

  level = level - 1;

  await fetchSourceCodes(level);
};
// パブリックメソッド/fetchSourceCodes/終了 -----------------

// パブリックメソッド/fetchLinks/開始 -------------------------------
const fetchLinks = async () => {

  console.log('** puppet fetchLinks start **');
  debug('** puppet fetchLinks start **');

  const links = await page.evaluate(() => {

    const a_tag = Array.from(document.querySelectorAll('a'));

    return a_tag.map((a_tag) => {

      return a_tag.href;

    });

  });

  return links;

};
// パブリックメソッド/fetchLinks/終了 -------------------------------

// パブリックメソッド/fetchInternalLinks/開始 -----------------------
const fetchInternalLinks = async () => {
  const href_list = await page.$$eval('a', a_tag_list => {
    return a_tag_list.map(anchor => anchor.href);
  });

  const newArray = href_list.filter(item => item.startsWith(base_url) === true);
  return newArray;
};
// パブリックメソッド/fetchInternalLinks/終了 -----------------------

// パブリックメソッド/fetchImageFile/開始 ---------------------------
const fetchImageFile = async (selector) => {
  let
    image_url,
    current_url,
    buffer_name,
    image_buffer,
    image_object,
    image_array = [];

  const imageUrls = await page.$$eval(selector, img_tag_list => {
    // imgタグのsrcプロパティを返す
    return img_tag_list.map(image => image.src);
  });

  for (image_url of imageUrls) {
    // イメージのバッファを取得して
    current_url = new URL(image_url);

    image_buffer = await fetchFile(current_url.href);

    if (image_buffer) {
      image_object = {};

      // pathの最後の要素を取り出す
      buffer_name = current_url.href.split('/').pop();

      image_object.name = buffer_name;
      image_object.buffer = image_buffer;

      image_array.push(image_object);
    }
  }

  return image_array;

};

// パブリックメソッド/fetchImageFile/終了 ---------------------------
// パブリックメソッド/evaluate/開始 ---------------------------------
const evaluate = async () => {

  console.log('** puppet evaluate start **');

  // Get the "viewport" of the page, as reported by the page.
  const demensions = await page.evaluate(() => {
    return {
      width             : document.documentElement.clientWidth,
      height            : document.documentElement.clientHeight,
      deviceScaleFactor : window.devicePixelRatio
    };
  });

  console.log(demensions);

};
// パブリックメソッド/evaluate/終了 ---------------------------

// パブリックメソッド/closePage/開始 --------------------------
const closePage = async () => {
  console.log('** puppet closePage start **');
  page.close();
};
// パブリックメソッド/closePage/終了 --------------------------

// パブリックメソッド/close/開始 ------------------------------
const close = () => {
  console.log('** puppet close start **');
  browser.close();
};
// パブリックメソッド/close/終了 ------------------------------

module.exports = {
  initModule          : initModule,
  setSiteOptions      : setSiteOptions,
  setLaunchOptions    : setLaunchOptions,
  launch              : launch,
  openPage            : openPage,
  fetchSourceCode     : fetchSourceCode,
  fetchSourceCodes    : fetchSourceCodes,
  fetchLinks          : fetchLinks,
  fetchInternalLinks  : fetchInternalLinks,
  fetchImageFile      : fetchImageFile,
  evaluate            : evaluate,
  closePage           : closePage,
  close               : close
};
// ---------- パブリックメソッド終了 --------------

// ---------- モジュール初期化開始   --------------
console.log('** puppet module start **');
// ---------- モジュール初期化終了   --------------
