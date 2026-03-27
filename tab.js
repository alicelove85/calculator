(function () {
  const panelMain = document.getElementById("panel-main");
  const panelReverse = document.getElementById("reverse");
  const panelLoss = document.getElementById("loss");
  const panelSpeed = document.getElementById("speed");
  const tabMain = document.getElementById("tab-main");
  const tabReverse = document.getElementById("tab-reverse");
  const tabLoss = document.getElementById("tab-loss");
  const tabSpeed = document.getElementById("tab-speed");

  function sync() {
    const h = location.hash;
    const isReverse = h === "#reverse";
    const isLoss = h === "#loss";
    const isSpeed = h === "#speed";

    if (panelMain) panelMain.hidden = isReverse || isLoss || isSpeed;
    if (panelReverse) panelReverse.hidden = !isReverse;
    if (panelLoss) panelLoss.hidden = !isLoss;
    if (panelSpeed) panelSpeed.hidden = !isSpeed;

    if (tabMain) {
      tabMain.classList.toggle("site-nav-btn--active", !isReverse && !isLoss && !isSpeed);
      if (isReverse || isLoss || isSpeed) {
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
    if (tabSpeed) {
      tabSpeed.classList.toggle("site-nav-btn--active", isSpeed);
      if (isSpeed) {
        tabSpeed.setAttribute("aria-current", "page");
      } else {
        tabSpeed.removeAttribute("aria-current");
      }
    }

    if (isReverse) {
      document.title = "역산 · 생산 개수로 보는 벌크";
    } else if (isLoss) {
      document.title = "시간 → 분 환산";
    } else if (isSpeed) {
      document.title = "분당속도 (EA)";
    } else {
      document.title = "몇 박스 나오는지 계산기";
    }
  }

  window.addEventListener("hashchange", sync);
  sync();
})();
