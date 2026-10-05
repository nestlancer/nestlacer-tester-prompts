'use strict';
/* Catalog loader: parses the repo's source inventories into machine-readable
 * endpoint/route lists so runners stay in sync with the prompt suite.
 *
 * Sources:
 *   ../../02-source-inventories/openapi-operations-by-tag.md
 *   ../../02-source-inventories/frontend-route-map.md
 */
const fs = require('fs');
const path = require('path');

const INV = path.join(__dirname, '..', '..', '02-source-inventories');

function loadOperations() {
  const file = path.join(INV, 'openapi-operations-by-tag.md');
  const text = fs.readFileSync(file, 'utf8');
  const ops = [];
  let tag = null;
  for (const line of text.split('\n')) {
    const t = line.match(/^##\s+(.+?)\s*\(\d+\)\s*$/);
    if (t) { tag = t[1]; continue; }
    const m = line.match(/^-\s+`([A-Z]+)\s+(\/[^`]*)`(?:\s+—\s+(.*))?$/);
    if (m && tag) {
      ops.push({ tag, method: m[1], path: m[2], summary: (m[3] || '').trim() });
    }
  }
  return ops;
}

function loadRoutes() {
  const file = path.join(INV, 'frontend-route-map.md');
  const text = fs.readFileSync(file, 'utf8');
  const routes = [];
  let app = null;
  for (const line of text.split('\n')) {
    const a = line.match(/^##\s+(landing|web|admin)\s*$/);
    if (a) { app = a[1]; continue; }
    const m = line.match(/^-\s+`([^`]+)`\s+—\s+`([^`]+)`(?:\s+—\s+(.*))?$/);
    if (m && app) {
      routes.push({ app, route: m[1], source: m[2], note: (m[3] || '').trim() });
    }
  }
  return routes;
}

/** Routes with no dynamic [param] segments - directly walkable. */
function staticRoutes(app) {
  return loadRoutes()
    .filter((r) => (!app || r.app === app) && !r.route.includes('['))
    .map((r) => r.route);
}

/** Endpoints whose path has no {param} - callable without fixture IDs. */
function concreteOps(filterFn) {
  return loadOperations().filter((o) => !o.path.includes('{') && (!filterFn || filterFn(o)));
}

function opsByTag(...tags) {
  const want = new Set(tags);
  return loadOperations().filter((o) => want.has(o.tag));
}

function opsMatching(re) {
  return loadOperations().filter((o) => re.test(o.path));
}

const isAdminPath = (p) => /^\/api\/v1\/admin\//.test(p);
const isReadOnly = (m) => m === 'GET' || m === 'HEAD';

module.exports = {
  loadOperations, loadRoutes, staticRoutes, concreteOps,
  opsByTag, opsMatching, isAdminPath, isReadOnly,
};
