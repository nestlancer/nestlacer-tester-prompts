const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
  await page.goto('data:text/html,<title>browser-ok</title><h1>Playwright Chromium ready</h1>');
  console.log(await page.title());
  await browser.close();
})();
