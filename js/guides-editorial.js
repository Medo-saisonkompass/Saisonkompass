(() => {
  "use strict";

  const article = document.querySelector(".page-guide-article .guide-article");
  if (!article) return;

  const content = article.querySelector(".guide-article__content") || article.querySelector(":scope > .wrap");
  if (!content) return;

  const headings = Array.from(content.querySelectorAll("h2"));
  if (headings.length < 4) return;

  const slugify = (value) => value
    .toLocaleLowerCase("de-DE")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/ß/g, "ss")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

  const used = new Set(Array.from(document.querySelectorAll("[id]")).map((node) => node.id));
  const list = document.createElement("ol");

  headings.forEach((heading, index) => {
    if (!heading.id) {
      const base = slugify(heading.textContent) || `abschnitt-${index + 1}`;
      let candidate = base;
      let suffix = 2;
      while (used.has(candidate)) candidate = `${base}-${suffix++}`;
      heading.id = candidate;
      used.add(candidate);
    }

    const item = document.createElement("li");
    const link = document.createElement("a");
    link.href = `#${heading.id}`;
    link.textContent = heading.textContent.trim();
    item.append(link);
    list.append(item);
  });

  const toc = document.createElement("details");
  toc.className = "guide-toc";
  toc.open = true;

  const summary = document.createElement("summary");
  summary.textContent = "In diesem Guide";
  toc.append(summary, list);
  content.prepend(toc);
})();
