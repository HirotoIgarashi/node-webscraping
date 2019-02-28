const puppeteer = require('puppeteer');

puppeteer.launch({ headless: false }).then(async browser => {
  const page = await browser.newPage();
  await page.goto('https://www.google.com');

  console.log(await page.title());

  const href_list = await page.$$eval('a', a_tag_list => {
    return a_tag_list.map(anchor => anchor.href);
  });

  console.log(href_list.length);

  const newArray = href_list.filter(item => item.startsWith('http') === true);

  console.log(newArray.length);
  console.log(newArray);

  // other actions...
  await browser.close();
});
