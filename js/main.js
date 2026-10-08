(function () {
  "use strict";

  // Mobile navigation toggle
  var header = document.querySelector(".site-header");
  var toggle = document.getElementById("navToggle");
  var toggleLabel = document.getElementById("navToggleLabel");
  var nav = document.getElementById("siteNav");

  function setNavOpen(isOpen) {
    if (!header || !toggle) {
      return;
    }

    header.classList.toggle("is-open", isOpen);
    toggle.setAttribute("aria-expanded", isOpen ? "true" : "false");

    if (toggleLabel) {
      toggleLabel.textContent = isOpen
        ? "Menü schließen"
        : "Menü öffnen";
    }
  }

  if (header && toggle) {
    toggle.addEventListener("click", function () {
      setNavOpen(!header.classList.contains("is-open"));
    });

    document.addEventListener("keydown", function (event) {
      if (
        event.key === "Escape" &&
        header.classList.contains("is-open")
      ) {
        setNavOpen(false);
        toggle.focus();
      }
    });

    if (nav) {
      nav.addEventListener("click", function (event) {
        if (event.target.tagName === "A") {
          setNavOpen(false);
        }
      });
    }
  }

  // Footer year
  var yearEl = document.getElementById("year");

  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }
})();
