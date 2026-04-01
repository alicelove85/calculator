(function () {
  function parseInput(str) {
    if (str === undefined || str === null) return NaN;
    const t = String(str).trim().replace(/,/g, "");
    if (t === "") return NaN;
    const n = Number(t);
    return Number.isFinite(n) ? n : NaN;
  }

  function parseNonNegativeInt(str) {
    const t = String(str).trim().replace(/[^\d]/g, "");
    if (t === "") return NaN;
    const n = parseInt(t, 10);
    return Number.isFinite(n) && n >= 0 ? n : NaN;
  }

  const fmtInt = function (n) {
    return new Intl.NumberFormat("ko-KR", { maximumFractionDigits: 0 }).format(Math.floor(n));
  };

  const fmtDec = function (n, min, max) {
    return new Intl.NumberFormat("ko-KR", {
      minimumFractionDigits: min,
      maximumFractionDigits: max,
    }).format(n);
  };

  const bulkKgEl = document.getElementById("bulkKg");
  const fillMlEl = document.getElementById("bulkFillMl");
  const sgEl = document.getElementById("bulkSg");
  const assumeYieldEl = document.getElementById("bulkAssumeYield");
  const actualQtyEl = document.getElementById("bulkActualQty");
  const forwardEl = document.getElementById("bulkForwardResult");
  const yieldEl = document.getElementById("bulkYieldResult");

  function computeBase() {
    const bulkKg = parseInput(bulkKgEl?.value);
    const fillMl = parseInput(fillMlEl?.value);
    const sg = parseInput(sgEl?.value);
    if (Number.isNaN(bulkKg) || bulkKg <= 0) {
      return { ok: false, reason: "벌크량(kg)을 0보다 큰 숫자로 입력해 주세요." };
    }
    if (Number.isNaN(fillMl) || fillMl <= 0) {
      return { ok: false, reason: "1개당 충진량(mL)을 0보다 큰 숫자로 입력해 주세요." };
    }
    if (Number.isNaN(sg) || sg <= 0) {
      return { ok: false, reason: "비중을 0보다 큰 숫자로 입력해 주세요." };
    }
    const bulkG = bulkKg * 1000;
    const gPerUnit = fillMl * sg;
    const theoretical = bulkG / gPerUnit;
    const totalMl = bulkG / sg;
    return { ok: true, theoretical, totalMl, gPerUnit };
  }

  function updateForward() {
    if (!forwardEl) return;
    const base = computeBase();
    if (!base.ok) {
      forwardEl.textContent = base.reason;
      return;
    }
    let y = parseInput(assumeYieldEl?.value);
    if (Number.isNaN(y)) y = 100;
    y = Math.min(100, Math.max(0, y));
    const withYield = (base.theoretical * y) / 100;

    forwardEl.innerHTML =
      "<strong>이론 개수 (수율 100%)</strong> " +
      fmtInt(base.theoretical) +
      "개<br>" +
      "<strong>기대 개수 (가정 수율 " +
      fmtDec(y, 0, 2) +
      "%)</strong> " +
      fmtInt(withYield) +
      "개<br>" +
      '<span class="reverse-result-sub">환산 벌크 부피 ' +
      fmtDec(base.totalMl / 1000, 0, 3) +
      " L (" +
      fmtDec(base.totalMl, 0, 1) +
      " ml) · 1개당 질량(참고) " +
      fmtDec(base.gPerUnit, 0, 3) +
      " g</span>";
  }

  function updateYield() {
    if (!yieldEl) return;
    const base = computeBase();
    if (!base.ok) {
      yieldEl.textContent = base.reason;
      return;
    }
    const actual = parseNonNegativeInt(actualQtyEl?.value);
    if (Number.isNaN(actual)) {
      yieldEl.textContent = "실제 양품 개수는 0 이상의 정수로 입력해 주세요.";
      return;
    }
    const th = base.theoretical;
    if (th <= 0) {
      yieldEl.textContent = "이론 개수를 계산할 수 없습니다.";
      return;
    }
    const pct = (actual / th) * 100;
    yieldEl.innerHTML =
      "<strong>이론 개수 (비교)</strong> " +
      fmtInt(th) +
      "개 · <strong>실제 개수</strong> " +
      new Intl.NumberFormat("ko-KR").format(actual) +
      "개<br>" +
      "<strong>수율 (실제 ÷ 이론)</strong> " +
      fmtDec(pct, 1, 2) +
      "%<br>" +
      '<span class="reverse-result-sub">100%를 넘으면 벌크·비중·충진과 집계 기준이 맞는지 확인해 주세요.</span>';
  }

  function updateAll() {
    updateForward();
    updateYield();
  }

  const inputs = [bulkKgEl, fillMlEl, sgEl, assumeYieldEl, actualQtyEl];
  inputs.forEach(function (el) {
    if (el) {
      el.addEventListener("input", updateAll);
    }
  });

  updateAll();
})();
