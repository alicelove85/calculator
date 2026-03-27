(function () {
  const totalEl = document.getElementById("lossTotalMin");
  const modeEl = document.getElementById("lossMode");
  const valueEl = document.getElementById("lossValue");
  const labelEl = document.getElementById("lossValueLabel");
  const resultEl = document.getElementById("lossResult");

  function parseInput(str) {
    if (str === undefined || str === null) return NaN;
    const t = String(str).trim().replace(/,/g, "");
    if (t === "") return NaN;
    const n = Number(t);
    return Number.isFinite(n) ? n : NaN;
  }

  function lossPercentFromMode(mode, value) {
    if (Number.isNaN(value)) return NaN;
    if (mode === "yield") {
      if (value < 0 || value > 100) return NaN;
      return 100 - value;
    }
    if (value < 0 || value > 100) return NaN;
    return value;
  }

  function formatMin(n) {
    if (Number.isNaN(n) || n < 0) return "—";
    return new Intl.NumberFormat("ko-KR", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(n);
  }

  function formatHm(totalMinutes) {
    if (Number.isNaN(totalMinutes) || totalMinutes < 0) return "—";
    const m = Math.floor(totalMinutes + 1e-9);
    const h = Math.floor(m / 60);
    const rem = m % 60;
    if (h <= 0) return rem + "분";
    return h + "시간 " + rem + "분";
  }

  function syncLabel() {
    if (!labelEl || !modeEl) return;
    labelEl.textContent = modeEl.value === "yield" ? "수율" : "손실률";
    if (valueEl) {
      valueEl.setAttribute(
        "aria-label",
        modeEl.value === "yield" ? "수율 퍼센트" : "손실률 퍼센트"
      );
    }
  }

  function updateLoss() {
    if (!resultEl) return;
    syncLabel();
    const totalTrim = String(totalEl?.value ?? "").trim();
    const valTrim = String(valueEl?.value ?? "").trim();
    if (totalTrim === "" && valTrim === "") {
      resultEl.textContent =
        "총 가동 시간(분)과 수율 또는 손실률을 넣으면 여기에 손실 시간이 표시됩니다.";
      return;
    }
    const totalMin = parseInput(totalEl?.value);
    const raw = parseInput(valueEl?.value);
    const mode = modeEl && modeEl.value === "loss" ? "loss" : "yield";
    const lossPct = lossPercentFromMode(mode, raw);

    if (Number.isNaN(totalMin) || totalMin < 0) {
      resultEl.textContent = "총 가동·계획 시간(분)을 올바르게 입력해 주세요.";
      return;
    }
    if (Number.isNaN(raw)) {
      resultEl.textContent =
        (mode === "yield" ? "수율" : "손실률") + "(%)를 올바르게 입력해 주세요.";
      return;
    }
    if (Number.isNaN(lossPct)) {
      if (mode === "yield") {
        resultEl.textContent = "수율은 0~100% 사이로 입력해 주세요.";
      } else {
        resultEl.textContent = "손실률은 0~100% 사이로 입력해 주세요.";
      }
      return;
    }

    const lossMin = (totalMin * lossPct) / 100;
    const effectiveMin = totalMin - lossMin;

    resultEl.innerHTML =
      "손실로 환산된 시간은 약 <strong>" +
      formatMin(lossMin) +
      "</strong>분 (" +
      formatHm(lossMin) +
      ")입니다. " +
      "유효 가동 시간(참고)은 약 <strong>" +
      formatMin(effectiveMin) +
      "</strong>분 (" +
      formatHm(effectiveMin) +
      ")입니다. " +
      '<span class="reverse-result-sub">(손실률 ' +
      formatMin(lossPct) +
      "%)</span>";
  }

  if (totalEl && valueEl) {
    totalEl.addEventListener("input", updateLoss);
    valueEl.addEventListener("input", updateLoss);
    if (modeEl) {
      modeEl.addEventListener("change", updateLoss);
    }
    syncLabel();
    updateLoss();
  }
})();
