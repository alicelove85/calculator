(function () {
  const hoursEl = document.getElementById("lossHours");
  const minutesEl = document.getElementById("lossMinutes");
  const resultEl = document.getElementById("lossResult");

  function parseOptional(str) {
    if (str === undefined || str === null) return NaN;
    const t = String(str).trim().replace(/,/g, "");
    if (t === "") return 0;
    const n = Number(t);
    return Number.isFinite(n) ? n : NaN;
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
    const hTrim = String(hoursEl?.value ?? "").trim();
    const mTrim = String(minutesEl?.value ?? "").trim();
    if (hTrim === "" && mTrim === "") {
      resultEl.textContent =
        "시간과 분을 넣으면 여기에 총 분이 표시됩니다.";
      return;
    }

    const hours = parseOptional(hoursEl?.value);
    const minutes = parseOptional(minutesEl?.value);

    if (Number.isNaN(hours)) {
      resultEl.textContent = "시간(시)을 올바르게 입력해 주세요.";
      return;
    }
    if (Number.isNaN(minutes)) {
      resultEl.textContent = "분을 올바르게 입력해 주세요.";
      return;
    }
    if (hours < 0 || minutes < 0) {
      resultEl.textContent = "시간과 분은 0 이상으로 입력해 주세요.";
      return;
    }

    const totalMin = hours * 60 + minutes;
    resultEl.innerHTML =
      "총 <strong>" +
      formatNum(totalMin) +
      "</strong>분입니다. " +
      '<span class="reverse-result-sub">(' +
      formatHm(totalMin) +
      ")</span>";
  }

  if (hoursEl && minutesEl) {
    hoursEl.addEventListener("input", updateLoss);
    minutesEl.addEventListener("input", updateLoss);
    updateLoss();
  }
})();
