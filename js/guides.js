(() => {
  "use strict";

  const calendar = window.SaisonKompassSeasonCalendar;
  if (!calendar) return;

  const main = document.getElementById("main");
  if (!main) return;

  const { ordered } = calendar.getSeasonState();
  const sectionBySeason = {
    halloween: document.getElementById("halloween-guides"),
    christmas: document.getElementById("weihnachten-guides")
  };

  // Only seasons with actual Guides content participate in this page.
  const available = ordered
    .filter((season) => sectionBySeason[season.id])
    .map((season) => ({ ...season, section: sectionBySeason[season.id] }));

  if (!available.length) return;

  const closing = main.querySelector(".guide-closing");

  available.forEach((item, index) => {
    const { season, section } = item;
    main.insertBefore(section, closing || null);

    const marker = section.querySelector("[data-guide-season-marker]");
    if (marker) {
      marker.textContent = `${String(index + 1).padStart(2, "0")} / ${
        index === 0 ? "IM FOKUS" : "DANACH"
      }`;
    }

    section.classList.toggle("is-season-focus", index === 0);
    section.classList.toggle("is-season-next", index > 0);
  });

  // Keep the hero shortcut aligned with the first visible season section.
  const heroLink = document.querySelector(".guide-hub-hero__copy a[href^='#']");
  if (heroLink) {
    heroLink.href = `#${available[0].section.id}`;
  }
})();
