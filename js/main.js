
(function () {
  "use strict";

  // Existing mobile navigation
  var header = document.querySelector(".site-header");
  var toggle = document.getElementById("navToggle");
  var toggleLabel = document.getElementById("navToggleLabel");
  var nav =
    document.getElementById("siteNav") ||
    document.getElementById("primaryNav");

  function setNavOpen(isOpen) {
    if (!header || !toggle) return;

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
        if (event.target.closest("a")) setNavOpen(false);
      });
    }
  }

  // Footer year
  var yearEl =
    document.getElementById("currentYear") ||
    document.getElementById("year");

  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  // GA4 consent management
  var GA_ID = "G-BCXTRQWL89";
  var CONSENT_KEY = "saisonkompass_analytics_consent";

  function getConsent() {
    try {
      return localStorage.getItem(CONSENT_KEY);
    } catch (error) {
      return null;
    }
  }

  function saveConsent(value) {
    try {
      localStorage.setItem(CONSENT_KEY, value);
      return true;
    } catch (error) {
      return false;
    }
  }

  function loadAnalytics() {
    if (window.__saisonkompassGaLoaded) return;

    window.__saisonkompassGaLoaded = true;
    window.dataLayer = window.dataLayer || [];

    function gtag() {
      window.dataLayer.push(arguments);
    }

    window.gtag = gtag;

    gtag("consent", "default", {
      analytics_storage: "denied",
      ad_storage: "denied",
      ad_user_data: "denied",
      ad_personalization: "denied"
    });

    gtag("consent", "update", {
      analytics_storage: "granted",
      ad_storage: "denied",
      ad_user_data: "denied",
      ad_personalization: "denied"
    });

    gtag("js", new Date());
    gtag("config", GA_ID);

    var script = document.createElement("script");
    script.async = true;
    script.src =
      "https://www.googletagmanager.com/gtag/js?id=" +
      encodeURIComponent(GA_ID);

    script.onerror = function () {
      window.__saisonkompassGaLoaded = false;
    };

    document.head.appendChild(script);
  }

  // Consent UI styles
  var style = document.createElement("style");
  style.textContent = `
    #sk-consent-banner {
      position: fixed;
      z-index: 99999;
      left: 16px;
      right: 16px;
      bottom: 16px;
      max-width: 760px;
      margin: 0 auto;
      padding: 22px;
      background: #F1EAD9;
      color: #26211D;
      border: 1px solid #D2C5AA;
      border-radius: 12px;
      box-shadow: 0 8px 32px rgba(38,33,29,.18);
      font: 14px/1.6 "Work Sans", sans-serif;
    }
    #sk-consent-banner h2 {
      margin: 0 0 8px;
      font: 600 23px/1.25 "Newsreader", Georgia, serif;
    }
    #sk-consent-banner p {
      margin: 0 0 14px;
    }
    #sk-consent-banner a {
      color: #26211D;
      text-decoration: underline;
    }
    .sk-consent-actions {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
    }
    .sk-consent-actions button,
    #sk-consent-settings {
      min-height: 42px;
      padding: 10px 15px;
      border: 1px solid #26211D;
      border-radius: 6px;
      font: 600 14px "Work Sans", sans-serif;
      cursor: pointer;
    }
    .sk-consent-accept {
      background: #26211D;
      color: #F1EAD9;
    }
    .sk-consent-reject,
    .sk-consent-options {
      background: transparent;
      color: #26211D;
    }
    #sk-consent-settings {
      position: fixed;
      z-index: 99998;
      right: 12px;
      bottom: 12px;
      background: #F1EAD9;
      color: #26211D;
      box-shadow: 0 2px 10px rgba(38,33,29,.15);
    }
    #sk-consent-settings[hidden],
    #sk-consent-banner[hidden] {
      display: none;
    }
    @media (max-width: 480px) {
      #sk-consent-banner {
        left: 8px;
        right: 8px;
        bottom: 8px;
        padding: 16px;
      }
      .sk-consent-actions {
        flex-direction: column;
      }
      .sk-consent-actions button {
        width: 100%;
      }
    }
  `;
  document.head.appendChild(style);

  // Create consent banner
  var banner = document.createElement("section");
  banner.id = "sk-consent-banner";
  banner.setAttribute("aria-labelledby", "sk-consent-title");
  banner.setAttribute("aria-describedby", "sk-consent-description");
  banner.setAttribute("role", "dialog");
  banner.setAttribute("aria-modal", "false");

  banner.innerHTML = `
    <h2 id="sk-consent-title">Deine Datenschutzeinstellungen</h2>
    <p id="sk-consent-description">
      Wir verwenden Google Analytics, um zu verstehen, wie unsere Website
      genutzt wird. Die Analyse wird erst aktiviert, wenn du zustimmst.
      Du kannst deine Auswahl jederzeit ändern.
      Weitere Informationen findest du in unserer
      <a href="/datenschutz/">Datenschutzerklärung</a>.
    </p>
    <div class="sk-consent-actions">
      <button type="button" class="sk-consent-accept">
        Akzeptieren
      </button>
      <button type="button" class="sk-consent-reject">
        Ablehnen
      </button>
      <button type="button" class="sk-consent-options">
        Einstellungen
      </button>
    </div>
  `;

  var settingsButton = document.createElement("button");
  settingsButton.id = "sk-consent-settings";
  settingsButton.type = "button";
  settingsButton.textContent = "Cookie-Einstellungen";

  document.body.appendChild(banner);
  document.body.appendChild(settingsButton);

  function showBanner() {
    banner.hidden = false;
    settingsButton.hidden = true;
    banner.querySelector(".sk-consent-accept").focus();
  }

  function hideBanner() {
    banner.hidden = true;
    settingsButton.hidden = false;
  }

  function chooseConsent(value) {
    if (!saveConsent(value)) {
      // If consent cannot be stored, do not activate analytics.
      hideBanner();
      return;
    }

    if (value === "accepted") {
      loadAnalytics();
    }

    hideBanner();
  }

  banner.querySelector(".sk-consent-accept").addEventListener(
    "click",
    function () {
      chooseConsent("accepted");
    }
  );

  banner.querySelector(".sk-consent-reject").addEventListener(
    "click",
    function () {
      chooseConsent("rejected");
    }
  );

  banner.querySelector(".sk-consent-options").addEventListener(
    "click",
    function () {
      // This site currently offers analytics only as an optional category.
      // The visitor can accept or reject it explicitly.
      banner.querySelector(".sk-consent-description").textContent =
        "Optionale Analyse: Google Analytics hilft uns, die Nutzung " +
        "der Website zu verstehen. Die Analyse bleibt ausgeschaltet, " +
        "wenn du ablehnst. Du kannst deine Auswahl jederzeit ändern.";
    }
  );

  settingsButton.addEventListener("click", showBanner);

  var existingConsent = getConsent();

  if (existingConsent === "accepted") {
    hideBanner();
    loadAnalytics();
  } else if (existingConsent === "rejected") {
    hideBanner();
  } else {
    showBanner();
  }
})();
