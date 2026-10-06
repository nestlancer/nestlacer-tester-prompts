#!/usr/bin/env bash
set -u
cd "$(dirname "$0")"
# Output root: $NL_OUT if set, else repo-relative (matches lib/http.js default).
OUT_ROOT="${NL_OUT:-"$(cd "$(dirname "$0")/.." && pwd)/nestlancer-test-output"}"
export NL_OUT="$OUT_ROOT"
LOG_DIR="$OUT_ROOT/run-logs"
mkdir -p "$LOG_DIR"
SUMMARY="$LOG_DIR/rerun_failed_summary.tsv"
echo -e "script\texit\tseconds\tstarted" > "$SUMMARY"

# Dependency-aware order: primaries first, then supplements that need their JSON.
SCRIPTS=(
  run_p12.js
  run_p25.js
  p11_download_test.js
  p23_builder_supplement.js
  p23_add_remove_line_supplement.js
  p23_back_after_save_supplement.js
  p24_library_audit_block.js
  p24_restore_library_verify.js
  p25_controls_supplement.js
  p25_status_supplement.js
)

for script in "${SCRIPTS[@]}"; do
  started="$(date -Iseconds)"
  start_ts=$(date +%s)
  echo "===== RERUN START $script @ $started =====" | tee "$LOG_DIR/rerun_${script}.log"
  node "$script" >>"$LOG_DIR/rerun_${script}.log" 2>&1
  code=$?
  end_ts=$(date +%s)
  secs=$((end_ts - start_ts))
  echo "===== RERUN END $script exit=$code secs=$secs =====" | tee -a "$LOG_DIR/rerun_${script}.log"
  echo -e "${script}\t${code}\t${secs}\t${started}" | tee -a "$SUMMARY"
done

echo "Rerun finished. Summary: $SUMMARY"
cat "$SUMMARY"
