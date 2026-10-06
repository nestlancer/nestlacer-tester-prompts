const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { execFileSync } = require('child_process');

const OUT = path.join(__dirname, '..', 'nestlancer-test-output', 'reports', 'P03', '2fa_full');
const EVID = path.join(OUT, 'evidence');
fs.mkdirSync(EVID, { recursive: true });

const APP = 'https://app.nestlancer.com';
const auditPassword = 'AuditP03TwoFA!' + crypto.randomBytes(4).toString('hex') + 'aA1';
const runId = Date.now().toString(36);

function redact(s) {
  return String(s || '')
    .replaceAll(auditPassword, '<redacted-audit-password>')
    .replace(/audit-p03-2fa-[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+/gi, '<audit-2fa-mail>@<mail-domain>')
    .replace(/token=[^\s&"'<>]+/gi, 'token=<redacted>')
    .replace(/\b[A-Z2-7]{16,}\b/g, '<redacted-base32-secret>')
    .replace(/\b\d{6}\b/g, '<redacted-6digit-code>');
}
function sanitizeUrl(u) {
  try {
    const url = new URL(u);
    for (const k of [...url.searchParams.keys()]) {
      if (/token|secret|code|password|credential|signature|x-amz/i.test(k)) url.searchParams.set(k, '<redacted>');
    }
    return url.toString();
  } catch { return String(u || ''); }
}
async function snap(page, name, extra = {}) {
  await page.waitForTimeout(700);
  await page.screenshot({ path: path.join(EVID, name + '.png'), fullPage: true }).catch(() => {});
  const title = await page.title().catch(() => '');
  const text = redact(await page.locator('body').innerText().catch(() => ''));
  const inputs = await page.evaluate(() => [...document.querySelectorAll('input')].map(i => ({
    type: i.getAttribute('type'),
    name: i.getAttribute('name'),
    id: i.id,
    placeholder: i.getAttribute('placeholder'),
    autocomplete: i.getAttribute('autocomplete'),
    inputMode: i.getAttribute('inputmode'),
    aria: i.getAttribute('aria-label'),
    visible: !!(i.offsetWidth || i.offsetHeight || i.getClientRects().length),
  }))).catch(() => []);
  fs.writeFileSync(path.join(EVID, name + '.txt'), `URL ${sanitizeUrl(page.url())}\nTITLE ${title}\nINPUTS ${JSON.stringify(inputs)}\n\n${text}`);
  return { name, url: sanitizeUrl(page.url()), title, text, inputs, ...extra };
}
async function dismiss(page) {
  for (const t of ['Accept', 'Dismiss']) {
    try {
      const b = page.getByRole('button', { name: t }).first();
      if (await b.isVisible({ timeout: 600 })) await b.click();
    } catch {}
  }
}
async function submit(page) {
  try { await page.locator('button[type=submit]').first().click({ timeout: 2500 }); }
  catch { await page.keyboard.press('Enter'); }
}
async function clickButton(page, re) {
  try { await page.getByRole('button', { name: re }).first().click({ timeout: 2500 }); return true; } catch {}
  try { await page.locator('button').filter({ hasText: re }).first().click({ timeout: 2500 }); return true; } catch {}
  return false;
}
async function makeMailbox() {
  const d = await (await fetch('https://api.mail.tm/domains')).json();
  const domain = d['hydra:member'][0].domain;
  const address = `audit-p03-2fa-${runId}@${domain}`.toLowerCase();
  let r = await fetch('https://api.mail.tm/accounts', {
    method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ address, password: auditPassword }),
  });
  if (!r.ok && r.status !== 422) throw Error('mail account create failed ' + r.status + ' ' + await r.text());
  r = await fetch('https://api.mail.tm/token', {
    method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ address, password: auditPassword }),
  });
  if (!r.ok) throw Error('mail token failed ' + r.status + ' ' + await r.text());
  const tok = await r.json();
  return { address, token: tok.token, domain };
}
async function pollMail(mbox, ms = 30000) {
  const end = Date.now() + ms;
  while (Date.now() < end) {
    const r = await fetch('https://api.mail.tm/messages', { headers: { authorization: `Bearer ${mbox.token}` } });
    const j = await r.json();
    const msgs = j['hydra:member'] || [];
    if (msgs[0]) {
      return await (await fetch('https://api.mail.tm/messages/' + msgs[0].id, { headers: { authorization: `Bearer ${mbox.token}` } })).json();
    }
    await new Promise(resolve => setTimeout(resolve, 2500));
  }
  return null;
}
function extractVerifyLinks(msg) {
  const src = [msg?.text, msg?.html, msg?.intro].flat().filter(Boolean).join('\n');
  const links = [];
  for (const match of src.matchAll(/https?:\/\/[^\s"'<>]+/g)) {
    const url = match[0].replace(/&amp;/g, '&').replace(/[\])}.,;]+$/, '');
    if (/verify-email\?token=/.test(url)) links.push(url);
  }
  return [...new Set(links)].sort((a, b) => b.length - a.length);
}
function totp(secret) {
  try {
    return execFileSync('python3', ['-c', `import pyotp; print(pyotp.TOTP(${JSON.stringify(secret)}).now())`], { encoding: 'utf8' }).trim();
  } catch { return null; }
}
async function fillOtp(page, code) {
  const sels = [
    'input[autocomplete="one-time-code"]',
    'input[inputmode="numeric"]',
    'input[name*="code" i]',
    'input[id*="code" i]',
    'input[placeholder*="code" i]',
    'input[aria-label*="code" i]',
    'input[type="text"]',
    'input:not([type="password"]):not([type="email"]):not([type="checkbox"]):not([type="hidden"])',
  ];
  for (const sel of sels) {
    const loc = page.locator(sel).first();
    if (await loc.count().catch(() => 0)) {
      try { await loc.fill(code, { timeout: 1500 }); return sel; } catch {}
    }
  }
  return null;
}

(async () => {
  const result = {
    steps: [], notes: [], blockers: [], address: null, verifyLinks: [],
    secretFound: false, codeInputSelector: null, loginChallenge: false, success: false,
  };

  const mailbox = await makeMailbox();
  result.address = mailbox.address.replace(/^(.{14}).*@/, '$1…@');

  const browser = await chromium.launch({ headless: true });
  const ctx = await browser.newContext({ viewport: { width: 1365, height: 900 }, ignoreHTTPSErrors: true });
  const page = await ctx.newPage();

  await page.goto(APP + '/register', { waitUntil: 'networkidle' });
  await dismiss(page);
  await page.locator('input[name=firstName]').fill('Audit');
  await page.locator('input[name=lastName]').fill('TwoFA');
  await page.locator('input[name=email]').fill(mailbox.address);
  await page.locator('input[name=password]').fill(auditPassword);
  await page.locator('input[name=confirmPassword]').fill(auditPassword);
  await page.locator('input[name=acceptTerms]').check();
  await submit(page);
  await page.waitForTimeout(3000);
  result.steps.push(await snap(page, 'register_2fa_user'));

  const msg = await pollMail(mailbox);
  if (!msg) {
    result.blockers.push('No verification email delivered');
  } else {
    const links = extractVerifyLinks(msg);
    result.verifyLinks = links.map(sanitizeUrl);
    fs.writeFileSync(path.join(EVID, 'mail_message_redacted.txt'), redact(`SUBJECT ${msg.subject}\n${links.map(sanitizeUrl).join('\n')}`));
    if (links[0]) {
      await page.goto(links[0], { waitUntil: 'networkidle', timeout: 60000 }).catch(e => result.blockers.push('verify link goto ' + e.message));
      result.steps.push(await snap(page, 'verify_link'));
    }
  }

  await page.goto(APP + '/login', { waitUntil: 'networkidle' });
  await dismiss(page);
  await page.locator('input[name=email],input[type=email]').first().fill(mailbox.address);
  await page.locator('input[name=password],input[type=password]').first().fill(auditPassword);
  await Promise.allSettled([page.waitForURL(u => !u.pathname.includes('/login'), { timeout: 22000 }), submit(page)]);
  await page.waitForLoadState('networkidle', { timeout: 10000 }).catch(() => {});
  await page.waitForTimeout(2000);
  const login = await snap(page, 'audit_login_after_verify');
  result.steps.push(login);
  if (new URL(login.url).pathname.includes('/login')) {
    result.blockers.push('Audit account could not login after verify.');
    await browser.close();
    fs.writeFileSync(path.join(OUT, 'result.json'), JSON.stringify(result, null, 2));
    console.log(JSON.stringify(result, null, 2));
    return;
  }

  await page.goto(APP + '/settings/security', { waitUntil: 'networkidle', timeout: 60000 });
  result.steps.push(await snap(page, 'settings_security_before_2fa'));
  const pwd = page.locator('input[name=twoFactorPassword],#security-2fa-password').first();
  if (!(await pwd.count())) {
    result.blockers.push('2FA password input not found');
  } else {
    await pwd.fill(auditPassword);
    await clickButton(page, /Start 2FA setup/i);
    await page.waitForTimeout(4000);
    result.steps.push(await snap(page, 'twofa_setup_started'));

    const raw = await page.evaluate(() => document.body.innerText + '\n' + [...document.querySelectorAll('img,a,svg,canvas')].map(e => [
      e.getAttribute('src'), e.getAttribute('href'), e.getAttribute('alt'), e.getAttribute('data-uri'), e.getAttribute('data-secret'),
    ].filter(Boolean).join(' ')).join('\n')).catch(() => '');
    let secret = null;
    const uri = raw.match(/otpauth:\/\/totp\/[^\s"'<>]+/i);
    if (uri) {
      try { secret = new URL(uri[0]).searchParams.get('secret'); } catch {}
    }
    if (!secret) {
      const ms = raw.match(/\b[A-Z2-7]{16,}\b/g) || [];
      secret = ms[0];
    }

    if (!secret) {
      result.blockers.push('2FA secret not readable from DOM/text');
    } else {
      result.secretFound = true;
      const wrongSel = await fillOtp(page, '000000');
      result.codeInputSelector = wrongSel;
      if (!wrongSel) {
        result.blockers.push('2FA code input not found');
      } else {
        // The UI keeps the password field visible in the 2FA confirm step; refill it before verify attempts.
        await page.locator('input[name=twoFactorPassword],#security-2fa-password').first().fill(auditPassword).catch(() => {});
        const wrongClicked = await clickButton(page, /Verify and enable|Verify|Enable|Confirm|Continue/i);
        result.notes.push('2FA wrong-code verify click=' + wrongClicked);
        await page.waitForTimeout(2500);
        result.steps.push(await snap(page, 'twofa_wrong_code'));

        const code = totp(secret);
        await page.locator('input[name=twoFactorPassword],#security-2fa-password').first().fill(auditPassword).catch(() => {});
        await fillOtp(page, code);
        const correctClicked = await clickButton(page, /Verify and enable|Verify|Enable|Confirm|Continue/i);
        result.notes.push('2FA correct-code verify click=' + correctClicked);
        await page.waitForTimeout(3500);
        result.steps.push(await snap(page, 'twofa_correct_code_enabled'));

        const ctx2 = await browser.newContext({ viewport: { width: 1365, height: 900 }, ignoreHTTPSErrors: true });
        const q = await ctx2.newPage();
        await q.goto(APP + '/login', { waitUntil: 'networkidle' });
        await dismiss(q);
        await q.locator('input[name=email],input[type=email]').first().fill(mailbox.address);
        await q.locator('input[name=password],input[type=password]').first().fill(auditPassword);
        await Promise.allSettled([q.waitForURL(u => !u.pathname.includes('/login'), { timeout: 12000 }), submit(q)]);
        await q.waitForLoadState('networkidle', { timeout: 8000 }).catch(() => {});
        await q.waitForTimeout(2000);
        const chal = await snap(q, 'twofa_login_challenge');
        result.steps.push(chal);
        result.loginChallenge = /two-factor|2fa|6-digit|backup|authenticator|verification code/i.test(chal.text);

        await fillOtp(q, '000000');
        await clickButton(q, /Verify|Continue|Sign in|Submit/i);
        await q.waitForTimeout(1800);
        result.steps.push(await snap(q, 'twofa_login_wrong_code'));

        await clickButton(q, /backup/i);
        await q.waitForTimeout(1000);
        result.steps.push(await snap(q, 'twofa_backup_toggle'));

        await clickButton(q, /authenticator|code/i);
        await q.waitForTimeout(500);
        const loginCode = totp(secret);
        await fillOtp(q, loginCode);
        await clickButton(q, /Verify|Continue|Sign in|Submit/i);
        await q.waitForLoadState('networkidle', { timeout: 10000 }).catch(() => {});
        await q.waitForTimeout(2500);
        const fin = await snap(q, 'twofa_login_correct_code_success');
        result.steps.push(fin);
        result.success = !new URL(fin.url).pathname.includes('/login') && /dashboard|welcome|client portal/i.test(fin.text);
        await ctx2.close();
      }
    }
  }

  await browser.close();
  fs.writeFileSync(path.join(OUT, 'result.json'), JSON.stringify(result, null, 2));
  console.log(JSON.stringify({
    address: result.address,
    blockers: result.blockers,
    notes: result.notes,
    secretFound: result.secretFound,
    codeInputSelector: result.codeInputSelector,
    loginChallenge: result.loginChallenge,
    success: result.success,
    steps: result.steps.map(s => ({ name: s.name, url: s.url, title: s.title, text: s.text.slice(0, 100) })),
  }, null, 2));
})();
