'use strict';
/* Shared HTTP/session helpers for Nestlancer prompt runners.
 * Public-domain mode only. No localhost / docker hosts.
 */
const fs = require('fs');
const path = require('path');

const HOSTS = {
  api: 'https://api.nestlancer.com',
  apiBase: 'https://api.nestlancer.com/api/v1',
  landing: 'https://nestlancer.com',
  web: 'https://app.nestlancer.com',
  admin: 'https://admin.nestlancer.com',
};

const ACCOUNTS = {
  admin: { email: 'admin@nestlancer.com', password: 'Brick2@Build', portal: 'admin', origin: HOSTS.admin },
  clientA: { email: 'arjun.mehta@nestlancer.com', password: 'Brick2@Build', portal: 'client', origin: HOSTS.web },
  clientB: { email: 'rahul.desai@nestlancer.com', password: 'Brick2@Build', portal: 'client', origin: HOSTS.web },
};

const REDACT_KEYS = /^(accesstoken|refreshtoken|token|password|secret|otp|code|cookie|authorization|resetlink|resettoken)$/i;

function redact(value, depth = 0) {
  if (value === null || typeof value !== 'object' || depth > 4) return value;
  if (Array.isArray(value)) return value.slice(0, 3).map((v) => redact(v, depth + 1));
  const out = {};
  for (const [k, v] of Object.entries(value)) {
    if (REDACT_KEYS.test(k)) out[k] = '[REDACTED]';
    else out[k] = redact(v, depth + 1);
  }
  return out;
}

async function rawRequest(url, opts = {}) {
  const started = Date.now();
  const ctl = new AbortController();
  const timer = setTimeout(() => ctl.abort(), opts.timeout || 30000);
  try {
    const res = await fetch(url, { ...opts, signal: ctl.signal, redirect: opts.redirect || 'manual' });
    const text = await res.text();
    let json = null;
    try { json = JSON.parse(text); } catch (_) { /* non-json */ }
    return {
      ok: true,
      status: res.status,
      ms: Date.now() - started,
      headers: Object.fromEntries(res.headers.entries()),
      requestId: res.headers.get('x-request-id') || null,
      correlationId: res.headers.get('x-correlation-id') || null,
      json,
      text: json ? null : text.slice(0, 500),
      bytes: text.length,
    };
  } catch (err) {
    return { ok: false, status: 0, ms: Date.now() - started, error: String(err.message || err), headers: {} };
  } finally {
    clearTimeout(timer);
  }
}

class Session {
  constructor(name, account) {
    this.name = name;
    this.account = account;
    this.accessToken = null;
    this.refreshToken = null;
    this.userId = null;
    this.loginStatus = null;
    this.expiresAt = 0;
  }

  async login() {
    const res = await rawRequest(`${HOSTS.apiBase}/auth/login`, {
      method: 'POST',
      headers: { 'content-type': 'application/json', origin: this.account.origin },
      body: JSON.stringify({ email: this.account.email, password: this.account.password }),
    });
    this.loginStatus = res.status;
    const d = res.json && res.json.data ? res.json.data : null;
    if (d && d.accessToken) {
      this.accessToken = d.accessToken;
      this.refreshToken = d.refreshToken || null;
      this.userId = (d.user && (d.user.id || d.user.userId)) || this.decodeSub();
      this.expiresAt = Date.now() + 12 * 60 * 1000;
    }
    return res;
  }

  decodeSub() {
    try {
      const p = JSON.parse(Buffer.from(this.accessToken.split('.')[1], 'base64').toString());
      return p.sub;
    } catch (_) { return null; }
  }

  async ensure() {
    if (!this.accessToken || Date.now() > this.expiresAt) await this.login();
    return !!this.accessToken;
  }

  async call(method, pathname, { body, headers = {}, timeout } = {}) {
    await this.ensure();
    const url = pathname.startsWith('http') ? pathname : `${HOSTS.apiBase}${pathname}`;
    const h = { origin: this.account.origin, accept: 'application/json', ...headers };
    if (this.accessToken) h.authorization = `Bearer ${this.accessToken}`;
    if (body !== undefined) h['content-type'] = 'application/json';
    let res = await rawRequest(url, { method, headers: h, body: body === undefined ? undefined : JSON.stringify(body), timeout });
    if (res.status === 401 && this.accessToken) {
      await this.login();
      if (this.accessToken) {
        h.authorization = `Bearer ${this.accessToken}`;
        res = await rawRequest(url, { method, headers: h, body: body === undefined ? undefined : JSON.stringify(body), timeout });
      }
    }
    return res;
  }
}

const anon = {
  name: 'anon',
  async call(method, pathname, { body, headers = {}, origin = HOSTS.web, timeout } = {}) {
    const url = pathname.startsWith('http') ? pathname : `${HOSTS.apiBase}${pathname}`;
    const h = { origin, accept: 'application/json', ...headers };
    if (body !== undefined) h['content-type'] = 'application/json';
    return rawRequest(url, { method, headers: h, body: body === undefined ? undefined : JSON.stringify(body), timeout });
  },
};

function outDir(sub) {
  const base = process.env.NL_OUT || path.join(__dirname, '..', '..', '..', 'nestlancer-test-output');
  const dir = sub ? path.join(base, sub) : base;
  fs.mkdirSync(dir, { recursive: true });
  return dir;
}

function writeJson(file, data) {
  fs.writeFileSync(file, JSON.stringify(data, null, 2));
  return file;
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

module.exports = { HOSTS, ACCOUNTS, Session, anon, rawRequest, redact, outDir, writeJson, sleep };
