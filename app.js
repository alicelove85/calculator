(function () {
  const tbody = document.getElementById("rows");

  const TARGET_MIN = 97;
  const TARGET_MAX = 100;

  const calcAllBtn = document.getElementById("calcAll");
  const addRowBtn = document.getElementById("addRow");
  const clearAllBtn = document.getElementById("clearAll");

  function recalculateAll() {
    tbody.querySelectorAll("tr.data-row").forEach(function (tr) {
      updateRow(tr);
    });
  }

  function formatPcsValue(n) {
    if (n === null || Number.isNaN(n)) return "";
    return new Intl.NumberFormat("ko-KR", {
      maximumFractionDigits: 2,
    }).format(n);
  }

  function formatYieldPct(n) {
    if (n === null || Number.isNaN(n)) return "—";
    return new Intl.NumberFormat("ko-KR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 4,
    }).format(n);
  }

  /**
   * 이론 N개 기준, 완전 박스 k박스일 때 수율 (k×입수÷N×100)이 97~100%인 k만 나열
   */
  function completeBoxCountsYield97100(theoryPcs, perBox) {
    const maxBoxes = Math.floor(theoryPcs / perBox + 1e-9);
    const out = [];
    for (let k = 0; k <= maxBoxes; k++) {
      const y = theoryPcs > 0 ? (k * perBox / theoryPcs) * 100 : 0;
      if (y >= TARGET_MIN - 1e-9 && y <= TARGET_MAX + 1e-9) {
        out.push(k);
      }
    }
    return out;
  }

  function parseInput(str) {
    if (str === undefined || str === null) return NaN;
    const t = String(str).trim().replace(/,/g, "");
    if (t === "") return NaN;
    const n = Number(t);
    return Number.isFinite(n) ? n : NaN;
  }

  function perUnitIsG(tr) {
    const sel = tr.querySelector('[data-field="perUnitUnit"]');
    return sel && sel.value === "g";
  }

  function perUnitLabel(tr) {
    return perUnitIsG(tr) ? "g" : "mL";
  }

  /** 사용한 벌크 kg, 1개당 mL 또는 g → 최대 개수(이론) (수치는 g와 동일 스케일로 사용) */
  function maxProductionCount(inputKg, perUnit) {
    if (Number.isNaN(inputKg) || Number.isNaN(perUnit) || inputKg <= 0 || perUnit <= 0) {
      return NaN;
    }
    return (inputKg * 1000) / perUnit;
  }

  function updateYieldBandTable(trMain) {
    const trDe = trMain._decileRow;
    if (!trDe) return;
    const wrap = trDe.querySelector(".decile-wrap");
    if (!wrap) return;

    const inEl = trMain.querySelector('[data-field="input"]');
    const perEl = trMain.querySelector('[data-field="perUnit"]');
    const boxEl = trMain.querySelector('[data-field="unitsPerBox"]');
    const inputKg = parseInput(inEl.value);
    const perUnit = parseInput(perEl.value);
    const perBox = parseInput(boxEl.value);
    const u = perUnitLabel(trMain);

    const maxPcs = maxProductionCount(inputKg, perUnit);
    if (Number.isNaN(maxPcs) || maxPcs <= 0) {
      wrap.innerHTML = '<p class="decile-empty">이론 개수가 나오면 표시됩니다.</p>';
      return;
    }

    const N = maxPcs;
    const showBox = !Number.isNaN(perBox) && perBox > 0;

    if (!showBox) {
      wrap.innerHTML =
        '<p class="decile-empty">박스당 입수를 넣으면 <strong>완전 박스</strong> 기준으로 연속 박스 개수·수율·개수가 표시됩니다.</p>';
      return;
    }

    const boxKs = completeBoxCountsYield97100(N, perBox);
    const kLo = boxKs.length ? boxKs[0] : 0;
    const kHi = boxKs.length ? boxKs[boxKs.length - 1] : 0;

    if (boxKs.length === 0) {
      wrap.innerHTML =
        '<p class="decile-empty">이론·박스당 입수 조합에서 <strong>수율 97~100%</strong>에 해당하는 완전 박스 수가 없습니다.</p>';
      return;
    }

    let html =
      '<p class="decile-title">이론 <strong>' +
      formatPcsValue(N) +
      "</strong>개 · 박스당 <strong>" +
      formatPcsValue(perBox) +
      "</strong>개 · 수율 <strong>" +
      TARGET_MIN +
      "~" +
      TARGET_MAX +
      "%</strong>에 해당하는 완전 박스 <strong>" +
      kLo +
      (boxKs.length > 1 ? "~" + kHi : "") +
      "</strong> · 1개당 <strong>" +
      u +
      "</strong></p>";
    html += '<div class="decile-scroll"><table class="decile-table"><thead><tr>';
    html +=
      '<th scope="col">수율(%)<br /><span class="decile-th-sub">(박스×입수)÷이론×100</span></th><th scope="col">완전 박스</th><th scope="col">화장품 개수(개)<br /><span class="decile-th-sub">완전 박스×입수</span></th>';
    html += "</tr></thead><tbody>";

    for (let j = 0; j < boxKs.length; j++) {
      const k = boxKs[j];
      const pieces = k * perBox;
      const yieldPct = N > 0 ? (pieces / N) * 100 : 0;
      html += "<tr>";
      html += "<td>" + formatYieldPct(yieldPct) + "</td>";
      html += "<td><strong>" + formatPcsValue(k) + "</strong></td>";
      html += "<td>" + formatPcsValue(pieces) + "</td>";
      html += "</tr>";
    }

    html += "</tbody></table></div>";
    html +=
      '<p class="decile-footnote">표시 행은 수율 <strong>' +
      TARGET_MIN +
      "~" +
      TARGET_MAX +
      "%</strong>인 경우만입니다. 각 행은 잔여 없이 완전 박스만 채운 경우입니다.</p>";
    wrap.innerHTML = html;
  }

  function updatePcsCell(tr) {
    const inEl = tr.querySelector('[data-field="input"]');
    const perEl = tr.querySelector('[data-field="perUnit"]');
    const pcsCell = tr.querySelector(".pcs-cell");

    const inputKg = parseInput(inEl.value);
    const perUnitVal = parseInput(perEl.value);
    const u = perUnitLabel(tr);

    if (!pcsCell) return;

    if (Number.isNaN(perUnitVal) || perUnitVal <= 0) {
      pcsCell.innerHTML =
        '<span class="pcs-empty">1개당 내용량(mL 또는 g) 입력</span>';
      pcsCell.className = "pcs-cell empty";
      return;
    }

    const lines = [];
    const maxPcs = maxProductionCount(inputKg, perUnitVal);
    if (!Number.isNaN(maxPcs)) {
      lines.push(
        '<span class="pcs-line pcs-main"><strong>최대 생산수(이론) ' +
          formatPcsValue(maxPcs) +
          "</strong>개<span class=\"pcs-kicker\"> · 벌크(kg)×1000÷1개당(" +
          u +
          ")</span></span>"
      );
      const at97 = maxPcs * (TARGET_MIN / 100);
      lines.push(
        '<span class="pcs-line pcs-at97"><strong>97% 목표 화장품 개수 약 ' +
          formatPcsValue(at97) +
          '</strong>개<span class="pcs-kicker"> · 이론 × 0.97</span></span>'
      );
    }

    if (lines.length === 0) {
      pcsCell.innerHTML = '<span class="pcs-empty">—</span>';
      pcsCell.className = "pcs-cell empty";
      return;
    }

    pcsCell.innerHTML = lines.join("");
    pcsCell.className = "pcs-cell";
  }

  function updateRow(tr) {
    updatePcsCell(tr);
    updateYieldBandTable(tr);
  }

  function escapeAttr(s) {
    return String(s ?? "")
      .replace(/&/g, "&amp;")
      .replace(/"/g, "&quot;")
      .replace(/</g, "&lt;");
  }

  function createRow(data) {
    const trMain = document.createElement("tr");
    trMain.className = "data-row";
    const perUnitVal = escapeAttr(data?.perUnit ?? "");
    const inputVal = escapeAttr(data?.input ?? "");
    const unitsPerBoxVal = escapeAttr(data?.unitsPerBox ?? "");
    const note = escapeAttr(data?.note ?? "");
    const isG = data?.perUnitUnit === "g";
    const selMl = isG ? "" : " selected";
    const selG = isG ? " selected" : "";

    trMain.innerHTML = `
      <td><input type="text" data-field="input" inputmode="decimal" placeholder="예: 125.5 (kg)" value="${inputVal}" aria-label="사용한 벌크량 kg" /></td>
      <td class="td-per-unit">
        <div class="per-unit-wrap">
          <input type="text" data-field="perUnit" inputmode="decimal" placeholder="예: 50" value="${perUnitVal}" aria-label="제품 1개당 내용량 숫자" />
          <select data-field="perUnitUnit" class="unit-select" aria-label="1개당 단위 mL 또는 g">
            <option value="ml"${selMl}>mL</option>
            <option value="g"${selG}>g</option>
          </select>
        </div>
      </td>
      <td><input type="text" data-field="unitsPerBox" inputmode="numeric" placeholder="예: 24" value="${unitsPerBoxVal}" aria-label="박스당 입수 개" /></td>
      <td class="pcs-cell empty"><span class="pcs-empty">1개당 내용량(mL 또는 g) 입력</span></td>
      <td><input type="text" data-field="note" placeholder="비고" value="${note}" /></td>
      <td><button type="button" class="btn icon" title="이 행 삭제" aria-label="이 행 삭제">×</button></td>
    `;

    const trDecile = document.createElement("tr");
    trDecile.className = "decile-row";
    trDecile.innerHTML =
      '<td colspan="6" class="decile-cell"><div class="decile-wrap"></div></td>';
    trMain._decileRow = trDecile;

    const onChange = () => updateRow(trMain);
    trMain.querySelector('[data-field="perUnit"]').addEventListener("input", onChange);
    trMain.querySelector('[data-field="perUnitUnit"]').addEventListener("change", onChange);
    trMain.querySelector('[data-field="input"]').addEventListener("input", onChange);
    trMain.querySelector('[data-field="unitsPerBox"]').addEventListener("input", onChange);
    trMain
      .querySelectorAll('[data-field="perUnit"], [data-field="input"], [data-field="unitsPerBox"]')
      .forEach(function (el) {
        el.addEventListener("keydown", function (ev) {
          if (ev.key === "Enter") {
            ev.preventDefault();
            recalculateAll();
          }
        });
      });
    trMain.querySelector(".btn.icon").addEventListener("click", () => {
      if (trMain._decileRow) {
        trMain._decileRow.remove();
      }
      trMain.remove();
      if (!tbody.querySelector("tr.data-row")) addRow();
    });

    tbody.appendChild(trMain);
    tbody.appendChild(trDecile);

    updateRow(trMain);
    return trMain;
  }

  function addRow(data) {
    createRow(data);
  }

  calcAllBtn.addEventListener("click", recalculateAll);
  addRowBtn.addEventListener("click", () => addRow());
  clearAllBtn.addEventListener("click", () => {
    tbody.innerHTML = "";
    addRow();
  });

  addRow({ perUnit: "", input: "", unitsPerBox: "", note: "", perUnitUnit: "ml" });
})();
