(() => {
  "use strict";

  // Shared seasonal calendar for all SaisonKompass pages.
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

  // Black Friday in Germany: Friday after the fourth Thursday in November.
  const blackFridayDate = (year) => {
    const nov1 = date(year, 11, 1);
    const firstThursday = 1 + ((4 - nov1.getUTCDay() + 7) % 7);
    return date(year, 11, firstThursday + 22);
  };

  const formatGermanDate = (value) =>
    new Intl.DateTimeFormat("de-DE", {
      timeZone: "Europe/Berlin",
      day: "numeric",
      month: "long",
      year: "numeric"
    }).format(value);

  const getSeasonState = () => {
    const today = todayInBerlin();
    const year = today.getUTCFullYear();

    const definitions = [
      {
        id: "halloween",
        label: "Halloween",
        path: "/halloween/",
        dateFor: (y) => date(y, 10, 31),
        windowFor: (y) => [date(y, 9, 1), date(y, 10, 31)]
      },
      {
        id: "blackfriday",
        label: "Black Friday",
        path: "/black-friday/",
        dateFor: blackFridayDate,
        windowFor: (y) => [date(y, 11, 1), blackFridayDate(y)]
      },
      {
        id: "christmas",
        label: "Weihnachten",
        path: "/weihnachten/",
        dateFor: (y) => date(y, 12, 24),
        windowFor: (y) => [date(y, 11, 1), date(y, 12, 26)]
      }
    ];

    const seasons = definitions.map((definition) => {
      let eventDate = definition.dateFor(year);
      if (compare(eventDate, today) < 0) {
        eventDate = definition.dateFor(year + 1);
      }

      const [windowStart, windowEnd] = definition.windowFor(year);
      return {
        ...definition,
        eventDate,
        active: inRange(today, windowStart, windowEnd)
      };
    });

    // Preserve the existing homepage focus precedence.
    let focus = seasons.find((season) => season.id === "halloween" && season.active);
    if (!focus) {
      focus = seasons.find((season) => season.id === "blackfriday" && season.active);
    }
    if (!focus) {
      focus = seasons.find((season) => season.id === "christmas" && season.active);
    }
    if (!focus) {
      focus = [...seasons].sort((a, b) => compare(a.eventDate, b.eventDate))[0];
    }

    const ordered = [...seasons].sort((a, b) => {
      if (a.id === focus.id) return -1;
      if (b.id === focus.id) return 1;
      return compare(a.eventDate, b.eventDate);
    });

    return { today, year, seasons, focus, ordered, formatGermanDate };
  };

  window.SaisonKompassSeasonCalendar = Object.freeze({ getSeasonState });
})();
