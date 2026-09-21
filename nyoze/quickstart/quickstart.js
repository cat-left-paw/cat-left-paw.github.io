(() => {
  const article = document.querySelector(".quickstart-article");
  const outline = document.querySelector(".quickstart-outline");
  const list = document.querySelector("#quickstart-outline-list");

  if (!article || !outline || !list) {
    return;
  }

  const headings = Array.from(article.querySelectorAll(":scope > h2[id], :scope > h3[id]"))
    .filter((heading) => heading.id !== "quickstart-toc-title");

  if (!headings.length) {
    outline.hidden = true;
    return;
  }

  const links = new Map();
  const fragment = document.createDocumentFragment();

  headings.forEach((heading) => {
    const item = document.createElement("li");
    const link = document.createElement("a");
    const level = heading.tagName.toLowerCase();

    item.className = `quickstart-outline__item quickstart-outline__item--${level}`;
    link.className = "quickstart-outline__link";
    link.href = `#${encodeURIComponent(heading.id)}`;
    link.textContent = heading.textContent.trim();
    item.append(link);
    fragment.append(item);
    links.set(heading, link);
  });

  list.append(fragment);

  let activeHeading = null;
  let frameRequested = false;

  const keepActiveLinkVisible = (link) => {
    if (!link || outline.clientHeight === 0 || outline.scrollHeight <= outline.clientHeight) {
      return;
    }

    const outlineRect = outline.getBoundingClientRect();
    const linkRect = link.getBoundingClientRect();
    const edgePadding = Math.min(48, outline.clientHeight * 0.12);
    const visibleTop = outlineRect.top + edgePadding;
    const visibleBottom = outlineRect.bottom - edgePadding;

    if (linkRect.top >= visibleTop && linkRect.bottom <= visibleBottom) {
      return;
    }

    const centeredOffset = (outline.clientHeight - linkRect.height) / 2;
    const nextScrollTop = outline.scrollTop + linkRect.top - outlineRect.top - centeredOffset;
    outline.scrollTo({ top: nextScrollTop, behavior: "auto" });
  };

  const updateActiveHeading = () => {
    frameRequested = false;
    const referenceLine = Math.max(120, window.innerHeight * 0.28);
    let nextHeading = headings[0];

    for (const heading of headings) {
      if (heading.getBoundingClientRect().top > referenceLine) {
        break;
      }
      nextHeading = heading;
    }

    if (nextHeading !== activeHeading) {
      if (activeHeading) {
        links.get(activeHeading)?.removeAttribute("aria-current");
      }

      links.get(nextHeading)?.setAttribute("aria-current", "location");
      activeHeading = nextHeading;
    }

    keepActiveLinkVisible(links.get(nextHeading));
  };

  const requestUpdate = () => {
    if (!frameRequested) {
      frameRequested = true;
      window.requestAnimationFrame(updateActiveHeading);
    }
  };

  window.addEventListener("scroll", requestUpdate, { passive: true });
  window.addEventListener("resize", requestUpdate);
  updateActiveHeading();
})();
