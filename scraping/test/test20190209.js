const assert      = require('assert');
const delay       = require('delay');
// const _           = require('underscore');
const _           = require('lodash');
const puppet      = require('../libs/puppet');
const util        = require('../libs/util');
const filesystem  = require('../libs/filesystem');
let browser;
let page;
let child_page;

describe('util', function() {

  describe('normalize', function () {
    it('関数パイプラインのテスト', function () {
      assert.equal(util.normalize(util.trim(' 444-44-4444 ')), '444444444');
    });
  });

  describe('names', function () {
    it('チェーンのテスト', function () {
      var names = [
        'alonzo church',
        'Haskell curry',
        'stephen_kleene',
        'John von Neumann',
        'stephen_kleene'
      ];
      let result = _.chain(names)
                      .filter(util.isValid)
                      .map(s => s.replace(/_/, ' '))
                      .uniq()
                      .map(_.startCase)
                      .sort()
                      .value();
      assert.deepEqual(result, [
        'Alonzo Church',
        'Haskell Curry',
        'John Von Neumann',
        'Stephen Kleene'
      ]);
    });
  });

  describe('isEmpty', function () {
    it('空かどうかのテスト', function () {
      assert.equal(util.isEmpty('abc'), false);
    });
  });

  describe('isEmpty', function () {
    it('空かどうかのテスト', function () {
      assert.equal(util.isEmpty('  '), true);
    });
  });

  describe('isEmpty', function () {
    it('空かどうかのテスト', function () {
      assert.equal(util.isEmpty(''), true);
    });
  });

  describe('average', function () {
    it('平均値を求めるテスト', function () {
      var input = [80, 90, 100];
      assert.equal(util.average(input), 90);
    });
  });

  describe('increment', function () {
    it('1を加えるテスト', function () {
      var plus2 = util.run(util.increment, util.increment);
      assert.equal(plus2(0), 2);
    });
  });

  describe('array', function () {
    it('命令型プログラミングのテスト', function () {
      var array = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => Math.pow(num, 2));
      assert.deepEqual(array, [0, 1, 4, 9, 16, 25, 36, 49, 64, 81]);
    });
  });

  describe('array', function () {
    it('命令型プログラミングのテスト', function () {
      var array = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map(function (num) {
        return Math.pow(num, 2);
      });
      assert.deepEqual(array, [0, 1, 4, 9, 16, 25, 36, 49, 64, 81]);
    });
  });

  describe('array', function () {
    it('命令型プログラミングのテスト', function () {
      var array = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
      for (let i = 0; i < array.length; i++) {
        array[i] = Math.pow(array[i], 2);
      }
      assert.deepEqual(array, [0, 1, 4, 9, 16, 25, 36, 49, 64, 81]);
    });
  });

  describe('nth', function () {
    it('指定する要素を返すテスト', function () {
      var letters = ['a', 'b', 'c'];
      assert.equal(util.nth(letters, 1), 'b');
    });
  });

  describe('nth', function () {
    it('指定する要素を返すテスト', function () {
      assert.equal(util.nth('abc', 0), 'a');
    });
  });

  describe('nth', function () {
    it('指定する要素を返すテスト', function () {
      var letters = ['a', 'b', 'c'];
      assert.equal(util.nth(letters, 4000), false);
    });
  });

  describe('nth', function () {
    it('指定する要素を返すテスト', function () {
      var letters = ['a', 'b', 'c'];
      assert.equal(util.nth(letters, 'aaaa'), false);
    });
  });

  describe('second', function () {
    it('2番目の要素を返すテスト', function () {
      assert.equal(util.second(['a', 'b']), 'b');
    });
  });

  describe('second', function () {
    it('2番目の要素を返すテスト', function () {
      assert.equal(util.second('fogus'), 'o');
    });
  });

  describe('second', function () {
    it('2番目の要素を返すテスト', function () {
      assert.equal(util.second({}), false);
    });
  });

  describe('existy', function () {
    it('存在するかどうかのテスト', function () {
      assert.equal(util.existy(null), false);
    });
  });

  describe('existy', function () {
    it('存在するかどうかのテスト', function () {
      assert.equal(util.existy(undefined), false);
    });
  });

  describe('existy', function () {
    it('存在するかどうかのテスト', function () {
      assert.equal(util.existy({}.notHere), false);
    });
  });

  describe('existy', function () {
    it('存在するかどうかのテスト', function () {
      assert.equal(util.existy((function() {})()), false);
    });
  });

  describe('existy', function () {
    it('存在するかどうかのテスト', function () {
      assert.equal(util.existy(0), true);
    });
  });

  describe('existy', function () {
    it('存在するかどうかのテスト', function () {
      assert.equal(util.existy(0), true);
    });
  });

  describe('truthy', function () {
    it('trueかどうかのテスト', function () {
      assert.equal(util.truthy(false), false);
    });
  });

  describe('truthy', function () {
    it('trueかどうかのテスト', function () {
      assert.equal(util.truthy(undefined), false);
    });
  });

  describe('truthy', function () {
    it('trueかどうかのテスト', function () {
      assert.equal(util.truthy(0), true);
    });
  });

  describe('truthy', function () {
    it('trueかどうかのテスト', function () {
      assert.equal(util.truthy(''), true);
    });
  });

  describe('invoker', function () {
    it('クロージャを返すテスト', function () {
      var rev = util.invoker('reverse', Array.prototype.reverse);
      assert.deepEqual(_.map([[1, 2, 3]], rev), [[3, 2, 1]]);
    });
  });

  describe('cat', function () {
    it('配列を結合するテスト', function () {
      assert.deepEqual(util.cat([1, 2, 3], [4, 5], [6, 7, 8]), [1, 2, 3, 4, 5, 6, 7, 8]);
    });
  });

  describe('construct', function () {
    it('要素と配列を結合するテスト', function () {
      assert.deepEqual(util.construct(42, [1, 2, 3]), [42, 1, 2, 3]);
    });
  });

  describe('partial1', function () {
    it('要素と配列を結合するテスト', function () {
      var over10Part1 = util.partial1(util.div, 10);
      assert.equal(over10Part1(5), 2);
    });
  });

  describe('repeatedly', function () {
    it('計算を繰り返すテスト', function () {
      assert.ok(util.repeatedly(
        3,
        function() {
          return Math.floor((Math.random() * 10) + 1);
        })
      );
    });
  });

  describe('deepClone', function () {
    it('深いコピーのテスト', function () {
      var x = [{a: [1, 2, 3], b: 42}, {c: {d: []}}];
      var y = util.deepClone(x)
      assert.equal(_.isEqual(x, y), true);
    });
  });

  describe('deepClone', function () {
    it('深いコピーのテスト', function () {
      var x = [{a: [1, 2, 3], b: 42}, {c: {d: []}}];
      var y = util.deepClone(x)
      y[1]['c']['d'] = 42;
      assert.equal(_.isEqual(x, y), false);
    });
  });

  describe('curry2', function () {
    it('2段階のカリー化のテスト', function () {
      var div10 = util.curry2(util.div)(10);
      assert.equal(div10(50), 5);
    });
  });

  describe('curry2', function () {
    it('2段階のカリー化のテスト', function () {
      var parseBinaryString = util.curry2(parseInt)(2);
      assert.equal(parseBinaryString('111'), 7);
    });
  });

  describe('curry2', function () {
    it('2段階のカリー化のテスト', function () {
      var parseBinaryString = util.curry2(parseInt)(2);
      assert.equal(parseBinaryString('10'), 2);
    });
  });

  describe('curry2', function () {
    it('2段階のカリー化のテスト', function () {
      var freq = util.curry2(_.countBy)(_.identity);
      var a = util.repeatedly(1000, util.partial1(util.rand, 2));
      var copy = _.clone(a);
    });
  });

  describe('merge', function () {
    it('オブジェクトを結合するテスト', function () {
      var person = {fname: 'Simon'};
      assert.deepEqual(util.merge(person, {lname: 'Petrikov'}, {age: 28}, {age: 108}), {age:108, fname: 'Simon', lname: 'Petrikov'});
    });
  });

  describe('isArray', function () {
    it('配列かどうかのテスト', function () {
      assert.equal(util.existy(false), true);
    });
  });

  describe('isArray', function () {
    it('配列かどうかのテスト', function () {
      assert.equal(util.isArray(0), false);
    });
  });

  describe('isArray', function () {
    it('配列かどうかのテスト', function () {
      assert.equal(util.isArray('abc'), false);
    });
  });

  describe('isArray', function () {
    it('配列かどうかのテスト', function () {
      assert.equal(util.isArray({}), false);
    });
  });

  describe('isNumber', function () {
    it('数値かどうかのテスト', function () {
      assert.equal(util.isNumber(NaN), false);
    });
  });

  describe('isNumber', function () {
    it('数値かどうかのテスト', function () {
      assert.equal(util.isNumber(0), true);
    });
  });

  describe('isNumber', function () {
    it('数値かどうかのテスト', function () {
      assert.equal(util.isNumber('oops'), false);
    });
  });

  describe('isNumber', function () {
    it('数値かどうかのテスト', function () {
      assert.equal(util.isNumber('0'), false);
    });
  });

});

describe.skip('puppet', function() {

  before(async () => {
    browser = await puppet.openBrowser(
      { devTools: true,
        headless: false,
        slowMo: 50,
        defaultViewport : {
          width   : 0,
          height  : 0
        }
      }
    );
  });

  describe('openPage', function() {
    it('ページをオープンする', async () => {
      page = await puppet.openPage(browser);
    });
  });

  describe('closePage', function() {
    it('ページをクローズする', async () => {
      await puppet.closePage(page);
    });
  });

  describe('gotoPage', function() {
    it('ページをオープンしてアマゾンに移動する', async () => {
      page = await puppet.openPage(browser);
      await puppet.gotoPage(page, 'https://amazon.co.jp');
      await puppet.closePage(page);
    });
  });

  describe('gotoPage', function() {
    it('ページをオープンして存在しないURLに移動するときのエラー処理', async () => {
      page = await puppet.openPage(browser);
      await puppet.gotoPage(page, 'https://bad.url');
      await puppet.closePage(page);
    });
  });

  describe('gotoPage', function() {
    it('ページをオープンして存在しないパスに移動するときのエラー処理', async () => {
      page = await puppet.openPage(browser);
      await puppet.gotoPage(page, 'https://amazon.co.jp/bad_path');
      await puppet.closePage(page);
    });
  });

  describe('fetchLinks', function() {
    it('アマゾントップページからリンクを取得する', async () => {
      page = await puppet.openPage(browser);
      page = await puppet.gotoPage(page, 'https://amazon.co.jp');
      let links = await puppet.fetchLinks(page);
      await puppet.closePage(page);
    });
  });

  describe('fetchInternalLinks', function() {
    it('アマゾントップページから内部リンクを取得する', async () => {
      page = await puppet.openPage(browser);
      page = await puppet.gotoPage(page, 'https://amazon.co.jp');
      let links = await puppet.fetchInternalLinks(page);
      await puppet.closePage(page);
    });
  });

  describe('findAll', function() {
    it('アマゾントップページからAnchorタグを取得する', async () => {
      page = await puppet.openPage(browser);
      page = await puppet.gotoPage(page, 'https://amazon.co.jp');
      console.log(await page.title());
      let tags = await puppet.findAll(page, 'a');
      await puppet.closePage(page);
    });
  });

  describe('findAll', function() {
    it('アマゾントップページからカテゴリーを含むAnchorタグを取得する', async () => {
      page = await puppet.openPage(browser);
      page = await puppet.gotoPage(page, 'https://amazon.co.jp');
      console.log(await page.title());
      let tags = await puppet.findAll(page, 'a', 'カテゴリー');
      await puppet.closePage(page);
    });
  });

  describe('clickElement', function() {
    it('アマゾントップページのカテゴリーをクリックする', async () => {
      page = await puppet.openPage(browser);
      page = await puppet.gotoPage(page, 'https://amazon.co.jp');
      let tags = await puppet.findAll(page, 'a', 'カテゴリー');
      await puppet.clickElement(page, '#' + tags[0].id);
      await puppet.closePage(page);
    });
  });

  describe('clickElement', function() {
    it('アマゾントップページのカテゴリーのセレクターが不正', async () => {
      page = await puppet.openPage(browser);
      page = await puppet.gotoPage(page, 'https://amazon.co.jp');
      let tags = await puppet.findAll(page, 'a', 'カテゴリー');
      await puppet.clickElement(page, tags[0].id);
      await puppet.closePage(page);
    });
  });

  describe('findAll', function() {
    it('アマゾントップページからh1,h2,h3,h4タグを取得する', async () => {
      page = await puppet.openPage(browser);
      page = await puppet.gotoPage(page, 'https://amazon.co.jp');
      let tags = await puppet.findAll(page, ['h1', 'h2', 'h3', 'h4', 'a']);
      // console.log(tags);
      await puppet.closePage(page);
    });
  });

  describe('clickElement', function() {
    it('アマゾントップページのカテゴリーをミシシッピデルタ...になるまで順にクリックする', async () => {
      page = await puppet.openPage(browser);
      page = await puppet.gotoPage(page, 'https://amazon.co.jp');
      let tags = await puppet.findAll(page, 'a', 'カテゴリー');

      page = await puppet.gotoPage(page, tags[0].href);

      tags = await puppet.findAll(page, 'a', 'CD・レコード');

      page = await puppet.gotoPage(page, tags[0].href);

      tags = await puppet.findAll(page, 'a', 'ブルース・カントリー');

      page = await puppet.gotoPage(page, tags[0].href);

      // カテゴリ ホワイトブルースを選択する
      // tags = await puppet.findAll(page, 'a', 'ミシシッピデルタ・カントリーブルース');
      // tags = await puppet.findAll(page, 'a', 'メンフィスブルース');
      tags = await puppet.findAll(page, 'a', 'ホワイトブルース');

      page = await puppet.gotoPage(page, tags[0].href);

      // セレクトボックスから発売日を選択する
      let selectBox = await puppet.findAll(page, 'select', '発売日');
      page = await puppet.selectSelector(page, '#' + selectBox[0].id, 'date-desc-rank');

      // ページの下にあるすべて表示するにはこちらをクリックのhref取得する
      tags = await puppet.findAll(page, 'a', 'すべて表示するにはこちらをクリック');
      // 元のページをクローズする
      await puppet.closePage(page);

      // 次のページにhrefがある間ループする
      do {
        // 次のページに遷移する
        page = await puppet.openPage(browser);
        page = await puppet.gotoPage(page, tags[0].href);

        // ページ内の商品リストを取得してそれぞれの商品個別ページを表示する
        links = await puppet.findAll(page, 'ul#s-results-list-atf li > div > div:nth-child(3) > div:nth-child(1) > a');
        for (let link of links) {
          child_page = await puppet.openPage(browser);
          child_page = await puppet.gotoPage(child_page, link.href);
          await puppet.closePage(child_page);
        }

        // 次のページのhrefを取得する
        tags = await puppet.findAll(page, 'a', '次のページ');

        // 元のページをクローズする
        await puppet.closePage(page);

        // 8秒から15秒の間待つ
        let delay_time = util.getRandomInt(8000, 15000);
        await delay(delay_time);
      } while(tags.length !== 0);
    });
  });

  describe('analyzeTag', function() {
    it('アマゾントップページからaタグを取得して分析する', async () => {
      page = await puppet.openPage(browser);
      page = await puppet.gotoPage(page, 'https://amazon.co.jp');
      let tags = await puppet.analyzeTag(page, 'span');
      console.log(tags);
      await puppet.closePage(page);
    });
  });

  describe('fetchImage', function() {
    it('ホワイト・アルバムのサムネイルを取得する', async () => {
      page = await puppet.openPage(browser);
      page = await puppet.gotoPage(page, 'https://www.amazon.co.jp/%E3%82%B6%E3%83%BB%E3%83%93%E3%83%BC%E3%83%88%E3%83%AB%E3%82%BA-%E3%83%9B%E3%83%AF%E3%82%A4%E3%83%88%E3%83%BB%E3%82%A2%E3%83%AB%E3%83%90%E3%83%A0-%E3%82%B9%E3%83%BC%E3%83%91%E3%83%BC%E3%83%BB%E3%83%87%E3%83%A9%E3%83%83%E3%82%AF%E3%82%B9%E3%83%BB%E3%82%A8%E3%83%87%E3%82%A3%E3%82%B7%E3%83%A7%E3%83%B3-%E9%99%90%E5%AE%9A%E7%9B%A4-6SHM-CD%EF%BC%8BBlu-ray%EF%BC%89/dp/B07HKP2W5X/ref=sr_1_1?s=music&ie=UTF8&qid=1550317267&sr=1-1&keywords=beatles');

      result = await puppet.fetchImage(page, '#landingImage', 'ホワイト・アルバム.jpg');

      filesystem.saveFile(result.name, result.buffer);

      await puppet.closePage(page);
    });
  });

  describe('fetchTableData', function() {
    it('アマゾントップの商品ページから商品情報を取得する', async () => {
      page = await puppet.openPage(browser);
      page = await puppet.gotoPage(page, 'https://www.amazon.co.jp/%E3%82%B6%E3%83%BB%E3%83%93%E3%83%BC%E3%83%88%E3%83%AB%E3%82%BA-%E3%83%9B%E3%83%AF%E3%82%A4%E3%83%88%E3%83%BB%E3%82%A2%E3%83%AB%E3%83%90%E3%83%A0-%E3%82%B9%E3%83%BC%E3%83%91%E3%83%BC%E3%83%BB%E3%83%87%E3%83%A9%E3%83%83%E3%82%AF%E3%82%B9%E3%83%BB%E3%82%A8%E3%83%87%E3%82%A3%E3%82%B7%E3%83%A7%E3%83%B3-%E9%99%90%E5%AE%9A%E7%9B%A4-6SHM-CD%EF%BC%8BBlu-ray%EF%BC%89/dp/B07HKP2W5X/ref=sr_1_1?s=music&ie=UTF8&qid=1550317267&sr=1-1&keywords=beatles');

      // 取得する情報
      //  - 商品画像(サムネイル): thumbnail
      //  #landingImage
      //  - 商品名: product_name
      //  #productTitle
      //  - EAN/ASIN: ean_asin
      //  #productDetailsTable > tbody > tr > td > div > ul > li:nth-child(6)
      //  - JAN: jan
      //  #productDetailsTable > tbody > tr > td > div > ul > li:nth-child(6)
      //  - ジャンル(ゲーム、ホビー / おもちゃ、 DVD ・ブルーレイ、 CD( ミュージック ) のどれか): genre
      //  #productDetailsTable > tbody > tr > td > div > ul > li:nth-child(1) > b
      //  #leftNav > ul:nth-child(2) > li:nth-child(1) > span > a > span
      //  - 販売日: release_date
      //  #productDetailsTable > tbody > tr > td > div > ul > li:nth-child(1)
      //  - ランキング
      //  - 定価
      //  - 最安価格
      //  -  FBA 最安価格
      //  - 差額(最安価格 - 定価)
      //  - 新品出品数
      //  - 中古出品数
      //  - アマゾンページへのリンク
      result = await puppet.fetchTableData(page, '#productDetailsTable li');
      // result = await puppet.fetchProductData(page, {
      //   product_name: {
      //     selector: '#productTitle',
      //     type: 'text'
      //   },
      //   ean_asin: {
      //     selector: '#productDetailsTable > tbody > tr > td > div > ul > li:nth-child(6)',
      //     type: 'text'
      //   },
      //   genre: {
      //     selector: '#leftNav > ul:nth-child(2) > li:nth-child(1) > span > a > span',
      //     type: 'text'
      //   },
      //   release_date: {
      //     selector: '#productDetailsTable > tbody > tr > td > div > ul > li:nth-child(1)',
      //     type: 'text'
      //   }
      // });

      console.log(result);
      // await puppet.closePage(page);
    });
  });

  after(async () => {
    await puppet.closeBrowser(browser);
  });

});
