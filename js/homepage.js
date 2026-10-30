
(() => {
  "use strict";

  const grid = document.getElementById("seasonGrid");
  if (!grid) return;

  // Use the visitor's German calendar date, not the server's UTC date.
  const todayInBerlin = () => {
    const parts = new Intl.DateTimeFormat("en-CA", {
      timeZone: "Europe/Berlin",
      year: "numeric",
      month: "2-digit",
      day: "2-digit"
    }).formatToParts(new Date());

    const values = Object.fromEntries(
      parts.map(({ type, value }) => [type, value])
    );

    return new Date(Date.UTC(
      +values.year,
      +values.month - 1,
      +values.day,
      12
    ));
  };

  const date = (year, month, day) =>
    new Date(Date.UTC(year, month - 1, day, 12));

  const compare = (a, b) => a.getTime() - b.getTime();

  const inRange = (value, start, end) =>
    compare(value, start) >= 0 && compare(value, end) <= 0;

  // Black Friday in Germany is the Friday after the fourth Thursday in November.
  const blackFridayDate = (year) => {
    const nov1 = date(year, 11, 1);
    const firstThursday =
      1 + ((4 - nov1.getUTCDay() + 7) % 7);

    return date(year, 11, firstThursday + 22);
  };

  const formatGermanDate = (value) =>
    new Intl.DateTimeFormat("de-DE", {
      timeZone: "Europe/Berlin",
      day: "numeric",
      month: "long",
      year: "numeric"
    }).format(value);

  const today = todayInBerlin();
  const year = today.getUTCFullYear();

  const definitions = [
    {
      id: "halloween",
      label: "Halloween",
      path: "/halloween/",
      dateFor: (y) => date(y, 10, 31),
      windowFor: (y) => [
        date(y, 9, 1),
        date(y, 10, 31)
      ]
    },
    {
      id: "blackfriday",
      label: "Black Friday",
      path: "/black-friday/",
      dateFor: blackFridayDate,
      windowFor: (y) => [
        date(y, 11, 1),
        blackFridayDate(y)
      ]
    },
    {
      id: "christmas",
      label: "Weihnachten",
      path: "/weihnachten/",
      dateFor: (y) => date(y, 12, 24),
      // Christmas preparation begins in November.
      windowFor: (y) => [
        date(y, 11, 1),
        date(y, 12, 26)
      ]
    }
  ];

  const seasons = definitions.map((definition) => {
    let eventDate = definition.dateFor(year);

    if (compare(eventDate, today) < 0) {
      eventDate = definition.dateFor(year + 1);
    }

    const [windowStart, windowEnd] =
      definition.windowFor(year);

    const active = inRange(
      today,
      windowStart,
      windowEnd
    );

    return {
      ...definition,
      eventDate,
      active
    };
  });

  // Determine the current seasonal focus.
  let focus = seasons.find(
    (season) =>
      season.id === "halloween" && season.active
  );

  if (!focus) {
    focus = seasons.find(
      (season) =>
        season.id === "blackfriday" && season.active
    );
  }

  if (!focus) {
    focus = seasons.find(
      (season) =>
        season.id === "christmas" && season.active
    );
  }

  if (!focus) {
    focus = [...seasons].sort(
      (a, b) => compare(a.eventDate, b.eventDate)
    )[0];
  }

  // Put the current focus first, followed by upcoming seasons.
  const ordered = [...seasons].sort((a, b) => {
    if (a.id === focus.id) return -1;
    if (b.id === focus.id) return 1;

    return compare(a.eventDate, b.eventDate);
  });

  // Update season cards and their actual DOM order.
  ordered.forEach((season, index) => {
    const card = grid.querySelector(
      `[data-season="${season.id}"]`
    );

    if (!card) return;

    grid.appendChild(card);

    card.querySelector(
      "[data-season-number]"
    ).textContent = String(index + 1).padStart(2, "0");

    card.querySelector(
      "[data-season-date]"
    ).textContent = formatGermanDate(season.eventDate);

    const status = card.querySelector(
      "[data-season-status]"
    );

    status.textContent =
      season.id === focus.id
        ? (season.active
            ? "JETZT IM FOKUS"
            : "ALS NÄCHSTES")
        : (index === 1
            ? "DANACH"
            : "IM JAHRESVERLAUF");

    card.classList.toggle(
      "is-current",
      season.id === focus.id
    );

    if (season.id === focus.id) {
      card.setAttribute(
        "aria-label",
        `${season.label}: ${
          season.active
            ? "jetzt im Fokus"
            : "als Nächstes"
        }`
      );
    } else {
      card.removeAttribute("aria-label");
    }
  });

  // Update the current seasonal focus note.
  const focusNote = document.getElementById(
    "currentSeasonNote"
  );

  if (focusNote) {
    focusNote.textContent = focus.active
      ? `Jetzt im Fokus: ${focus.label}`
      : `Als Nächstes im Fokus: ${focus.label}`;
  }

  // Seasonal destinations for the general need-based section.
  const destinations = {
    halloween: {
      ideas: "/halloween/",
      planning: "/guides/halloween-party-planen/",
      choosing: "/guides/halloween-kostuem-finden/",
      experiences: "/halloween/#erlebnisse"
    },

    blackfriday: {
      ideas: "/black-friday/",
      planning: "/black-friday/",
      choosing: "/black-friday/",
      experiences: "/black-friday/"
    },

    christmas: {
      ideas: "/weihnachten/",
      planning: "/guides/weihnachten-planen/",
      choosing: "/weihnachten/",
      experiences: "/weihnachten/"
    }
  };

  document.querySelectorAll("[data-intent]").forEach(
    (link) => {
      const destination =
        destinations[focus.id]?.[link.dataset.intent];

      if (destination) {
        link.href = destination;
      }
    }
  );

})();
