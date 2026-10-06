const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const OUT = path.join(__dirname, '..', 'nestlancer-test-output', 'reports', 'P11', 'download_test');
fs.mkdirSync(OUT, { recursive: true });
const APP = 'https://app.nestlancer.com';
const PASS = process.env.NESTLANCER_DEMO_PASSWORD || 'Brick2@Build';
const PAYMENT = '01a10733-de39-7618-978a-0febfac65964';

(async () => {
  const browser = await chromium.launch({ headless: true });
  const ctx = await browser.newContext({
    viewport: { width: 1365, height: 900 },
    ignoreHTTPSErrors: true,
    acceptDownloads: true,
  });
  const page = await ctx.newPage();
  const net = [];
  page.on('response', (r) => {
    if (/invoice|receipt|document|payment|s3|billing/i.test(r.url())) {
      net.push({
        method: r.request().method(),
        status: r.status(),
        url: r.url()
          .replace(/X-Amz-Signature=[^&]+/g, 'X-Amz-Signature=<redacted>')
          .replace(/X-Amz-Credential=[^&]+/g, 'X-Amz-Credential=<redacted>'),
        ct: r.headers()['content-type'] || '',
        cd: r.headers()['content-disposition'] || '',
      });
    }
  });

  async function dismiss() {
    for (const t of ['Accept', 'Dismiss']) {
      try {
        const x = page.getByRole('button', { name: t }).first();
        if (await x.isVisible({ timeout: 500 })) await x.click({ timeout: 1000 });
      } catch {}
    }
  }

  async function tryDownload(label, locator) {
    const rec = { name: label, verdict: 'NOT_CLICKED' };
    try {
      if (!(await locator.count()) || !(await locator.first().isVisible({ timeout: 3000 }).catch(() => false))) {
        rec.verdict = 'MISSING';
        return rec;
      }
      const dlPromise = page.waitForEvent('download', { timeout: 15000 }).catch((e) => ({ error: e.message }));
      await locator.first().click({ timeout: 8000 });
      const dl = await dlPromise;
      if (dl && !dl.error) {
        const filename = dl.suggestedFilename();
        const save = path.join(OUT, filename.replace(/[^\w.-]+/g, '_'));
        await dl.saveAs(save);
        rec.verdict = 'DOWNLOADED';
        rec.filename = filename;
        rec.path = save;
        rec.size = fs.statSync(save).size;
      } else {
        rec.verdict = 'NO_DOWNLOAD_EVENT';
        rec.error = dl?.error || '';
      }
    } catch (e) {
      rec.verdict = 'ERROR';
      rec.error = e.message;
    }
    return rec;
  }

  await page.goto(`${APP}/login`, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await dismiss();
  await page.locator('#email, input[type=email]').first().fill('arjun.mehta@nestlancer.com');
  await page.locator('#password, input[type=password]').first().fill(PASS);
  await Promise.allSettled([
    page.waitForURL((u) => !u.pathname.includes('/login'), { timeout: 25000 }),
    page.getByRole('button', { name: /^Sign in$/i }).click({ timeout: 6000 }),
  ]);
  await page.waitForLoadState('networkidle', { timeout: 12000 }).catch(() => {});

  const out = [];

  // Payment detail: legacy labels + any PDF/download-ish controls.
  await page.goto(`${APP}/payments/${PAYMENT}`, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForLoadState('networkidle', { timeout: 12000 }).catch(() => {});
  await dismiss();
  for (const name of ['Download invoice', 'Download receipt', 'Download PDF', 'PDF', 'Invoice', 'Receipt']) {
    out.push(await tryDownload(`payment_detail:${name}`, page.getByRole('button', { name: new RegExp(`^${name}$`, 'i') })));
    await page.waitForTimeout(400);
  }

  // Invoices list uses compact "PDF" action buttons.
  await page.goto(`${APP}/invoices`, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForLoadState('networkidle', { timeout: 12000 }).catch(() => {});
  await dismiss();
  out.push(await tryDownload('invoices_list:PDF', page.getByRole('button', { name: /^PDF$/i })));

  fs.writeFileSync(path.join(OUT, 'net.json'), JSON.stringify(net, null, 2));
  fs.writeFileSync(path.join(OUT, 'result.json'), JSON.stringify({ generatedAt: new Date().toISOString(), out, netTail: net.slice(-20) }, null, 2));
  console.log(JSON.stringify({ out, netTail: net.slice(-10) }, null, 2));

  const ok = out.some((r) => r.verdict === 'DOWNLOADED');
  await browser.close();
  process.exit(ok ? 0 : 1);
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
