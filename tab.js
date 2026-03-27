(function () {
  const panelMain = document.getElementById("panel-main");
  const panelReverse = document.getElementById("reverse");
  const tabMain = document.getElementById("tab-main");
  const tabReverse = document.getElementById("tab-reverse");

  function sync() {
    const rev = location.hash === "#reverse";
    if (panelMain) panelMain.hidden = rev;
    if (panelReverse) panelReverse.hidden = !rev;
    if (tabMain) {
      tabMain.classList.toggle("site-nav-btn--active", !rev);
      if (rev) {
        tabMain.removeAttribute("aria-current");
      } else {
        tabMain.setAttribute("aria-current", "page");
      }
    }
    if (tabReverse) {
      tabReverse.classList.toggle("site-nav-btn--active", rev);
      if (rev) {
        tabReverse.setAttribute("aria-current", "page");
      } else {
        tabReverse.removeAttribute("aria-current");
      }
    }
    document.title = rev
      ? "역산 · 생산 개수로 보는 벌크"
      : "몇 박스 나오는지 계산기";
  }

  window.addEventListener("hashchange", sync);
  sync();
})();
