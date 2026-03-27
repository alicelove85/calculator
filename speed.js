(function () {
  const qtyEl = document.getElementById("speedWorkQty");
  const minEl = document.getElementById("speedDurationMin");
  const resultEl = document.getElementById("speedResult");

  function parseInput(str) {
    if (str === undefined || str === null) return NaN;
    const t = String(str).trim().replace(/,/g, "");
    if (t === "") return NaN;
    const n = Number(t);
    return Number.isFinite(n) ? n : NaN;
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
        "작업량과 소요 시간(분)을 넣으면 여기에 분당속도 (EA)가 표시됩니다.";
      return;
    }

    const qty = parseInput(qtyEl?.value);
    const mins = parseInput(minEl?.value);

    if (Number.isNaN(qty) || qty < 0) {
      resultEl.textContent = "작업량(EA)을 0 이상의 숫자로 입력해 주세요.";
      return;
    }
    if (Number.isNaN(mins) || mins <= 0) {
      resultEl.textContent = "소요 시간(분)을 0보다 큰 숫자로 입력해 주세요.";
      return;
    }

    const perMin = qty / mins;
    resultEl.innerHTML =
      '<strong class="speed-ea-label">분당속도 (EA)</strong> ' +
      '<strong class="speed-ea-value">' +
      formatRate(perMin) +
      "</strong>";
  }

  if (qtyEl && minEl) {
    qtyEl.addEventListener("input", updateSpeed);
    minEl.addEventListener("input", updateSpeed);
    updateSpeed();
  }
})();
