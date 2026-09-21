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

(() => {
  const dialog = document.querySelector("#quickstart-lightbox");
  const image = dialog?.querySelector(".quickstart-lightbox__image");
  const viewport = dialog?.querySelector(".quickstart-lightbox__viewport");
  const originalLink = dialog?.querySelector(".quickstart-lightbox__original");
  const closeButton = dialog?.querySelector(".quickstart-lightbox__close");
  const imageLinks = document.querySelectorAll(".quickstart-image-link");

  if (!dialog || !image || !viewport || !originalLink || !closeButton || typeof dialog.showModal !== "function") {
    return;
  }

  let trigger = null;

  const setActualSize = (actualSize, position = { x: 0.5, y: 0.5 }) => {
    dialog.classList.toggle("is-actual-size", actualSize);
    image.setAttribute(
      "aria-label",
      actualSize ? "ウィンドウ内に収まる表示に切り替える" : "原寸表示に切り替える",
    );

    if (!actualSize) {
      viewport.scrollTo({ top: 0, left: 0, behavior: "auto" });
      return;
    }

    window.requestAnimationFrame(() => {
      const left = position.x * image.scrollWidth - viewport.clientWidth / 2;
      const top = position.y * image.scrollHeight - viewport.clientHeight / 2;
      viewport.scrollTo({ top, left, behavior: "auto" });
    });
  };

  const toggleImageSize = (position) => {
    setActualSize(!dialog.classList.contains("is-actual-size"), position);
  };

  imageLinks.forEach((link) => {
    link.addEventListener("click", (event) => {
      if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
        return;
      }

      const preview = link.querySelector("img");
      event.preventDefault();
      trigger = link;
      image.src = link.href;
      image.alt = preview?.alt || "";
      originalLink.href = link.href;
      setActualSize(false);
      document.body.classList.add("quickstart-lightbox-open");
      dialog.showModal();
      viewport.scrollTo({ top: 0, left: 0, behavior: "auto" });
      closeButton.focus();
    });
  });

  image.addEventListener("click", (event) => {
    if (dialog.classList.contains("is-actual-size")) {
      toggleImageSize();
      return;
    }

    const rect = image.getBoundingClientRect();
    toggleImageSize({
      x: (event.clientX - rect.left) / rect.width,
      y: (event.clientY - rect.top) / rect.height,
    });
  });

  image.addEventListener("keydown", (event) => {
    if (event.key !== "Enter" && event.key !== " ") {
      return;
    }

    event.preventDefault();
    toggleImageSize();
  });

  closeButton.addEventListener("click", () => dialog.close());

  dialog.addEventListener("click", (event) => {
    if (event.target === dialog) {
      dialog.close();
    }
  });

  dialog.addEventListener("close", () => {
    document.body.classList.remove("quickstart-lightbox-open");
    dialog.classList.remove("is-actual-size");
    image.removeAttribute("src");
    image.alt = "";
    image.setAttribute("aria-label", "原寸表示に切り替える");
    trigger?.focus({ preventScroll: true });
    trigger = null;
  });
})();
