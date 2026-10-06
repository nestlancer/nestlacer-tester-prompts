'use strict';
/* Fixture discovery: resolves real demo IDs from list endpoints so {param}
 * operations can be probed with concrete values instead of being skipped.
 */
const { Session, ACCOUNTS } = require('./http');

function pickId(obj) {
  if (!obj || typeof obj !== 'object') return null;
  return obj.id || obj._id || obj.uuid || obj.slug || null;
}

function listOf(res) {
  const d = res && res.json ? res.json.data : null;
  if (!d) return [];
  if (Array.isArray(d)) return d;
  for (const k of ['items', 'data', 'results', 'records', 'rows', 'list']) {
    if (Array.isArray(d[k])) return d[k];
  }
  // {data:{projects:[...]}} style
  for (const v of Object.values(d)) if (Array.isArray(v) && v.length && typeof v[0] === 'object') return v;
  return [];
}

const SOURCES = [
  // [key, role, path]
  ['projectId', 'clientA', '/projects?limit=5'],
  ['projectIdB', 'clientB', '/projects?limit=5'],
  ['quoteId', 'clientA', '/quotes?limit=5'],
  ['quoteIdB', 'clientB', '/quotes?limit=5'],
  ['requestId', 'clientA', '/requests?limit=5'],
  ['requestIdB', 'clientB', '/requests?limit=5'],
  ['paymentId', 'clientA', '/payments?limit=5'],
  ['paymentIdB', 'clientB', '/payments?limit=5'],
  ['invoiceId', 'clientA', '/invoices?limit=5'],
  ['mediaId', 'clientA', '/media?limit=5'],
  ['notificationId', 'clientA', '/notifications?limit=5'],
  // Prefer chat-thread list (stable `id`) over conversations envelope (`threadId`).
  ['conversationId', 'clientA', '/messages/threads?limit=5'],
  ['paymentMethodId', 'clientA', '/payments/methods'],
  ['adminUserId', 'admin', '/admin/users?limit=5'],
  ['adminProjectId', 'admin', '/admin/projects?limit=5'],
  ['adminQuoteId', 'admin', '/admin/quotes?limit=5'],
  ['adminRequestId', 'admin', '/admin/requests?limit=5'],
  ['adminPaymentId', 'admin', '/admin/payments?limit=5'],
  ['adminMediaId', 'admin', '/admin/media?limit=5'],
  ['postId', 'admin', '/admin/posts?limit=5'],
  ['commentId', 'admin', '/admin/comments?limit=5'],
  ['portfolioId', 'anon', '/portfolio?limit=5'],
  ['postSlug', 'anon', '/blog/posts?limit=5'],
  ['serviceId', 'anon', '/services'],
];

async function discover(sessions, log = () => {}) {
  const fx = { _raw: {} };
  for (const [key, role, p] of SOURCES) {
    try {
      const s = sessions[role];
      const res = role === 'anon' ? await s.call('GET', p) : await s.call('GET', p);
      const items = listOf(res);
      fx._raw[key] = { path: p, role, status: res.status, count: items.length };
      if (items.length) {
        // Conversations/threads envelopes often use threadId instead of id.
        fx[key] = pickId(items[0]) || items[0].threadId || items[0].conversationId || null;
        fx[key + 's'] = items.map((it) => pickId(it) || it.threadId || it.conversationId).filter(Boolean);
        if (key === 'postSlug') fx.postSlug = items[0].slug || fx.postSlug;
      }
      log(`  fixture ${key.padEnd(18)} ${String(res.status).padEnd(4)} n=${items.length} -> ${fx[key] || '-'}`);
    } catch (e) {
      fx._raw[key] = { path: p, role, error: String(e.message || e) };
    }
  }
  return fx;
}

/** Substitute {param} placeholders in an OpenAPI path using discovered fixtures. */
function fillPath(p, fx, ctx = {}) {
  const map = {
    id: ctx.id || fx.projectId, userId: fx.adminUserId, projectId: fx.projectId,
    quoteId: fx.quoteId, requestId: fx.requestId, paymentId: fx.paymentId,
    mediaId: fx.mediaId, invoiceId: fx.invoiceId, postId: fx.postId,
    commentId: fx.commentId, conversationId: fx.conversationId,
    threadId: fx.conversationId, slug: fx.postSlug, token: 'nl-invalid-token',
    notificationId: fx.notificationId, methodId: fx.paymentMethodId,
    milestoneId: null, deliverableId: null, revisionId: null, versionId: null,
    entryId: null, memberId: fx.adminUserId, templateId: null, categoryId: null,
    tagId: null, sessionId: null, disputeId: null, accountId: null,
    webhookId: null, jobId: null, key: 'nl-probe-key', provider: 'razorpay',
    type: 'general', resourceId: fx.projectId, name: 'nl-probe',
  };
  let out = p;
  let unresolved = false;
  out = out.replace(/\{(\w+)\}/g, (_, k) => {
    const v = map[k] !== undefined && map[k] !== null ? map[k] : null;
    if (!v) { unresolved = true; return `{${k}}`; }
    return v;
  });
  return { path: out, unresolved };
}

module.exports = { discover, fillPath, listOf, pickId };
