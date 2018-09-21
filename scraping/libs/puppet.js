/*
 * puppet.js - Node.jsのモジュールのテンプレート
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
  initModule,
  launch,
  close,
  launch_option,
  puppeteer = require('puppeteer');

// ---------- プライベートプロパティ終了 ----------

// ---------- プライベートメソッド開始 ------------

// ---------- プライベートメソッド終了 ------------

// ---------- パブリックメソッド開始 --------------
config = function (option) {
  launch_option = option;
};

initModule = function () {

  console.log("** puppet initModule start **");

};

launch = function () {
  (async () => {
    var
      browser,
      page,
      demensions;

    console.log("** puppet launch start **");
    console.log(launch_option);

    browser = await puppeteer.launch(launch_option);
    page    = await browser.newPage();
    await page.goto('https://example.com');

    // Get the "viewport" of the page, as reported by the page.
    demensions = await page.evaluate(() => {
      return {
        width             : document.documentElement.clientWidth,
        height            : document.documentElement.clientHeight,
        deviceScaleFactor : window.devicePixelRatio
      };

    });

    console.log(demensions);

    await browser.close();
  })();

};

close = function () {
  (async () => {
    await browser.close();
  })();
}
module.exports = {
  config      : config,
  initModule  : initModule,
  launch      : launch,
  close       : close
};
// ---------- パブリックメソッド終了 --------------

// ---------- モジュール初期化開始   --------------
console.log("** puppet start **");
// ---------- モジュール初期化終了   --------------
