#!/usr/bin/env bash
set -u
cd "$(dirname "$0")"
LOG_DIR="/home/bhumukul-raj/Music/nestlacer-test-output/run-logs"
mkdir -p "$LOG_DIR"
SUMMARY="$LOG_DIR/summary.tsv"
echo -e "script\texit\tseconds\tstarted" > "$SUMMARY"

# Primary prompt runners (P0/P46 first), then supplements.
SCRIPTS=(
  run_p46_initial.js
  run_p03.js
  run_p03_2fa_full.js
  run_p07.js
  run_p09.js
  run_p10.js
  run_p11.js
  run_p12.js
  run_p15_complete.js
  run_p18.js
  run_p23.js
  run_p24.js
  run_p25.js
  # supplements / helpers
  login_probe.js
  p03_form_inventory.js
  run_p03_2fa_attempt.js
  p07_quote_finder.js
  p10_finder.js
  p11_download_test.js
  p12_payment_finder.js
  p15_2fa_supplement.js
  p15_delete_supplement.js
  p18_logout_supplement.js
  p23_builder_supplement.js
  p23_add_remove_line_supplement.js
  p23_back_after_save_supplement.js
  p24_library_audit_block.js
  p24_restore_library.js
  p24_restore_library_verify.js
  p25_controls_supplement.js
  p25_status_supplement.js
)

# Skip older/duplicate P15 variants if complete already ran
# (run_p15.js / run_p15_final.js omitted to avoid thrashing same flows)

for script in "${SCRIPTS[@]}"; do
  if [[ ! -f "$script" ]]; then
    echo -e "${script}\tMISSING\t0\t$(date -Iseconds)" | tee -a "$SUMMARY"
    continue
  fi
  started="$(date -Iseconds)"
  start_ts=$(date +%s)
  echo "===== START $script @ $started =====" | tee "$LOG_DIR/${script}.log"
  node "$script" >>"$LOG_DIR/${script}.log" 2>&1
  code=$?
  end_ts=$(date +%s)
  secs=$((end_ts - start_ts))
  echo "===== END $script exit=$code secs=$secs =====" | tee -a "$LOG_DIR/${script}.log"
  echo -e "${script}\t${code}\t${secs}\t${started}" | tee -a "$SUMMARY"
done

echo "All runners finished. Summary: $SUMMARY"
cat "$SUMMARY"
