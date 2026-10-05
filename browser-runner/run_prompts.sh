#!/usr/bin/env bash
# run_prompts.sh — canonical 79-prompt pipeline (2026-10 refresh).
#
# Executes the prompt families with the generic runners and assembles one
# markdown report per prompt, from each prompt's own output template:
#   api_runner.js       -> A01-A20 (reads, role boundaries, IDOR, write contracts)
#   ui_runner.js        -> P01-P47 (Playwright, desktop 1366x768 + mobile 375x812)
#   security_runner.js  -> S01-S12 (defensive, demo-data-only probes)
#   report_generator.js -> $NL_OUT/reports/<ID>.md + INDEX.md
#
# Usage:
#   ./run_prompts.sh                # full 79-prompt run
#   ./run_prompts.sh A01 A02        # selected prompts only
#   NL_MUTATE=1 ./run_prompts.sh    # also allow targeted AUDIT-* write lifecycles
#
# Ordering note: UI walks run first, then API, then security (some API probes
# exercise logout-all; a fresh UI login happens per context so order is safe,
# but UI-first keeps screenshots unaffected by session state changes).
set -u
cd "$(dirname "$0")"
OUT_ROOT="${NL_OUT:-"$(cd "$(dirname "$0")/../../.." && pwd)/nestlancer-test-output"}"
export NL_OUT="$OUT_ROOT"
LOG_DIR="$OUT_ROOT/run-logs"
mkdir -p "$LOG_DIR"
SEL=("$@")

run_step() {
  local name="$1"; shift
  local started; started="$(date -Iseconds)"; local t0; t0=$(date +%s)
  "$@" | tee "$LOG_DIR/${name}.log"
  local code=${PIPESTATUS[0]}
  echo "== ${name}: exit ${code} in $(( $(date +%s) - t0 ))s (started ${started})"
  return "$code"
}

rc=0
run_step ui_runner node ui_runner.js "${SEL[@]:-}" || rc=1
run_step api_runner node api_runner.js "${SEL[@]:-}" || rc=1
run_step security_runner node security_runner.js "${SEL[@]:-}" || rc=1
run_step report_generator node report_generator.js "${SEL[@]:-}" || rc=1

echo "Artifacts: $OUT_ROOT/evidence (json), $OUT_ROOT/screenshots (png), $OUT_ROOT/reports (*.md)"
exit "$rc"
