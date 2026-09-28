(function () {
  "use strict";

  // Mobile navigation toggle
  var header = document.querySelector(".site-header");
  var toggle = document.getElementById("navToggle");
  var toggleLabel = document.getElementById("navToggleLabel");

  function setNavOpen(isOpen) {
    header.classList.toggle("is-open", isOpen);
    toggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
    if (toggleLabel) {
      toggleLabel.textContent = isOpen ? "Menü schließen" : "Menü öffnen";
    }
  }

  if (header && toggle) {
    toggle.addEventListener("click", function () {
      setNavOpen(!header.classList.contains("is-open"));
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && header.classList.contains("is-open")) {
        setNavOpen(false);
        toggle.focus();
      }
    });
  }

  // Footer year
  var yearEl = document.getElementById("year");
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }
})();
