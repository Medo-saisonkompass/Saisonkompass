(() => {
  "use strict";

  const grid = document.getElementById("seasonGrid");
  if (!grid) return;

  const calendar = window.SaisonKompassSeasonCalendar;
  if (!calendar) return;

  const { seasons, focus, ordered, formatGermanDate } =
    calendar.getSeasonState();

  ordered.forEach((season, index) => {
    const card = grid.querySelector(
      `[data-season="${season.id}"]`
    );

    if (!card) return;

    // DOM order matches visual and screen-reader order.
    grid.appendChild(card);

    card.querySelector("[data-season-number]").textContent =
      String(index + 1).padStart(2, "0");

    card.querySelector("[data-season-date]").textContent =
      formatGermanDate(season.eventDate);

    const status = card.querySelector(
      "[data-season-status]"
    );

    status.textContent =
      season.id === focus.id
        ? (season.active ? "JETZT IM FOKUS" : "ALS NÄCHSTES")
        : (index === 1 ? "DANACH" : "IM JAHRESVERLAUF");

    card.classList.toggle(
      "is-current",
      season.id === focus.id
    );

    if (season.id === focus.id) {
      card.setAttribute(
        "aria-label",
        `${season.label}: ${
          season.active ? "jetzt im Fokus" : "als Nächstes"
        }`
      );
    } else {
      card.removeAttribute("aria-label");
    }
  });

  // Update the current season note.
  const focusNote = document.getElementById(
    "currentSeasonNote"
  );

  if (focusNote) {
    focusNote.textContent = focus.active
      ? `Jetzt im Fokus: ${focus.label}`
      : `Als Nächstes im Fokus: ${focus.label}`;
  }

  // Seasonal orientation links.
  const orientationBySeason = {
    halloween: [
      {
        intent: "ideas",
        label: "Halloween-Ideen entdecken",
        href: "/halloween/"
      },
      {
        intent: "planning",
        label: "Halloween-Party planen",
        href: "/guides/halloween-party-planen/"
      },
      {
        intent: "choosing",
        label: "Das passende Halloween-Kostüm finden",
        href: "/guides/halloween-kostuem-finden/"
      },
      {
        intent: "experiences",
        label: "Halloween-Erlebnisse entdecken",
        href: "/halloween/"
      }
    ],

    blackfriday: [
      {
        intent: "ideas",
        label: "Black Friday entdecken",
        href: "/black-friday/"
      },
      {
        intent: "planning",
        label: "Black Friday vorbereiten",
        href: "/black-friday/"
      },
      {
        intent: "choosing",
        label: "Angebote und Kaufentscheidungen einordnen",
        href: "/black-friday/"
      }
    ],

    christmas: [
      {
        intent: "ideas",
        label: "Weihnachtsideen entdecken",
        href: "/weihnachten/"
      },
      {
        intent: "planning",
        label: "Weihnachten planen",
        href: "/guides/weihnachten-planen/"
      },
      {
        intent: "choosing",
        label: "Geschenke und Möglichkeiten auswählen",
        href: "/weihnachten/"
      }
    ]
  };

  const orientationList = document.getElementById(
    "orientationList"
  );

  const orientationItems =
    orientationBySeason[focus.id] || [];

  if (orientationList && orientationItems.length) {
    orientationList.replaceChildren();

    orientationItems.forEach((item, index) => {
      const link = document.createElement("a");

      link.className = "home-orientation-item";
      link.href = item.href;
      link.dataset.intent = item.intent;

      const number = document.createElement("span");
      number.textContent =
        String(index + 1).padStart(2, "0");

      const label = document.createElement("strong");
      label.textContent = item.label;

      const arrow = document.createElement("span");
      arrow.setAttribute("aria-hidden", "true");
      arrow.textContent = "↗";

      link.append(number, label, arrow);
      orientationList.appendChild(link);
    });
  }

  // Update the orientation section heading.
  const orientationKicker = document.querySelector(
    ".home-orientation__intro .home-kicker"
  );

  if (orientationKicker) {
    orientationKicker.textContent =
      focus.id === "halloween"
        ? "AKTUELL IM FOKUS · HALLOWEEN"
        : focus.id === "blackfriday"
          ? "AKTUELL IM FOKUS · BLACK FRIDAY"
          : "AKTUELL IM FOKUS · WEIHNACHTEN";
  }

  const orientationTitle = document.getElementById(
    "orientation-title"
  );

  if (orientationTitle) {
    orientationTitle.textContent =
      focus.id === "halloween"
        ? "Wobei brauchst du Orientierung?"
        : focus.id === "blackfriday"
          ? "Worauf kommt es beim Black Friday an?"
          : "Was möchtest du für Weihnachten vorbereiten?";
  }

  const orientationIntro = document.querySelector(
    ".home-orientation__intro > p:not(.home-kicker):not(.home-current-focus)"
  );

  if (orientationIntro) {
    orientationIntro.textContent =
      focus.id === "halloween"
        ? "Wähle, wobei du Unterstützung brauchst – von der Partyplanung über Kostümideen bis zu Erlebnissen."
        : focus.id === "blackfriday"
          ? "Finde Orientierung zu Angeboten, Vergleichen und bewussten Kaufentscheidungen rund um den Black Friday."
          : "Finde hilfreiche Einstiege für deine Weihnachtsplanung, Geschenkideen und besondere Momente.";
  }
})();
