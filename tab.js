(function () {
  const panelMain = document.getElementById("panel-main");
  const panelReverse = document.getElementById("reverse");
  const panelLoss = document.getElementById("loss");
  const tabMain = document.getElementById("tab-main");
  const tabReverse = document.getElementById("tab-reverse");
  const tabLoss = document.getElementById("tab-loss");

  function sync() {
    const h = location.hash;
    const isReverse = h === "#reverse";
    const isLoss = h === "#loss";

    if (panelMain) panelMain.hidden = isReverse || isLoss;
    if (panelReverse) panelReverse.hidden = !isReverse;
    if (panelLoss) panelLoss.hidden = !isLoss;

    if (tabMain) {
      tabMain.classList.toggle("site-nav-btn--active", !isReverse && !isLoss);
      if (isReverse || isLoss) {
        tabMain.removeAttribute("aria-current");
      } else {
        tabMain.setAttribute("aria-current", "page");
      }
    }
    if (tabReverse) {
      tabReverse.classList.toggle("site-nav-btn--active", isReverse);
      if (isReverse) {
        tabReverse.setAttribute("aria-current", "page");
      } else {
        tabReverse.removeAttribute("aria-current");
      }
    }
    if (tabLoss) {
      tabLoss.classList.toggle("site-nav-btn--active", isLoss);
      if (isLoss) {
        tabLoss.setAttribute("aria-current", "page");
      } else {
        tabLoss.removeAttribute("aria-current");
      }
    }

    if (isReverse) {
      document.title = "역산 · 생산 개수로 보는 벌크";
    } else if (isLoss) {
      document.title = "손실 시간 계산기";
    } else {
      document.title = "몇 박스 나오는지 계산기";
    }
  }

  window.addEventListener("hashchange", sync);
  sync();
})();
