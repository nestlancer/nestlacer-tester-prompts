#!/usr/bin/env bash
# frontend-loop.sh — UI-only prompt loops against portal hosts (not api.*).
# Usage: ./frontend-loop.sh [start] [end]
#   NL_OUT_BASE defaults to /root/workspace/external-mpc-cheak-report
set -u
cd "$(dirname "$0")"
BASE="${NL_OUT_BASE:-/root/workspace/external-mpc-cheak-report}"
START="${1:-1}"
END="${2:-10}"

analyze() {
  local out="$1" loop="$2"
  python3 - "$out" "$loop" <<'PY'
import json, sys
from pathlib import Path
from collections import Counter
out = Path(sys.argv[1]); loop = sys.argv[2]
uw = out / "evidence" / "ui-walk.json"
summary = {"loop": loop, "hardFails": [], "consoleTop": [], "netFailTop": [], "login": {}, "visitCount": 0}
if not uw.exists():
    summary["error"] = "missing ui-walk.json"
    print(json.dumps(summary, indent=2))
    raise SystemExit(2)
d = json.loads(uw.read_text())
summary["login"] = d.get("logins") or {}
rows = d.get("rows") or d.get("visits") or []
summary["visitCount"] = len(rows)
cons = Counter(); net = Counter()
for r in rows:
    app = r.get("app"); route = r.get("route") or r.get("path")
    for vp in ("desktop", "mobile", "d", "m"):
        cell = r.get(vp)
        verdict = None
        if isinstance(cell, str):
            verdict = cell
        elif isinstance(cell, dict):
            verdict = cell.get("verdict") or cell.get("statusLabel")
            for e in cell.get("consoleErrors") or cell.get("console") or []:
                msg = e if isinstance(e, str) else (e.get("text") or e.get("message") or str(e))
                if msg: cons[msg[:140]] += 1
            for n in cell.get("failedRequests") or cell.get("networkErrors") or []:
                u = n if isinstance(n, str) else (n.get("url") or n.get("p") or str(n))
                s = "" if isinstance(n, str) else str(n.get("s") or n.get("status") or "")
                if u: net[f"{s} {u}"[:160]] += 1
            # same-origin API failures observed during walk
            for a in cell.get("apiCalls") or []:
                st = a.get("s") or a.get("status")
                if st and int(st) >= 500:
                    net[f"API {st} {a.get('m')} {a.get('p')}"] += 1
                if st and int(st) in (401, 403) and (r.get("role") not in (None, "anon")):
                    # authenticated page seeing auth failure
                    if "/login" not in str(route):
                        net[f"AUTH {st} {a.get('m')} {a.get('p')}"] += 1
        if (verdict and "FAIL" in str(verdict) and "EXPECTED" not in str(verdict)):
            summary["hardFails"].append({"app": app, "route": route, "viewport": vp, "verdict": verdict, "role": r.get("role")})
        # Soft → hard: authenticated walk that still scored PASS but landed on /login
        if isinstance(cell, dict) and r.get("role") not in (None, "anon"):
            fu = cell.get("finalUrl") or ""
            if "/login" in fu or "/register" in fu:
                summary["hardFails"].append({"app": app, "route": route, "viewport": vp, "verdict": "FAIL-AUTH-REDIRECT(detected)", "role": r.get("role"), "finalUrl": fu[:120]})
        if isinstance(cell, dict) and cell.get("verdict") == "CONSOLE-ERRORS":
            route_s = str(route or "")
            if "nl-unknown-404" not in route_s and "nl-invalid" not in route_s:
                summary["hardFails"].append({"app": app, "route": route, "viewport": vp, "verdict": "CONSOLE-ERRORS", "role": r.get("role")})
summary["consoleTop"] = cons.most_common(15)
summary["netFailTop"] = net.most_common(20)
summary["hardFailCount"] = len(summary["hardFails"])
logins = summary["login"] if isinstance(summary["login"], dict) else {}
bad_login = []
for k, v in logins.items():
    if isinstance(v, dict):
        if v.get("status") == "FAIL" or v.get("result") == "FAIL":
            bad_login.append(k)
    elif v == "FAIL":
        bad_login.append(k)
summary["badLogins"] = bad_login
# Soft signals: many 5xx API calls during authenticated walks
api5xx = sum(1 for k, _ in summary["netFailTop"] if k.startswith("API 5"))
summary["api5xxSignals"] = api5xx
summary["ok"] = summary["hardFailCount"] == 0 and not bad_login
(out / "LOOP-ANALYSIS.json").write_text(json.dumps(summary, indent=2))
print(json.dumps({
    "loop": loop,
    "ok": summary["ok"],
    "hardFailCount": summary["hardFailCount"],
    "visitCount": summary["visitCount"],
    "badLogins": summary.get("badLogins", []),
    "api5xxSignals": api5xx,
    "consoleTop": summary["consoleTop"][:5],
    "netFailTop": summary["netFailTop"][:8],
    "hardFails": summary["hardFails"][:10],
}, indent=2))
raise SystemExit(0 if summary["ok"] else 1)
PY
}

rc_all=0
for i in $(seq "$START" "$END"); do
  OUT="$BASE/frontend-loop-$(printf '%02d' "$i")"
  export NL_OUT="$OUT"
  mkdir -p "$OUT/evidence" "$OUT/screenshots" "$OUT/reports" "$OUT/run-logs"
  echo "===== FRONTEND LOOP $i/$END  NL_OUT=$OUT  $(date -Iseconds) ====="
  started=$(date +%s)
  # UI only — portal hosts via Playwright (landing/web/admin). No api_runner.
  node ui_runner.js >"$OUT/run-logs/ui_runner.log" 2>&1
  ui_rc=$?
  node report_generator.js >"$OUT/run-logs/report_generator.log" 2>&1 || true
  secs=$(( $(date +%s) - started ))
  echo "ui_runner exit=$ui_rc secs=$secs"
  if analyze "$OUT" "$i"; then
    echo "LOOP $i: PASS"
    echo "PASS $i ${secs}s" >>"$BASE/frontend-loop-master.tsv"
  else
    echo "LOOP $i: ISSUES — see $OUT/LOOP-ANALYSIS.json"
    echo "ISSUES $i ${secs}s" >>"$BASE/frontend-loop-master.tsv"
    rc_all=1
    # Stop so the agent can diagnose (portal BFF first, api only if needed) and fix.
    echo "STOP_ON_ISSUE loop=$i"
    exit 1
  fi
done
echo "All loops $START..$END completed without hard UI fails."
exit "$rc_all"
