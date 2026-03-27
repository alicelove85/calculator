(function () {
  const reversePiecesEl = document.getElementById("reversePieces");
  const reversePerEl = document.getElementById("reversePer");
  const reverseUnitEl = document.getElementById("reverseUnit");
  const reverseResultEl = document.getElementById("reverseResult");

  function parseInput(str) {
    if (str === undefined || str === null) return NaN;
    const t = String(str).trim().replace(/,/g, "");
    if (t === "") return NaN;
    const n = Number(t);
    return Number.isFinite(n) ? n : NaN;
  }

  function unitLabel() {
    return reverseUnitEl && reverseUnitEl.value === "g" ? "g" : "mL";
  }

  function bulkKgFromPieceCount(pieces, perUnit) {
    if (Number.isNaN(pieces) || Number.isNaN(perUnit) || pieces < 0 || perUnit <= 0) {
      return NaN;
    }
    return (pieces * perUnit) / 1000;
  }

  function formatKg(n) {
    if (n === null || Number.isNaN(n)) return "—";
    return new Intl.NumberFormat("ko-KR", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 4,
    }).format(n);
  }

  function updateReverseBulk() {
    if (!reverseResultEl) return;
    const piecesTrim = String(reversePiecesEl?.value ?? "").trim();
    const perTrim = String(reversePerEl?.value ?? "").trim();
    if (piecesTrim === "" && perTrim === "") {
      reverseResultEl.textContent =
        "개수와 1개당 내용량을 넣으면 여기에 벌크(kg)가 표시됩니다.";
      return;
    }
    const pieces = parseInput(reversePiecesEl?.value);
    const per = parseInput(reversePerEl?.value);
    const kg = bulkKgFromPieceCount(pieces, per);
    const u = unitLabel();
    if (Number.isNaN(pieces) || pieces < 0) {
      reverseResultEl.textContent = "개수(개)를 올바르게 입력해 주세요.";
      return;
    }
    if (Number.isNaN(per) || per <= 0) {
      reverseResultEl.textContent =
        "제품 1개당 내용량(" + u + ")을 올바르게 입력해 주세요.";
      return;
    }
    reverseResultEl.innerHTML =
      "이 개수·내용량이면 대략 <strong>" +
      formatKg(kg) +
      "</strong> kg 벌크에 해당합니다. " +
      '<span class="reverse-result-sub">(개 × ' +
      u +
      " ÷ 1000 = kg)</span>";
  }

  if (reversePiecesEl && reversePerEl) {
    reversePiecesEl.addEventListener("input", updateReverseBulk);
    reversePerEl.addEventListener("input", updateReverseBulk);
    if (reverseUnitEl) {
      reverseUnitEl.addEventListener("change", updateReverseBulk);
    }
    updateReverseBulk();
  }
})();
