/*
 * puppet.js - Node.jsのモジュールのテンプレート
*/

//  パブリックメソッド一覧
//    + ブラウザの操作
//      + ブラウザのオープン、クローズ
//          setLaunchOptions    : ブラウザをラウンチするときのオプション
//          launch              : ブラウザをラウンチする
//          openBrowser         : ブラウザをオープンする。launchの書き換え
//          closeBrowser        : ブラウザをクローズする
//      + ページのオーブン、クローズ
//          setSiteOptions      : アクセスするサイトの情報をセットする
//          openPage            : 新しいページを開く
//          gotoPage            : 与えられたURLに移動する
//          closePage           : ページを閉じる
//      + input要素、セレクタへのテキスト入力,選択
//          inputTextbox        : テキストボックスに文字を入力する
//          selectSelector      : セレクトボックスを選択する
//      + ボタンの一回クリック、循環クリック
//          clickElement        : HTML要素をクリックする
//      + クローリング: Anchorタグを取得して循環する
//
//    + HTML要素の選択、取得
//      + タグの取得
//          findAll             : タグを取得してリストで返す
//      + タグの分析
//          analyzeTag          : タグの情報を返す
//      + 個別処理
//          fetchTableData      : テーブルの情報をオブジェクトで返す
//      + イメージファイルの取得
//          fetchImageFile      : イメージファイルを返す
//      + ソースコードの取得
//          fetchSourceCode     : ソースコードを返す
//          fetchSourceCodes    : 再帰処理でソースコードを返す
//          fetchAll            : fetchSourceCodesの書き換え
//      + リンクの取得
//          fetchLinks          : 全てのリンクを返す
//          fetchInternalLinks  : 内部リンクを返す
//
//    + 配列関連
//
//  evaluate            : ページを評価する
//
// ---------- プライベートプロパティ開始 ---------------------------------------
'use strict';
const LINK_LEVEL    = 3;
const TARGET_URL    = 'https://nodejs.org/api/';
const debug         = require('debug')('puppet');
const puppeteer     = require('puppeteer');
const {TimeoutError} = require('puppeteer/Errors');
const async         = require('async');
const filesystem    = require('./filesystem');
const util          = require('./util');

let
  list ={},
  // ラウンチするときのオプション
  launch_option,
  // puppeteerのbrowserの定義
  browser,
  page,
  // origin_url,
  base_url,
  current_url,
  current_page;

filesystem.config({pathname: 'download'});

// ---------- プライベートプロパティ終了 ---------------------------------------
debug('Hello!');

// ---------- プライベートメソッド開始 -----------------------------------------
// プライベートメソッド/open_browser/開始 --------------------------------------
const open_browser = async (option) => {
  launch_option = option || launch_option;

  browser = await puppeteer.launch(launch_option);

  return browser;
};
// プライベートメソッド/open_browser/終了 --------------------------------------

// プライベートメソッド/open_page/開始 -----------------------------------------
const open_page = async () => {

  page = await browser.newPage();

  // エラー処理
  // page.on('error', error => {
  //   console.log('error happen at the page: ', error);
  // });
  // page.on('pageerror', pageerror => {
  //   console.log('pageerror occurred: ', pageerror);
  // });
  page.on('requestfailed', (request) => {
    console.log(request.url() + ' ' + request.failure().errorText);
  });

  // ページがロードされたときの処理
  // page.once('load', async () => {
  //   console.log(await page.title() + 'のページをロードしました。');
  // });

  return page;
};
// プライベートメソッド/open_page/終了 -----------------------------------------

// プライベートメソッド/goto_page/開始 -----------------------------------------
const goto_page = async (url) => {
  await page.goto(url);
};
// プライベートメソッド/goto_page/終了 -----------------------------------------

// プライベートメソッド/close_page/開始 ----------------------------------------
// const close_page = async () => {
//   await page.close();
// };
// プライベートメソッド/close_page/終了 ----------------------------------------

// プライベートメソッド/fetch_file/開始 ----------------------------------------
const fetch_file = async (image_url) => {
  let
    image_page,
    buffer;

  // const browser = await puppeteer.launch();

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

  // image_page = await browser.newPage();

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
// プライベートメソッド/fetch_file/終了 ----------------------------------------

// プライベートメソッド/follow_link/開始 ---------------------------------------
const follow_link = async (site_url, func) => {
  let
    // index,
    current_value,
    internalLinks = [];

  // 再帰の深さのチェック

  try {
    internalLinks = await func(site_url);
  }
  catch (error) {
    console.log('内部リンクの取得でエラーが発生しました');
    console.log(error);
  }

  // 内部リンクをたどる
  if (internalLinks) {
    for (current_value of internalLinks) {
      // 再帰呼出し
      await follow_link(current_value, func);
    }
  }

};
// プライベートメソッド/follow_link/終了 ---------------------------------------

// プライベートメソッド/set_various_url/開始 -----------------------------------
const set_various_url = (site_url) => {
  let
    urls,
    url_class;

  // URLクラスを生成する
  url_class = new URL(site_url);

  // current_urlをセットする
  current_url = url_class.href;

  // base_urlをセットする
  urls = current_url.split('/');
  urls.pop();
  base_url = urls.join('/');

  // origin_urlをセットする
  // origin_url = url_class.origin;
};
// プライベートメソッド/set_various_url/終了 -----------------------------------

// プライベートメソッド/get_current_page/開始 ----------
const get_current_page = () => {
  return current_page;
};
// プライベートメソッド/get_current_page/終了 ----------

// プライベートメソッド/open_func_close/開始 -----------
const open_func_close = async (site_url, func) => {
  let
    results;

  // 補足されなかったエラーを表示する。
  process.on('unhandledRejection', console.dir);

  // グローバルに定義してあるorigin_url,base_url,current_urlに値をセットする
  set_various_url(site_url);

  // ブラウザがオープンしていなければオープンする

  browser = await open_browser(launch_option);

  // blankページをオープンする
  // page = await browser.newPage();
  page = await open_page();

  // 現在のページにセットする
  current_page = page;

  // current_urlに移動する
  await goto_page(current_url);

  // リダイレクトされていることがあるので再度origin_url,base_url,current_urlに
  // 値をセットする
  set_various_url(await page.url());

  // 引数で与えられた関数を実行する
  results = await func();

  // ページをクローズする
  // await close_page();

  // 結果を返す
  return results;

};
// プライベートメソッド/open_func_close/終了 -----------

// ---------- プライベートメソッド終了 -----------------------------------------

// ---------- パブリックメソッド開始 -------------------------------------------
// パブリックメソッド/initModule/開始 ------------------------------------------
const initModule = function () {
  util.timestampLog('puppet initModule start');
};
// パブリックメソッド/initModule/終了 ------------------------------------------

// パブリックメソッド/setSiteOptions/開始 --------------------------------------
const setSiteOptions = function (site_options) {

  util.timestampLog('puppet setSiteOptions start');
  current_url = new URL(site_options.url);

  base_url = current_url.origin;
};
// パブリックメソッド/setSiteOptions/終了 --------------------------------------

// パブリックメソッド/setLaunchOptions/開始 ------------------------------------
const setLaunchOptions = (option) => {
  launch_option = option;
};
// パブリックメソッド/setLaunchOptions/終了 ------------------------------------

// パブリックメソッド/launch/開始 ----------------------------------------------
const launch = async () => {
  util.timestampLog('puppet launch start');

  browser = await puppeteer.launch(launch_option);

};
// パブリックメソッド/launch/終了 ----------------------------------------------

// パブリックメソッド/openBrowser/開始 -----------------------------------------
const openBrowser = async (option) => {
  util.timestampLog('puppet openBrowser start');
  return await puppeteer.launch(option);
};
// パブリックメソッド/openBrowser/終了 -----------------------------------------

// パブリックメソッド/closeBrowser/開始 ----------------------------------------
const closeBrowser = async (browser) => {
  util.timestampLog('puppet closeBrowser start');
  return await browser.close();
};
// パブリックメソッド/closePage/終了 -------------------------------------------

// パブリックメソッド/openPage/開始 --------------------------------------------
const openPage = async (browser) => {

  util.timestampLog('puppet openPage start');

  return await browser.newPage();

};
// パブリックメソッド/openPage/終了 --------------------------------------------

// パブリックメソッド/gotoPage/開始 --------------------------------------------
const gotoPage = async (page, url) => {

  util.timestampLog('puppet gotoPage start');

  if (url) {
    try {
      await page.goto(url, {waitUntil: 'domcontentloaded'});
      current_url = new URL(await page.url());
      base_url = current_url.origin;

      // 現在のページにセットする
      current_page = page;
      util.timestampLog(await page.title() + 'に遷移しました');
      return page;
    }
    catch (error) {
      util.timestampLog(error.message);

      if (error instanceof TimeoutError) {
        util.timestampLog(url + 'をオープンするときにタイムアウトエラーが発生しました');
      }
      else if (error instanceof Error) {
        if (error.toString().includes('ERR_NAME_NOT_RESOLVED')) {
          util.timestampLog(url + 'をオープンするときにエラーが発生しました');
        }
      }
      return false;
    }
  }
  else {
    util.timestampLog('2番目の引数にURLを指定してください');
    return false;
  }

};
// パブリックメソッド/gotoPage/終了 --------------------------------------------

// パブリックメソッド/closePage/開始 -------------------------------------------
const closePage = async (page) => {
  util.timestampLog('puppet closePage start');
  util.timestampLog((await page.title()) + ' のページを閉じます');
  await page.close();
};
// パブリックメソッド/closePage/終了 -------------------------------------------

// パブリックメソッド/fetchSourceCode/開始 -------------------------------------
const fetchSourceCode = async (site_url) => {

  console.log('puppet fetchSourceCode start');

  const page_content = await open_func_close(site_url, async () => {
    page = get_current_page();

    return await page.content();
  });

  console.log('puppet fetchSourceCode end');

  return page_content;
};
// パブリックメソッド/fetchSourceCode/終了 -------------------------------------

// パブリックメソッド/fetchSourceCodes/開始 ------------------------------------
// 目的     : リンクをたどってソースコードを配列で返す
// 引数     :
//  * level     - 何階層までたどるかの数値
//  * start_url - リンクをたどる最初のページ
// 設定     :
// 動作     :
//  * 再帰関数のfollow_linkを呼ぶ。
//  * follow_linkで処理する関数でresultsにあるurlだと処理をしないので
//    falseを返す
// 戻り値   : results
// 例外発行 : なし
// 使用例   :
//
const fetchSourceCodes = async (site_url) => {
  let
    prosecced_site = [],
    results = [];

  console.log('fetchSourceCodes start');

  // ブラウザを開く
  if (!browser) {
    browser = await puppeteer.launch(launch_option);
  }

  // リンクをたどる
  await follow_link(site_url, async (site_url) => {
    let
      source_code,
      result_object = {};

    // urlが'https://nodejs.org/api/'のように'/'で終わっていたら
    // https://nodejs.org/api/index.htmlにする
    if (site_url.endsWith('/') === true) {
      site_url += 'index.html';
    }

    if (prosecced_site.indexOf(site_url) === -1) {
      // このページが処理済リストになかったら処理済にする
      prosecced_site.push(site_url);

      // このページの内部リンクを取得する
      const internalLinks = await open_func_close(site_url, async () => {
        // 処理中のページを取得する
        page = get_current_page();

        // <a>タグをa_tag_listに格納し<a>タグのhref属性の値を返す
        const href_list = await page.$$eval('a', a_tag_list => {
          return a_tag_list.map(anchor => anchor.href);
        });

        // 処理中のurlで始まるリンクだけを返す
        const internalLinks = href_list.filter(
          item => (
            // アイテムがベースurlから始まっている
            (item.startsWith(base_url) === true) &&
            // アイテムに'#'が含まれていない
            (item.includes('#') === false) &&
            // このページのurlは除外する
            (item !== current_url)
          )
        );

        // ソースコードを取得する
        source_code = await page.content();

        // サイトのurlとソースコードを追加する
        result_object.name = site_url;
        result_object.code = source_code;

        // 結果を追加する
        results.push(result_object);

        return internalLinks;
      });

      return internalLinks;
    }
    else {
      // すでにおとずれているサイト
      return false;
    }

  });

  console.log('fetchSourceCodes end');

  return results;
};
// パブリックメソッド/fetchSourceCodes/終了 ------------------------------------

// パブリックメソッド/fetchAll/開始 --------------------------------------------
const fetchAll = async (url, level) => {
  // 補足されなかったエラーを表示する。
  process.on('unhandledRejection', console.dir);

  // 最大レベルチェック
  if (level >= LINK_LEVEL) return;

  // 既出のサイトは無視する
  if (list[url]) return;
  list[url] = true;

  // 基準ページ以外なら無視する
  let us = TARGET_URL.split('/');
  us.pop();
  let base = us.join('/');
  if (url.indexOf(base) < 0) return;

  // HTMLを取得する
  // ブラウザを開く
  if (!browser) {
    browser = await puppeteer.launch(launch_option);
  }

  // blankページをオープンする
  page = await browser.newPage();

  // await page.goto(url, {waitUntil: 'networkidle2'});
  await page.goto(url, {waitUntil: 'domcontentloaded'});

  // <a>タグをa_tag_listに格納し<a>タグのhref属性の値を返す
  let href_list = await page.$$eval('a', a_tag_list => {
    return a_tag_list.map(anchor => anchor.href);
  });

  // ページを保存(ファイル名を決定する)
  if (url.substr(url.length-1, 1) === '/') {
    // インデックスを自動追加
    url += 'index.html';
  }

  let savepath = url.split('/').slice(2).join('/');

  await filesystem.saveFile(savepath, await page.content());

  await page.close();

  async.forEachSeries(href_list, async (current_url) => {
    // '#'以降を無視する
    // 末尾の'#'を消す
    current_url = current_url.replace(/#.*$/, '');
    await fetchAll(current_url, level + 1);
  }, error => {
    if (error) {
      console.log(error);
    }
  });

};
// パブリックメソッド/fetchAll/終了 --------------------------------------------

// パブリックメソッド/findAll/開始 ---------------------------------------------
// 目的     : 引数で与えられたページから引数のタグを取得してリストで返す
// 引数     :
//  * page  - 対象のページ
//  * tag   - 取得するタグ
//  * text  - 指定されている場合、この文字が含まれているものだけを返す
// 設定     :
// 動作     :
// 戻り値   : {
//  outerHTML : タグ全体,
//  innerHTML : 子要素,
//  id        : id属性,
//  href      : href属性,
//  text      : 文字列
// }
// 例外発行 : なし
// 使用例   :
//
const findAll = async (page, tag, text) => {
  let selector;

  util.timestampLog('puppet findAll start');

  if (util.isArray(tag)) {
    selector = tag[0];
    for (let i = 1; i < tag.length; i++) {
      selector += ', ' + tag[i];
    }
    console.log(selector);
  }
  else {
    selector = tag;
    console.log(selector);
  }

  const result_list = await page.$$eval(selector, (tag_list) => {
    return tag_list.map((tag) => {
      return {
        outerHTML   : tag.outerHTML,
        innerHTML   : tag.innerHTML,
        id          : tag.id,
        class       : tag.className,
        href        : tag.href,
        name        : tag.name,
        innerText   : tag.innerText,
        textContent : tag.textContent
      };
    });
  });

  if (text) {
    const results = result_list.filter(
      item => (
        // アイテムにテキストが含まれるか
        (item.innerText.includes(text) === true)
      )
    );
    return results;
  }
  else {
    return result_list;
  }

};
// パブリックメソッド/findAll/終了 ---------------------------------------------

// パブリックメソッド/analyzeTag/開始 ------------------------------------------
const analyzeTag = async (page, tag) => {
  const item = await page.$(tag);
  const outerHTML = await (await item.getProperty('outerHTML')).jsonValue();
  const innerHTML = await (await item.getProperty('innerHTML')).jsonValue();
  const textContent = await (await item.getProperty('textContent')).jsonValue();
  const id = await (await item.getProperty('id')).jsonValue();
  const class_value = await (await item.getProperty('className')).jsonValue();

  if (item !== null) {
    return {
      outerHTML   : outerHTML,
      innerHTML   : innerHTML,
      textContent : textContent,
      id          : id,
      class       : class_value
    };
  }
  else {
    console.log(tag + ' タグが見つかりませんでした');
    return false;
  }

};
// パブリックメソッド/analyzeTag/終了 ------------------------------------------

// パブリックメソッド/fetchTableData/開始 --------------------------------------
// パブリックメソッド/fetchInnerText/開始 --------------------------------------
const fetchTableData = async (page, selector) => {

  const results = await page.$$eval(selector, (tag_list) => {
    return tag_list.map(tag => tag.innerText);
  });

  // const results = await page.evaluate(() => {

  //   const li_tag = Array.from(document.querySelectorAll(selector));

  //   return li_tag.map((tag) => {
  //     return tag;
  //   })(selector);

  // });

  return results;
};
// パブリックメソッド/fetchTableData/終了 --------------------------------------

// パブリックメソッド/fetchLinks/開始 ------------------------------------------
const fetchLinks = async (page) => {

  util.timestampLog('puppet fetchLinks start');

  if (page) {
    const links = await page.evaluate(() => {

      const a_tag = Array.from(document.querySelectorAll('a'));

      return a_tag.map((a_tag) => {
        return a_tag.href;
      });

    });

    return links;
  }
  else {
    return [];
  }

};
// パブリックメソッド/fetchLinks/終了 ------------------------------------------

// パブリックメソッド/fetchInternalLinks/開始 ----------------------------------
// 目的     : アクティブなページのリンクを配列で返す
// 引数     : なし
// 設定     :
// 動作     :
//  * 変数href_listにページからanchorタグを取り出しhref属性の値をセットする。
//  * 変数href_listから
//    カレントのurlで始まり、かつ'#'を含まなく、かつ完全一致しないものを
//    resultsにセットする。
// 戻り値   : results
// 例外発行 : なし
// 使用例   :
//
const fetchInternalLinks = async (page) => {

  util.timestampLog('puppet fetchInternalLinks start');

  const href_list = await page.$$eval('a', (a_tag_list) => {
    return a_tag_list.map(anchor => anchor.href);
  });

  // 処理中のurlで始まるリンクだけを返す
  const results = href_list.filter(
    item => (
      // アイテムが現在のurlから始まっている
      (item.startsWith(base_url) === true) &&
      // アイテムに'#'が含まれていない
      (item.includes('#') === false) &&
      (item !== current_url)
    )
  );

  util.timestampLog('puppet fetchInternalLinks end');

  return results;
};
// パブリックメソッド/fetchInternalLinks/終了 ----------------------------------

// パブリックメソッド/fetchImageFile/開始 --------------------------------------
const fetchImageFile = async (site_url, selector) => {
  let
    image_array = [];

  image_array = await open_func_close(site_url, async () => {
    let
      image_url,
      current_url,
      buffer_name,
      image_buffer,
      image_object;

    page = get_current_page();

    const imageUrls = await page.$$eval(selector, img_tag_list => {
      // imgタグのsrcプロパティを返す
      return img_tag_list.map(image => image.src);
    });

    for (image_url of imageUrls) {
      // イメージのバッファを取得して
      current_url = new URL(image_url);

      image_buffer = await fetch_file(current_url.href);

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
  });

  return image_array;

};

// パブリックメソッド/fetchImageFile/終了 --------------------------------------

// パブリックメソッド/fetchImage/開始 ------------------------------------------
const fetchImage = async (page, selector, name) => {

  const original_url = await page.url();

  const image_url = await page.$eval(selector, item => item.src);

  const new_page = await page.goto(image_url, {waitUntil: 'domcontentloaded'});

  const result = {name: name, buffer: await new_page.buffer()};

  page = await page.goto(original_url, {waitUntil: 'domcontentloaded'});
  // await page.goBack({waitUntil: 'domcontentloaded'});

  return result;
};


// パブリックメソッド/fetchImage/終了 ------------------------------------------

// パブリックメソッド/inputTextbox/開始 ----------------------------------------
const inputTextbox = async (url, name) => {

  console.log('puppet inputTextbox start');

  await open_func_close(url, async () => {
    page = get_current_page();

    await page.type('input[name=' + name + ']', 'Puppeteer');
    await page.keyboard.press('Enter');

    return page;
  });

};
// パブリックメソッド/inputTextbox/終了 ----------------------------------------

// パブリックメソッド/selectSelector/開始 --------------------------------------
// 目的     : 引数で与えられたページから引数のタグを取得してリストで返す
// 引数     :
//  * page  - 対象のページ
//  * tag   - 取得するタグ
//  * text  - 指定されている場合、この文字が含まれているものだけを返す
// 設定     :
// 動作     :
// 戻り値   : {
//  outerHTML : タグ全体,
//  innerHTML : 子要素,
//  id        : id属性,
//  href      : href属性,
//  text      : 文字列
// }
// 例外発行 : なし
// 使用例   :
//
const selectSelector = async (page, selector, value) => {
  util.timestampLog('puppet selectSelector start');
  util.timestampLog('セレクター: ' + selector + ' の値を' + value + ' にセットします');
  try {
    await Promise.all([
      page.waitForNavigation({waitUntil: 'load'}),

      page.evaluate((selector, value) => {
        let element = document.querySelector(selector);
        element.querySelector('select [value="' + value + '"]').selected = true;

        let event = new Event('change', {bubbles: true});
        event.simulated = true;

        element.dispatchEvent(event);
      }, selector, value)
    ]);
    util.timestampLog(await page.title() + 'に遷移しました');
  }
  catch (error) {
    util.timestampLog(error.message);

    if (error instanceof Error) {
      if (error.toString().includes('No node found for selector')) {
        util.timestampLog('セレクター:' + selector + 'が不正です');
      }
      else if (error.toString().includes('Cannot find context with specified id')) {
        util.timestampLog('セレクター:' + selector + 'が不正です');
      }
    }
  }
  util.timestampLog('puppet selectSelector end');
  return page;
};
// パブリックメソッド/selectSelector/終了 --------------------------------------

// パブリックメソッド/clickElement/開始 ----------------------------------------
// 目的     : 引数で与えられたページから引数のタグを取得してリストで返す
// 引数     :
//  * page  - 対象のページ
//  * tag   - 取得するタグ
//  * text  - 指定されている場合、この文字が含まれているものだけを返す
// 設定     :
// 動作     :
// 戻り値   : {
//  outerHTML : タグ全体,
//  innerHTML : 子要素,
//  id        : id属性,
//  href      : href属性,
//  text      : 文字列
// }
// 例外発行 : なし
// 使用例   :
//
const clickElement = async (page, selector) => {
  util.timestampLog('puppet clickElement start');
  util.timestampLog('セレクター: ' + selector + ' をクリックします。');
  try {
    await Promise.all([
      page.waitForNavigation({ waitUntil: 'load' }),
      page.click(selector)
    ]);
  }
  catch (error) {
    util.timestampLog(error.message);

    if (error instanceof Error) {
      if (error.toString().includes('No node found for selector')) {
        util.timestampLog('セレクター:' + selector + 'が不正です');
      }
    }
    return false;
  }
  util.timestampLog(await page.title() + 'に遷移しました');
  util.timestampLog('puppet clickElement end');
  return page;
};
// パブリックメソッド/clickElement/終了 ----------------------------------------

// パブリックメソッド/evaluate/開始 --------------------------------------------
const evaluate = async (site_url) => {

  console.log('puppet evaluate start');

  const demensions = await open_func_close(site_url, async () => {
    page = get_current_page();

    // Get the "viewport" of the page, as reported by the page.
    const demensions = await page.evaluate(() => {
      return {
        width             : document.documentElement.clientWidth,
        height            : document.documentElement.clientHeight,
        deviceScaleFactor : window.devicePixelRatio
      };
    });
    return demensions;
  });

  console.log(demensions);

};
// パブリックメソッド/evaluate/終了 --------------------------------------------

module.exports = {
  initModule          : initModule,
  setSiteOptions      : setSiteOptions,
  setLaunchOptions    : setLaunchOptions,
  openBrowser         : openBrowser,
  closeBrowser        : closeBrowser,
  launch              : launch,
  openPage            : openPage,
  gotoPage            : gotoPage,
  closePage           : closePage,
  clickElement        : clickElement,
  fetchSourceCode     : fetchSourceCode,
  fetchSourceCodes    : fetchSourceCodes,
  fetchAll            : fetchAll,
  fetchLinks          : fetchLinks,
  fetchInternalLinks  : fetchInternalLinks,
  findAll             : findAll,
  analyzeTag          : analyzeTag,
  fetchTableData      : fetchTableData,
  fetchImageFile      : fetchImageFile,
  fetchImage          : fetchImage,
  inputTextbox        : inputTextbox,
  selectSelector      : selectSelector,
  evaluate            : evaluate
};
// ---------- パブリックメソッド終了 -------------------------------------------

// ---------- モジュール初期化開始   -------------------------------------------
process.setMaxListeners(Infinity); // <== Important line
console.log('puppet module start');
// ---------- モジュール初期化終了   -------------------------------------------
//
