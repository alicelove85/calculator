(function () {
  const qtyEl = document.getElementById("speedWorkQty");
  const unitEl = document.getElementById("speedUnit");
  const minEl = document.getElementById("speedDurationMin");
  const workersEl = document.getElementById("speedWorkers");
  const resultEl = document.getElementById("speedResult");

  function parseInput(str) {
    if (str === undefined || str === null) return NaN;
    const t = String(str).trim().replace(/,/g, "");
    if (t === "") return NaN;
    const n = Number(t);
    return Number.isFinite(n) ? n : NaN;
  }

  /** 비우면 1, 아니면 1 이상 정수 */
  function parseWorkers(str) {
    const t = String(str ?? "").trim().replace(/,/g, "");
    if (t === "") return 1;
    const n = Number(t);
    if (!Number.isFinite(n) || n < 1) return NaN;
    if (Math.floor(n) !== n) return NaN;
    return n;
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
        "작업량·소요 시간(분)·작업자 수를 넣으면 여기에 분당·시간당 속도가 표시됩니다.";
      return;
    }

    const qty = parseInput(qtyEl?.value);
    const mins = parseInput(minEl?.value);
    const workers = parseWorkers(workersEl?.value);
    const suf = unitSuffix();
    const uShow = suf ? " " + suf : "";

    if (Number.isNaN(qty) || qty < 0) {
      resultEl.textContent = "작업량을 0 이상의 숫자로 입력해 주세요.";
      return;
    }
    if (Number.isNaN(mins) || mins <= 0) {
      resultEl.textContent = "소요 시간(분)을 0보다 큰 숫자로 입력해 주세요.";
      return;
    }
    if (Number.isNaN(workers)) {
      resultEl.textContent =
        "작업자 수는 1 이상의 정수(명)로 입력하거나 비워 주세요.";
      return;
    }

    const linePerMin = qty / mins;
    const linePerHour = linePerMin * 60;
    const perPerMin = linePerMin / workers;
    const perPerHour = perPerMin * 60;

    const sub =
      '<span class="reverse-result-sub">(작업량 ' +
      formatRate(qty) +
      (suf ? suf : "") +
      ", 소요 " +
      formatRate(mins) +
      "분, 작업자 " +
      formatRate(workers) +
      "명)</span>";

    if (workers === 1) {
      resultEl.innerHTML =
        '<span class="speed-result-line">분당 약 <strong>' +
        formatRate(linePerMin) +
        uShow +
        "</strong>, 시간당 약 <strong>" +
        formatRate(linePerHour) +
        uShow +
        "</strong>입니다. " +
        "(전체와 1명당 동일) " +
        sub;
      return;
    }

    resultEl.innerHTML =
      '<span class="speed-result-line"><strong>전체(라인)</strong> 분당 약 <strong>' +
      formatRate(linePerMin) +
      uShow +
      "</strong>, 시간당 약 <strong>" +
      formatRate(linePerHour) +
      uShow +
      "</strong></span>" +
      '<span class="speed-result-line"><strong>작업자 1명당</strong> 분당 약 <strong>' +
      formatRate(perPerMin) +
      uShow +
      "</strong>, 시간당 약 <strong>" +
      formatRate(perPerHour) +
      uShow +
      "</strong></span>" +
      sub;
  }

  if (qtyEl && minEl) {
    qtyEl.addEventListener("input", updateSpeed);
    minEl.addEventListener("input", updateSpeed);
    if (workersEl) {
      workersEl.addEventListener("input", updateSpeed);
    }
    if (unitEl) {
      unitEl.addEventListener("change", updateSpeed);
    }
    updateSpeed();
  }
})();
