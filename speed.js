(function () {
  const qtyEl = document.getElementById("speedWorkQty");
  const unitEl = document.getElementById("speedUnit");
  const minEl = document.getElementById("speedDurationMin");
  const resultEl = document.getElementById("speedResult");

  function parseInput(str) {
    if (str === undefined || str === null) return NaN;
    const t = String(str).trim().replace(/,/g, "");
    if (t === "") return NaN;
    const n = Number(t);
    return Number.isFinite(n) ? n : NaN;
  }

  function unitSuffix() {
    const u = unitEl && unitEl.value;
    return u ? u : "";
  }

  function formatRate(n) {
    if (Number.isNaN(n) || n < 0) return "—";
    return new Intl.NumberFormat("ko-KR", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 6,
    }).format(n);
  }

  function updateSpeed() {
    if (!resultEl) return;
    const qTrim = String(qtyEl?.value ?? "").trim();
    const mTrim = String(minEl?.value ?? "").trim();
    if (qTrim === "" && mTrim === "") {
      resultEl.textContent =
        "작업량과 소요 시간(분)을 넣으면 여기에 분당·시간당 속도가 표시됩니다.";
      return;
    }

    const qty = parseInput(qtyEl?.value);
    const mins = parseInput(minEl?.value);
    const suf = unitSuffix();

    if (Number.isNaN(qty) || qty < 0) {
      resultEl.textContent = "작업량을 0 이상의 숫자로 입력해 주세요.";
      return;
    }
    if (Number.isNaN(mins) || mins <= 0) {
      resultEl.textContent = "소요 시간(분)을 0보다 큰 숫자로 입력해 주세요.";
      return;
    }

    const perMin = qty / mins;
    const perHour = perMin * 60;

    const uShow = suf ? " " + suf : "";
    resultEl.innerHTML =
      "분당 약 <strong>" +
      formatRate(perMin) +
      uShow +
      "</strong>, 시간당 약 <strong>" +
      formatRate(perHour) +
      uShow +
      "</strong>입니다. " +
      '<span class="reverse-result-sub">(작업량 ' +
      formatRate(qty) +
      (suf ? suf : "") +
      ", 소요 " +
      formatRate(mins) +
      "분)</span>";
  }

  if (qtyEl && minEl) {
    qtyEl.addEventListener("input", updateSpeed);
    minEl.addEventListener("input", updateSpeed);
    if (unitEl) {
      unitEl.addEventListener("change", updateSpeed);
    }
    updateSpeed();
  }
})();
