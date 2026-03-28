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

  const lightboxTriggers = document.querySelectorAll("[data-lightbox-trigger]");
  if (lightboxTriggers.length) {
    const lightbox = document.createElement("div");
    lightbox.className = "media-lightbox";
    lightbox.setAttribute("aria-hidden", "true");
    lightbox.innerHTML = `
      <div class="media-lightbox-inner">
        <button class="media-lightbox-close" type="button" aria-label="Close media view">x</button>
        <div class="media-lightbox-content"></div>
      </div>
    `;
    document.body.appendChild(lightbox);

    const lightboxContent = lightbox.querySelector(".media-lightbox-content");
    const closeButton = lightbox.querySelector(".media-lightbox-close");

    const closeLightbox = () => {
      lightbox.classList.remove("is-open");
      lightbox.setAttribute("aria-hidden", "true");
      lightboxContent.innerHTML = "";
    };

    lightboxTriggers.forEach((trigger) => {
      trigger.addEventListener("click", () => {
        const sourceMedia = trigger.querySelector("img, video");
        if (!sourceMedia) {
          return;
        }

        let clone;
        if (sourceMedia.tagName.toLowerCase() === "video") {
          clone = document.createElement("video");
          clone.src = sourceMedia.currentSrc || sourceMedia.src;
          clone.controls = true;
          clone.autoplay = true;
          clone.playsInline = true;
        } else {
          clone = document.createElement("img");
          clone.src = sourceMedia.currentSrc || sourceMedia.src;
          clone.alt = sourceMedia.alt || "";
          clone.loading = "eager";
        }

        lightboxContent.innerHTML = "";
        lightboxContent.appendChild(clone);
        lightbox.classList.add("is-open");
        lightbox.setAttribute("aria-hidden", "false");
      });
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
    });
  }
})();
