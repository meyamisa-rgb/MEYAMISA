(function () {
  const currentPage = window.location.pathname.split("/").pop() || "index.html";
  const timeNodes = document.querySelectorAll("[data-local-time]");

  function updateTime() {
    if (!timeNodes.length) {
      return;
    }

    const formatter = new Intl.DateTimeFormat("en-AU", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
      timeZone: "Australia/Melbourne",
    });

    const value = formatter.format(new Date());
    timeNodes.forEach((node) => {
      node.textContent = value;
    });
  }

  updateTime();
  setInterval(updateTime, 30000);

  const pageKey = currentPage.replace(/\.html$/, "");
  const navParents = {
    "amygdala-body-as-archive": "experimental-design.html",
    "folding-type-henshin-gallery": "experimental-design.html",
    "type-juice-mono": "experimental-design.html",
    "human-typography": "experimental-design.html",
  };
  const seriesCodes = {
    "body-archive": "BAR",
    "body-alphabet": "BAL",
    exhibition: "EXP",
    performance: "PRF",
    "type-studies": "XTP",
  };

  if (seriesCodes[pageKey]) {
    const seriesCode = seriesCodes[pageKey];
    document.querySelectorAll(".gallery-item figure").forEach((figure, index) => {
      const media = figure.querySelector("img, video");
      const caption = figure.querySelector("figcaption");
      if (!media || !caption) {
        return;
      }

      const mediaType = media.tagName.toLowerCase() === "video" ? "VID" : "IMG";
      const accession = String(index + 1).padStart(3, "0");
      caption.textContent = `ACC. MA-${seriesCode}-${mediaType}-${accession}`;
    });
  }

  const reveals = document.querySelectorAll(".reveal");
  if (reveals.length) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in-view");
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.16,
        rootMargin: "0px 0px -7% 0px",
      }
    );

    reveals.forEach((item, index) => {
      item.style.transitionDelay = `${Math.min(index * 45, 260)}ms`;
      observer.observe(item);
    });
  }

  document.querySelectorAll("[data-page-link]").forEach((link) => {
    const href = link.getAttribute("href");
    if (
      href === currentPage ||
      (currentPage === "" && href === "index.html") ||
      navParents[pageKey] === href
    ) {
      link.classList.add("is-active");
    }
  });

  const navToggle = document.querySelector("[data-nav-toggle]");
  const siteHeader = document.querySelector(".site-header");
  const siteNav = document.querySelector("#site-nav");
  if (navToggle && siteHeader && siteNav) {
    const closeNav = () => {
      siteHeader.classList.remove("nav-open");
      navToggle.setAttribute("aria-expanded", "false");
    };

    navToggle.addEventListener("click", () => {
      const isOpen = siteHeader.classList.toggle("nav-open");
      navToggle.setAttribute("aria-expanded", String(isOpen));
    });

    siteNav.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        if (window.matchMedia("(max-width: 760px)").matches) {
          closeNav();
        }
      });
    });

    window.addEventListener("resize", () => {
      if (!window.matchMedia("(max-width: 760px)").matches) {
        closeNav();
      }
    });
  }

  const backLink = document.querySelector("[data-back-link]");
  if (backLink) {
    backLink.addEventListener("click", (event) => {
      if (window.history.length > 1) {
        event.preventDefault();
        window.history.back();
      }
    });
  }

  const typeInput = document.querySelector("[data-type-input]");
  const typeOutput = document.querySelector("[data-type-output]");
  const typeScale = document.querySelector("[data-type-scale]");
  if (typeInput && typeOutput) {
    const updateTypeOutput = () => {
      typeOutput.textContent = typeInput.value || "TYPE JUICE MONO";
      if (typeScale) {
        typeOutput.style.fontSize = `${typeScale.value}px`;
      }
    };

    typeInput.addEventListener("input", updateTypeOutput);
    if (typeScale) {
      typeScale.addEventListener("input", updateTypeOutput);
    }
    updateTypeOutput();
  }

  if (pageKey === "exhibition") {
    const projectButtons = Array.from(document.querySelectorAll("[data-exhibition-target]"));
    const projectSections = Array.from(document.querySelectorAll("[data-exhibition-project]"));
    const validProjectIds = projectSections.map((section) => section.id);

    const setActiveProject = (nextId) => {
      const activeId = validProjectIds.includes(nextId) ? nextId : "studio-kan";

      projectSections.forEach((section) => {
        section.hidden = section.id !== activeId;
      });

      projectButtons.forEach((button) => {
        button.classList.toggle("is-active", button.dataset.exhibitionTarget === activeId);
      });

      window.history.replaceState(null, "", `#${activeId}`);
    };

    projectButtons.forEach((button) => {
      button.addEventListener("click", () => {
        setActiveProject(button.dataset.exhibitionTarget || "studio-kan");
      });
    });

    const hashId = window.location.hash.replace("#", "");
    setActiveProject(hashId);
  }

  if (pageKey === "amygdala-body-as-archive") {
    const createImageCard = (item) => `
      <article class="media-card${item.cardClass ? ` ${item.cardClass}` : ""}">
        ${item.title ? `<h3 class="media-card-title">${item.title}</h3>` : ""}
        <button class="media-trigger" type="button" data-lightbox-trigger data-gallery="${item.gallery}" aria-label="Open ${item.alt}">
          <img class="gallery-media${item.landscape ? " gallery-media-landscape" : ""}${item.imageClass ? ` ${item.imageClass}` : ""}" src="${item.src}" alt="${item.alt}" loading="lazy" />
        </button>
      </article>
    `;

    const createVideoCard = (item) => `
      <article class="video-card">
        ${item.title ? `<h3 class="video-card-title">${item.title}</h3>` : ""}
        <video class="video-frame-local" src="${item.src}" controls playsinline preload="metadata"></video>
        <div class="embed-actions">
          <button class="wide-button" type="button" data-lightbox-trigger data-lightbox-video="${item.src}" data-gallery="${item.gallery}">
            Open wide
          </button>
        </div>
      </article>
    `;

    const renderInto = (selector, markup) => {
      const target = document.querySelector(selector);
      if (target) {
        target.innerHTML = markup;
      }
    };

    renderInto(
      "#amygdala-storyboard-grid",
      [
        {
          title: "Amygdala - High Road Storyboard",
          src: "../assets/images/amygdala/storyboard-01.png",
          alt: "Amygdala High Road storyboard",
          gallery: "amygdala-storyboard",
          landscape: true,
        },
        {
          title: "Amygdala - Veritas Storyboard",
          src: "../assets/images/amygdala-storyboard.png",
          alt: "Amygdala Veritas storyboard",
          gallery: "amygdala-storyboard",
          landscape: true,
        },
        {
          title: "Amygdala - In Motion",
          src: "../assets/images/amygdala/storyboard-02.png",
          alt: "Amygdala In Motion storyboard",
          gallery: "amygdala-storyboard",
          landscape: true,
        },
      ]
        .map(createImageCard)
        .join("")
    );

    renderInto(
      "#amygdala-cansu-grid",
      Array.from({ length: 14 }, (_, index) =>
        createImageCard({
          src: `../assets/images/amygdala/cansu-${String(index + 1).padStart(2, "0")}.jpeg`,
          alt: `Veritas Corpus image ${index + 1}`,
          gallery: "amygdala-cansu",
        })
      ).join("")
    );

    renderInto(
      "#amygdala-meyamisa-grid",
      [2, 3, 4, 5, 6, 7, 8, 9, 10, 12, 13, 14, 15, 16, 17, 18, 19].map((imageNumber) =>
        createImageCard({
          src: `../assets/images/amygdala/meyamisa-${String(imageNumber).padStart(2, "0")}.jpeg`,
          alt: `Veritas exponere image ${imageNumber}`,
          gallery: "amygdala-meyamisa",
        })
      ).join("")
    );

    renderInto(
      "#amygdala-process-videos",
      Array.from({ length: 14 }, (_, index) =>
        createVideoCard({
          src: `../assets/videos/amygdala/process-${String(index + 1).padStart(2, "0")}.mp4`,
          gallery: "amygdala-process-videos",
        })
      ).join("")
    );

    renderInto(
      "#amygdala-installation-grid",
      [
        {
          src: "../assets/images/amygdala/installation-02-replacement.jpeg",
          alt: "Amygdala installation image 1",
          gallery: "amygdala-installation",
        },
        {
          src: "../assets/images/amygdala/installation-03-replacement.jpeg",
          alt: "Amygdala installation image 2",
          gallery: "amygdala-installation",
        },
        {
          src: "../assets/images/amygdala/installation-04-replacement.jpeg",
          alt: "Amygdala installation image 3",
          gallery: "amygdala-installation",
        },
      ]
        .map(createImageCard)
        .join("")
    );

    renderInto(
      "#amygdala-installation-videos",
      [
        createVideoCard({
          src: "../assets/videos/amygdala/installation-06-replacement.mp4",
          gallery: "amygdala-installation-videos",
        }),
        createVideoCard({
          src: "../assets/videos/amygdala/installation-08-replacement.mp4",
          gallery: "amygdala-installation-videos",
        })
      ].join("")
    );

    renderInto(
      "#amygdala-visitor-grid",
      Array.from({ length: 8 }, (_, index) =>
        createImageCard({
          src: `../assets/images/amygdala/visitor-${String(index + 1).padStart(2, "0")}.jpeg`,
          alt: `Visitor image ${index + 1}`,
          gallery: "amygdala-visitors",
          cardClass: "visitor-card",
          imageClass: "gallery-media-uncropped",
        })
      ).join("")
    );

    const jumpLinks = Array.from(document.querySelectorAll(".section-jump-link"));
    const projectSections = Array.from(document.querySelectorAll(".project-section"));
    const validSectionIds = projectSections.map((section) => section.id);

    const setActiveSection = () => {
      const hashId = window.location.hash.replace("#", "");
      const activeId = validSectionIds.includes(hashId) ? hashId : "thesis";

      projectSections.forEach((section) => {
        section.hidden = section.id !== activeId;
      });

      jumpLinks.forEach((link) => {
        const linkId = link.getAttribute("href")?.replace("#", "");
        link.classList.toggle("is-active", linkId === activeId);
      });
    };

    jumpLinks.forEach((link) => {
      link.addEventListener("click", (event) => {
        event.preventDefault();
        const targetId = link.getAttribute("href")?.replace("#", "") || "thesis";
        window.history.replaceState(null, "", `#${targetId}`);
        setActiveSection();
      });
    });

    window.addEventListener("hashchange", setActiveSection);
    setActiveSection();
  }

  const lightboxTriggers = document.querySelectorAll("[data-lightbox-trigger]");
  if (lightboxTriggers.length) {
    const lightbox = document.createElement("div");
    lightbox.className = "media-lightbox";
    lightbox.setAttribute("aria-hidden", "true");
    lightbox.innerHTML = `
      <div class="media-lightbox-inner">
        <button class="media-lightbox-nav media-lightbox-prev is-hidden" type="button" aria-label="Previous media">&#8249;</button>
        <button class="media-lightbox-nav media-lightbox-next is-hidden" type="button" aria-label="Next media">&#8250;</button>
        <button class="media-lightbox-close" type="button" aria-label="Close media view">x</button>
        <div class="media-lightbox-content"></div>
      </div>
    `;
    document.body.appendChild(lightbox);

    const lightboxContent = lightbox.querySelector(".media-lightbox-content");
    const closeButton = lightbox.querySelector(".media-lightbox-close");
    const prevButton = lightbox.querySelector(".media-lightbox-prev");
    const nextButton = lightbox.querySelector(".media-lightbox-next");
    let activeGallery = [];
    let activeIndex = -1;

    const buildClone = (trigger) => {
      if (trigger.dataset.lightboxIframe) {
        const iframe = document.createElement("iframe");
        iframe.src = trigger.dataset.lightboxIframe;
        iframe.allow = "autoplay; fullscreen; picture-in-picture";
        iframe.allowFullscreen = true;
        iframe.title = "Expanded media view";
        return iframe;
      }

      if (trigger.dataset.lightboxVideo) {
        const video = document.createElement("video");
        video.src = trigger.dataset.lightboxVideo;
        video.controls = true;
        video.autoplay = true;
        video.playsInline = true;
        return video;
      }

      const sourceMedia = trigger.querySelector("img, video");
      if (!sourceMedia) {
        return null;
      }

      if (sourceMedia.tagName.toLowerCase() === "video") {
        const video = document.createElement("video");
        video.src = sourceMedia.currentSrc || sourceMedia.src;
        video.controls = true;
        video.autoplay = true;
        video.playsInline = true;
        return video;
      }

      const image = document.createElement("img");
      image.src = sourceMedia.currentSrc || sourceMedia.src;
      image.alt = sourceMedia.alt || "";
      image.loading = "eager";
      return image;
    };

    const updateNav = () => {
      const hasGallery = activeGallery.length > 1;
      prevButton.classList.toggle("is-hidden", !hasGallery);
      nextButton.classList.toggle("is-hidden", !hasGallery);
    };

    const renderActiveTrigger = () => {
      const trigger = activeGallery[activeIndex];
      if (!trigger) {
        return;
      }
      const clone = buildClone(trigger);
      if (!clone) {
        return;
      }
      lightboxContent.innerHTML = "";
      lightboxContent.appendChild(clone);
      updateNav();
      lightbox.classList.add("is-open");
      lightbox.setAttribute("aria-hidden", "false");
    };

    const closeLightbox = () => {
      lightbox.classList.remove("is-open");
      lightbox.setAttribute("aria-hidden", "true");
      lightboxContent.innerHTML = "";
      activeGallery = [];
      activeIndex = -1;
      updateNav();
    };

    lightboxTriggers.forEach((trigger) => {
      trigger.addEventListener("click", () => {
        if (trigger.dataset.gallery) {
          activeGallery = Array.from(
            document.querySelectorAll(`[data-lightbox-trigger][data-gallery="${trigger.dataset.gallery}"]`)
          );
          activeIndex = activeGallery.indexOf(trigger);
        } else {
          activeGallery = [trigger];
          activeIndex = 0;
        }
        renderActiveTrigger();
      });
    });

    prevButton.addEventListener("click", () => {
      if (!activeGallery.length) {
        return;
      }
      activeIndex = (activeIndex - 1 + activeGallery.length) % activeGallery.length;
      renderActiveTrigger();
    });

    nextButton.addEventListener("click", () => {
      if (!activeGallery.length) {
        return;
      }
      activeIndex = (activeIndex + 1) % activeGallery.length;
      renderActiveTrigger();
    });

    closeButton.addEventListener("click", closeLightbox);
    lightbox.addEventListener("click", (event) => {
      if (event.target === lightbox) {
        closeLightbox();
      }
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && lightbox.classList.contains("is-open")) {
        closeLightbox();
      }
      if (event.key === "ArrowLeft" && lightbox.classList.contains("is-open") && activeGallery.length > 1) {
        activeIndex = (activeIndex - 1 + activeGallery.length) % activeGallery.length;
        renderActiveTrigger();
      }
      if (event.key === "ArrowRight" && lightbox.classList.contains("is-open") && activeGallery.length > 1) {
        activeIndex = (activeIndex + 1) % activeGallery.length;
        renderActiveTrigger();
      }
    });
  }
})();
