const { chromium } = require('playwright');
const { ACCOUNTS } = require('./lib/http');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const ctx = await browser.newContext({ viewport: { width: 1366, height: 768 } });
  await ctx.addCookies([
    {
      name: 'nl_cookie_consent',
      value: 'accepted',
      domain: '.nestlancer.com',
      path: '/',
      expires: Math.floor(Date.now() / 1000) + 86400 * 365,
    },
  ]);
  await ctx.addInitScript(() => {
    try {
      localStorage.setItem('nestlancer-cookie-consent', 'accepted');
    } catch (_) {}
  });
  const page = await ctx.newPage();
  await page.goto('https://admin.nestlancer.com/login', { waitUntil: 'domcontentloaded' });
  await page.fill('input[type="email"], input[name="email"]', ACCOUNTS.admin.email);
  await page.fill('input[type="password"]', ACCOUNTS.admin.password);
  await Promise.all([
    page.waitForNavigation({ timeout: 20000 }).catch(() => null),
    page.click('button[type="submit"]'),
  ]);
  await page.waitForTimeout(1500);
  for (const route of [
    '/system/cache',
    '/system/announcements',
    '/system/maintenance',
    '/system/features',
    '/pipeline/projects',
  ]) {
    await page.goto('https://admin.nestlancer.com' + route, { waitUntil: 'domcontentloaded' });
    await page
      .waitForFunction(() => document.querySelectorAll('h1').length > 0, { timeout: 12000 })
      .catch(() => null);
    await page.waitForTimeout(500);
    const items = await page.evaluate(() =>
      [...document.querySelectorAll('input,textarea,select')]
        .filter((el) => {
          const type = (el.getAttribute('type') || '').toLowerCase();
          if (['hidden', 'submit', 'button', 'checkbox'].includes(type)) return false;
          const id = el.id;
          const aria = el.getAttribute('aria-label');
          const labelled = el.getAttribute('aria-labelledby');
          const label = id && document.querySelector(`label[for="${CSS.escape(id)}"]`);
          const wrapLabel = el.closest('label');
          return !(aria || labelled || label || wrapLabel);
        })
        .map((el) => ({
          tag: el.tagName,
          type: el.getAttribute('type'),
          name: el.getAttribute('name'),
          ph: el.getAttribute('placeholder'),
          id: el.id,
          cls: String(el.className || '').slice(0, 50),
        }))
    );
    console.log('\n' + route, JSON.stringify(items, null, 2));
  }
  await browser.close();
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
