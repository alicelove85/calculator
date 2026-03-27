(function () {
  const startTimeEl = document.getElementById("lossStartTime");
  const endTimeEl = document.getElementById("lossEndTime");
  const resultEl = document.getElementById("lossResult");

  /** "12:00", "9:5" → 그날 0시부터의 분. 실패 시 NaN */
  function parseClock(str) {
    const t = String(str).trim();
    if (t === "") return NaN;
    const m = t.match(/^(\d{1,2})\s*:\s*(\d{1,2})$/);
    if (!m) return NaN;
    const h = Number(m[1]);
    const mi = Number(m[2]);
    if (!Number.isFinite(h) || !Number.isFinite(mi)) return NaN;
    if (h < 0 || h > 23 || mi < 0 || mi > 59) return NaN;
    return h * 60 + mi;
  }

  function formatNum(n) {
    if (Number.isNaN(n)) return "—";
    const rounded = Math.round(n * 1e6) / 1e6;
    return new Intl.NumberFormat("ko-KR", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 6,
    }).format(rounded);
  }

  /** 총 분 → "N시간 M분" (M은 소수 가능) */
  function formatHm(totalMin) {
    if (Number.isNaN(totalMin) || totalMin < 0) return "—";
    const h = Math.floor(totalMin / 60);
    const m = totalMin - h * 60;
    const mStr =
      Math.abs(m - Math.round(m)) < 1e-9
        ? String(Math.round(m))
        : formatNum(m);
    if (h <= 0) return mStr + "분";
    return h + "시간 " + mStr + "분";
  }

  function updateLoss() {
    if (!resultEl) return;

    const startS = String(startTimeEl?.value ?? "").trim();
    const endS = String(endTimeEl?.value ?? "").trim();

    if (startS === "" && endS === "") {
      resultEl.textContent =
        "시작과 종료 시각을 넣으면 여기에 경과 분이 표시됩니다.";
      return;
    }

    if (startS === "" || endS === "") {
      resultEl.textContent =
        "시간 구간을 쓰려면 시작 시각과 종료 시각을 모두 입력해 주세요.";
      return;
    }

    const startM = parseClock(startS);
    const endM = parseClock(endS);
    if (Number.isNaN(startM)) {
      resultEl.textContent =
        "시작 시각은 시:분 형식(예: 12:00)으로 입력해 주세요.";
      return;
    }
    if (Number.isNaN(endM)) {
      resultEl.textContent =
        "종료 시각은 시:분 형식(예: 14:50)으로 입력해 주세요.";
      return;
    }

    let diff = endM - startM;
    if (diff < 0) diff += 24 * 60;

    resultEl.innerHTML =
      "<strong>" +
      startS +
      "</strong> ~ <strong>" +
      endS +
      "</strong> 구간은 <strong>" +
      formatNum(diff) +
      "</strong>분입니다. " +
      '<span class="reverse-result-sub">(' +
      formatHm(diff) +
      ")</span>";
  }

  if (startTimeEl && endTimeEl) {
    startTimeEl.addEventListener("input", updateLoss);
    endTimeEl.addEventListener("input", updateLoss);
    updateLoss();
  }
})();
