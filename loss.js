(function () {
  const startTimeEl = document.getElementById("lossStartTime");
  const endTimeEl = document.getElementById("lossEndTime");
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
    const rangeMode = startS !== "" || endS !== "";

    const hTrim = String(hoursEl?.value ?? "").trim();
    const mTrim = String(minutesEl?.value ?? "").trim();
    const directMode = hTrim !== "" || mTrim !== "";

    if (!rangeMode && !directMode) {
      resultEl.textContent =
        "시각 구간을 넣거나, 시간과 분을 넣으면 여기에 총 분이 표시됩니다.";
      return;
    }

    if (rangeMode) {
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

  const els = [startTimeEl, endTimeEl, hoursEl, minutesEl].filter(Boolean);
  els.forEach(function (el) {
    el.addEventListener("input", updateLoss);
  });
  updateLoss();
})();
