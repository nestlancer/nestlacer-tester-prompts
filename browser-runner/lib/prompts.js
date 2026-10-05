'use strict';
/* Central prompt registry: maps every prompt in the suite (P01-P47, A01-A20,
 * S01-S12) to the concrete targets a runner should exercise.
 *
 *  UI prompts  -> { app, routes[] }  routes resolved against the portal origin
 *  API prompts -> { tags[], pathRe } selectors against lib/catalog operations
 *  Sec prompts -> { probes[] } probe-group names implemented in security_runner
 */
const path = require('path');
const fs = require('fs');

const ROOT = path.join(__dirname, '..', '..');

/* ---------------------------------------------------------------- UI (P##) */
const UI = {
  P01: { app: 'landing', title: 'Marketing landing, SEO, redirects and contact intake',
    routes: ['/', '/about', '/services', '/pricing', '/contact', '/blog', '/portfolio', '/terms', '/privacy', '/llms.txt', '/llms-full.txt', '/.well-known/llms.txt', '/robots.txt', '/sitemap.xml', '/nl-unknown-404'], role: 'anon' },
  P02: { app: 'web', title: 'Public app content, share and verify surfaces',
    routes: ['/', '/about', '/work', '/blog', '/blog/bookmarks', '/portfolio', '/contact', '/terms', '/privacy', '/verify', '/verify-document', '/share/nl-invalid-token'], role: 'anon' },
  P03: { app: 'web', title: 'Client auth: signup, password, email, 2FA',
    routes: ['/login', '/register', '/forgot-password', '/reset-password', '/verify-email'], role: 'anon' },
  P04: { app: 'web', title: 'Client shell: global chrome and realtime', routes: ['/dashboard', '/notifications', '/messages'], role: 'clientA' },
  P05: { app: 'web', title: 'Client dashboard and work summary', routes: ['/dashboard'], role: 'clientA' },
  P06: { app: 'web', title: 'Client requests intake and detail', routes: ['/requests', '/requests/new', '/requests/archive'], role: 'clientA' },
  P07: { app: 'web', title: 'Client quotes, acceptance and documents', routes: ['/quotes', '/quotes/drafts', '/quotes/templates', '/quotes/new'], role: 'clientA' },
  P08: { app: 'web', title: 'Client projects list, new and archive', routes: ['/projects', '/projects/new', '/projects/archive', '/projects/completed'], role: 'clientA' },
  P09: { app: 'web', title: 'Client project hub: core, progress, milestones, messages', routes: ['/projects'], role: 'clientA', dynamic: 'project' },
  P10: { app: 'web', title: 'Client project delivery, files and media', routes: ['/settings/files'], role: 'clientA', dynamic: 'project' },
  P11: { app: 'web', title: 'Client invoices, documents and verify', routes: ['/invoices', '/payments/invoices', '/verify-document'], role: 'clientA' },
  P12: { app: 'web', title: 'Client payments, checkout, methods and disputes', routes: ['/payments', '/payments/methods', '/payments/invoices'], role: 'clientA' },
  P13: { app: 'web', title: 'Client messaging and chat dock', routes: ['/messages', '/messages/inbox', '/messages/threads', '/messages/archived', '/messages/new', '/messages/new/direct'], role: 'clientA' },
  P14: { app: 'web', title: 'Client notifications, preferences and push', routes: ['/notifications', '/settings/notifications'], role: 'clientA' },
  P15: { app: 'web', title: 'Client settings: profile, security, account', routes: ['/settings', '/profile', '/profile/edit', '/settings/account', '/settings/security', '/settings/sessions', '/settings/activity', '/settings/billing'], role: 'clientA' },
  P16: { app: 'web', title: 'Client media and files library', routes: ['/settings/files'], role: 'clientA' },
  P17: { app: 'web', title: 'Client responsive, a11y and security sweep', routes: ['/dashboard', '/projects', '/payments', '/settings/security'], role: 'clientA', mobile: true },
  P18: { app: 'admin', title: 'Admin auth and operator gate', routes: ['/login'], role: 'anon' },
  P19: { app: 'admin', title: 'Admin shell and global chrome', routes: ['/dashboard', '/'], role: 'admin' },
  P20: { app: 'admin', title: 'Admin dashboard and analytics', routes: ['/dashboard', '/analytics'], role: 'admin' },
  P21: { app: 'admin', title: 'Admin contact inquiries', routes: ['/contact'], role: 'admin' },
  P22: { app: 'admin', title: 'Admin requests and capacity', routes: ['/requests', '/requests/capacity'], role: 'admin' },
  P23: { app: 'admin', title: 'Admin request-to-quote builder', routes: ['/quotes/new'], role: 'admin', dynamic: 'request' },
  P24: { app: 'admin', title: 'Admin quotes, templates and line items', routes: ['/quotes', '/quotes/drafts', '/quotes/stats', '/quotes/payment-schedules'], role: 'admin' },
  P25: { app: 'admin', title: 'Admin projects overview, team, export, duplicate', routes: ['/projects', '/projects/new', '/projects/archive', '/projects/completed', '/projects/stats'], role: 'admin' },
  P26: { app: 'admin', title: 'Admin project delivery, progress, portfolio, time', routes: ['/projects'], role: 'admin', dynamic: 'project' },
  P27: { app: 'admin', title: 'Admin payments overview, detail, manual reconciliation', routes: ['/payments', '/payments/by-project'], role: 'admin' },
  P28: { app: 'admin', title: 'Admin payment disputes, accounts, company legal', routes: ['/payments/disputes', '/payments/accounts', '/payments/company-legal'], role: 'admin' },
  P29: { app: 'admin', title: 'Admin users directory, search and bulk', routes: ['/users', '/users/search'], role: 'admin' },
  P30: { app: 'admin', title: 'Admin user detail: password, sessions, impersonation', routes: ['/users'], role: 'admin', dynamic: 'user' },
  P31: { app: 'admin', title: 'Admin audit, security, impersonation, sessions', routes: ['/audit'], role: 'admin' },
  P32: { app: 'admin', title: 'Admin media: storage, share, quarantine, analytics', routes: ['/media', '/media/browse', '/media/folders', '/media/storage', '/media/quarantine', '/media/analytics', '/media/settings'], role: 'admin' },
  P33: { app: 'admin', title: 'Admin messages and moderation', routes: ['/messages', '/messages/inbox', '/messages/threads', '/messages/archived', '/messages/new', '/messages/new-direct', '/messages/new-group', '/moderation'], role: 'admin' },
  P34: { app: 'admin', title: 'Admin notifications: broadcast, segment, delivery', routes: ['/notifications'], role: 'admin' },
  P35: { app: 'admin', title: 'Admin system config, features, jobs, templates, ops', routes: ['/system', '/system/features', '/system/jobs', '/system/cache', '/system/health', '/system/announcements', '/system/maintenance', '/system/email-templates', '/system/notification-templates', '/system/staff'], role: 'admin' },
  P36: { app: 'admin', title: 'Admin content and blog CMS', routes: ['/content', '/content/posts/new'], role: 'admin' },
  P37: { app: 'admin', title: 'Admin portfolio CMS', routes: ['/portfolio', '/portfolio/new'], role: 'admin' },
  P38: { app: 'admin', title: 'Admin pipeline, integrations, webhooks, reports', routes: ['/pipeline', '/pipeline/projects', '/pipeline/users', '/integrations', '/api-keys'], role: 'admin' },
  P39: { app: 'cross', title: 'Cross-portal end-to-end workflows', routes: [], role: 'multi' },
  P40: { app: 'cross', title: 'Full regression: responsive, a11y, performance', routes: [], role: 'multi', mobile: true },
  P41: { app: 'admin', title: 'Admin operator profile', routes: ['/profile'], role: 'admin' },
  P42: { app: 'cross', title: 'Source coverage reconciliation', routes: [], role: 'multi' },
  P43: { app: 'cross', title: 'Frontend middleware, BFF proxy, CSP, hard 404s', routes: [], role: 'multi' },
  P44: { app: 'cross', title: 'Debug, observability, diagnostics and secret leakage', routes: [], role: 'multi' },
  P45: { app: 'cross', title: 'Known regression rerun and automated test parity', routes: [], role: 'multi' },
  P46: { app: 'cross', title: 'Demo seed fixtures and destructive flow readiness', routes: [], role: 'multi' },
  P47: { app: 'cross', title: 'Generated documents, emails, exports and download artifacts', routes: [], role: 'multi' },
};

/* --------------------------------------------------------------- API (A##) */
const API = {
  A01: { title: 'Auth, sessions, 2FA, reset tokens and portal role boundaries', tags: ['auth'], pathRe: /^\/api\/v1\/(auth|users\/sessions)/ },
  A02: { title: 'Users self-service profile, preferences, security, export and deletion', tags: ['users', 'Notification Preferences'], pathRe: /^\/api\/v1\/users/ },
  A03: { title: 'Requests, service catalogue and admin request triage APIs', tags: ['requests', 'Public/Services'], pathRe: /^\/api\/v1\/(requests|services|admin\/requests|admin\/service-packages)/ },
  A04: { title: 'Quotes, quote documents, templates, line items and schedules', tags: ['quotes', 'Quote Documents'], pathRe: /^\/api\/v1\/(quotes|admin\/quotes|admin\/quote)/ },
  A05: { title: 'Projects, progress, milestones, deliverables and public project APIs', tags: ['projects', 'progress', 'Public/Projects', 'Deliverable Reviews', 'Milestone Approvals'], pathRe: /^\/api\/v1\/(projects|progress|public\/projects|admin\/projects|admin\/milestones|admin\/deliverables)/ },
  A06: { title: 'Payments, invoices, payment methods, offline transfers, disputes and documents', tags: ['payments', 'Payment Methods', 'Invoices', 'Payment Documents'], pathRe: /^\/api\/v1\/(payments|invoices|payment-methods)/ },
  A07: { title: 'Messaging, chat threads, moderation and websocket events', tags: ['messages', 'Chat threads', 'Conversations', 'Message Threads'], pathRe: /^\/api\/v1\/(messages|conversations|threads|chat)/ },
  A08: { title: 'Notifications, preferences, push subscriptions, templates and delivery', tags: ['notifications', 'Notifications/Root', 'Push Notifications', 'Push Subscriptions', 'Internal Notifications'], pathRe: /^\/api\/v1\/(notifications|push)/ },
  A09: { title: 'Media uploads, chunking, sharing, public share and admin media', tags: ['media', 'Media - Root', 'Media - Sharing', 'Media - Chunked Upload', 'Media - Public Share'], pathRe: /^\/api\/v1\/media/ },
  A10: { title: 'Blog, comments, taxonomy, portfolio, contact and public content APIs', tags: ['blog', 'contact', 'Contact - Public', 'Public/Portfolio', 'Blog - Standalone Comments'], pathRe: /^\/api\/v1\/(blog|posts|portfolio|contact|categories|tags)/ },
  A11: { title: 'Admin dashboard, analytics, audit, reports, health and system operations', tags: ['health', 'Health - Monitoring', 'Health - Admin Debug'], pathRe: /^\/api\/v1\/(health|admin\/(dashboard|analytics|audit|reports|system))/ },
  A12: { title: 'Admin users, roles, sessions, password reset, export, restore and impersonation APIs', tags: [], pathRe: /^\/api\/v1\/admin\/(users|impersonat)/ },
  A13: { title: 'Admin domain operations: requests, quotes, projects, progress, service packages and time entries', tags: [], pathRe: /^\/api\/v1\/admin\/(requests|quotes|projects|progress|service-packages|time-entries|milestones|deliverables)/ },
  A14: { title: 'Admin payments, disputes, accounts, legal profiles, reconciliation and revenue APIs', tags: [], pathRe: /^\/api\/v1\/admin\/(payments|disputes|accounts|company-legal|reconciliation|revenue)/ },
  A15: { title: 'Admin messaging, moderation, notifications, media/content/portfolio and integrations APIs', tags: ['Messaging - Admin', 'Media - Admin', 'media-admin', 'Blog - Admin Posts', 'Blog - Admin Comments', 'Blog - Admin Categories', 'Blog - Admin Tags', 'Blog - Admin Authors', 'Blog - Admin Analytics', 'Contact - Admin'], pathRe: /^\/api\/v1\/admin\/(messages|moderation|notifications|media|posts|comments|portfolio|webhooks|contact|blog)/ },
  A16: { title: 'Health, inbound webhooks, workers, websocket gateway and deployment smoke', tags: ['webhooks', 'Webhooks'], pathRe: /^\/api\/v1\/(health|webhooks)/ },
  A17: { title: 'Frontend BFF, same-origin proxy, auth cookies and CSP contracts', tags: [], pathRe: null, special: 'bff' },
  A18: { title: 'Backend cross-cutting platform contracts: security, cache, idempotency, validation and errors', tags: [], pathRe: null, special: 'crosscutting' },
  A19: { title: 'Workers, outbox, documents, email, notification, media, export and webhook side effects', tags: [], pathRe: null, special: 'workers' },
  A20: { title: 'Demo seed data, scripts and fixture readiness', tags: [], pathRe: null, special: 'seed' },
};

/* ---------------------------------------------------------- SECURITY (S##) */
const SEC = {
  S01: { title: 'Threat model and attack surface', probes: ['surface', 'headers', 'tls'] },
  S02: { title: 'Auth, session, access control and IDOR', probes: ['authz', 'idor', 'session', 'jwt'] },
  S03: { title: 'Input validation, injection, XSS, CSRF and open redirect', probes: ['injection', 'xss', 'redirect', 'csrf'] },
  S04: { title: 'API abuse, rate limit, replay and business logic', probes: ['ratelimit', 'replay', 'masspriv'] },
  S05: { title: 'File upload, media, document and export security', probes: ['upload', 'share', 'traversal'] },
  S06: { title: 'Payments, webhooks and financial fraud security', probes: ['payments', 'webhooksig'] },
  S07: { title: 'Data privacy, PII, secrets, logging and debug leakage', probes: ['leakage', 'debug', 'pii'] },
  S08: { title: 'Browser platform security: headers, CSP, CORS, cache', probes: ['headers', 'cors', 'cache', 'cookies'] },
  S09: { title: 'Realtime messaging, notification and content abuse security', probes: ['realtime', 'contentabuse'] },
  S10: { title: 'Integrations, webhook SSRF and outbound security', probes: ['ssrf', 'outbound'] },
  S11: { title: 'Admin system operations, supply chain and config security', probes: ['adminops', 'supplychain'] },
  S12: { title: 'AI-era prompt injection and untrusted content resilience', probes: ['promptinjection', 'untrusted'] },
};

/** Locate the markdown prompt file for a prompt id. */
function promptFile(id) {
  const dirs = {
    P: ['03-ui-prompts'], A: ['04-api-prompts'], S: ['06-security-prompts'],
  }[id[0]];
  const found = [];
  const walk = (d) => {
    for (const e of fs.readdirSync(d, { withFileTypes: true })) {
      const p = path.join(d, e.name);
      if (e.isDirectory()) walk(p);
      else if (e.name.startsWith(id + '-') || e.name.startsWith(id + '.')) found.push(p);
    }
  };
  for (const d of dirs) walk(path.join(ROOT, d));
  return found[0] || null;
}

/** Extract the ```markdown output template from a prompt file. */
function outputTemplate(id) {
  const f = promptFile(id);
  if (!f) return null;
  const text = fs.readFileSync(f, 'utf8');
  const m = text.match(/```markdown\n([\s\S]*?)```/);
  return m ? m[1] : null;
}

const allIds = () => [...Object.keys(UI), ...Object.keys(API), ...Object.keys(SEC)];

module.exports = { UI, API, SEC, promptFile, outputTemplate, allIds, ROOT };
