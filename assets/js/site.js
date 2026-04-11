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
    "amygdala-body-as-archive-v2": "experimental-design.html",
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
    const typeTester = document.querySelector("[data-type-tester]");
    const typeStage = document.querySelector("[data-type-stage]");
    const typeGlyphOutput = document.querySelector("[data-type-glyph-output]");
    const typeBoard = document.querySelector("[data-type-board]");
    const typeSystem = document.querySelector("[data-type-system]");
    const typeReshuffle = document.querySelector("[data-type-reshuffle]");
    const typeEngine = document.querySelector("[data-type-engine]");
    const typeTracking = document.querySelector("[data-type-tracking]");
    const typeLeading = document.querySelector("[data-type-leading]");
    const typeWeight = document.querySelector("[data-type-weight]");
    const typeAlign = document.querySelector("[data-type-align]");
    const typeCase = document.querySelector("[data-type-case]");
    const typeMode = document.querySelector("[data-type-mode]");
    const typeSkew = document.querySelector("[data-type-skew]");
    const typeMotion = document.querySelector("[data-type-motion]");
    const typeMotionA = document.querySelector("[data-type-motion-a]");
    const typeMotionB = document.querySelector("[data-type-motion-b]");
    const typeMotionC = document.querySelector("[data-type-motion-c]");
    const typeFontUpload = document.querySelector("[data-type-font-upload]");
    const typeFontName = document.querySelector("[data-type-font-name]");
    const glyphDir = typeTester ? typeTester.getAttribute("data-type-glyph-dir") || "" : "";
    const glyphCount = typeTester ? Number(typeTester.getAttribute("data-type-glyph-count") || 0) : 0;
    const glyphUrls = Array.from({ length: glyphCount }, (_, idx) => {
      const number = String(idx + 1).padStart(2, "0");
      return `${glyphDir}/udetype-${number}.png`;
    });
    const builtInFontFamily = '"TypeJuiceCustom", var(--font-display)';

    let uploadedFontUrl = null;
    let motionTimer = null;
    let motionWords = [];
    let motionIndex = 0;
    let customStyleTag = document.querySelector("#type-juice-custom-font");
    if (!customStyleTag) {
      customStyleTag = document.createElement("style");
      customStyleTag.id = "type-juice-custom-font";
      document.head.appendChild(customStyleTag);
    }

    const modeToText = (value, mode) => {
      if (mode === "motion") {
        return value.replace(/\n+/g, " ").replace(/\s+/g, " ").trim();
      }
      if (mode === "ticker") {
        const condensed = value.replace(/\s+/g, " ").trim();
        return condensed ? `${condensed}   ${condensed}` : "";
      }
      if (mode === "stack") {
        const words = value.trim().split(/\s+/).filter(Boolean);
        return words.length ? words.join("\n") : "";
      }
      return value || "";
    };

    const stopMotion = () => {
      if (motionTimer) {
        window.clearInterval(motionTimer);
        motionTimer = null;
      }
    };

    const updateMotionWord = () => {
      if (!typeMotion || !typeMotionA || !typeMotionB || !typeMotionC || !typeStage) {
        return;
      }
      if (!motionWords.length) {
        typeMotionA.textContent = "";
        typeMotionB.textContent = "";
        typeMotionC.textContent = "";
        return;
      }

      const word = motionWords[motionIndex % motionWords.length];
      const before = motionWords[(motionIndex - 1 + motionWords.length) % motionWords.length];
      const after = motionWords[(motionIndex + 1) % motionWords.length];
      const beat = motionIndex % 4;

      typeMotionA.textContent = word;
      typeMotionB.textContent = before;
      typeMotionC.textContent = after;
      typeStage.style.setProperty("--motion-angle", `${beat % 2 === 0 ? -2.2 : 2.2}deg`);
      typeStage.style.setProperty("--motion-scale", beat === 0 ? "1.06" : beat === 2 ? "0.98" : "1.02");

      typeMotion.classList.remove("is-beat");
      // Trigger the pulse animation each time the word shifts.
      void typeMotion.offsetWidth;
      typeMotion.classList.add("is-beat");
      motionIndex += 1;
    };

    const startMotion = (value) => {
      if (!typeMotion) {
        return;
      }
      const words = value.split(/\s+/).filter(Boolean).slice(0, 40);
      motionWords = words.length ? words : ["TYPE", "JUICE"];
      motionIndex = 0;
      updateMotionWord();
      stopMotion();
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        return;
      }
      motionTimer = window.setInterval(updateMotionWord, 360);
    };

    const glyphIndexForChar = (char) => {
      if (!glyphCount) {
        return 0;
      }
      const codePoint = char.codePointAt(0) || 0;
      return Math.abs((codePoint * 17 + 13) % glyphCount);
    };

    const renderGlyphOutput = (value, mode, selectedAlign, size, tracking, leading, skew) => {
      if (!typeGlyphOutput) {
        return;
      }
      typeGlyphOutput.innerHTML = "";
      typeGlyphOutput.classList.toggle("mode-ticker", mode === "ticker");
      typeGlyphOutput.style.justifyContent =
        selectedAlign === "left" ? "flex-start" : selectedAlign === "right" ? "flex-end" : "center";
      typeGlyphOutput.style.setProperty("--type-skew", `${skew}deg`);

      const glyphLines = value ? value.split("\n") : [];
      if (!glyphLines.length) {
        return;
      }

      const glyphSize = Math.max(24, Math.round(size * 0.58));
      const gap = Math.round((tracking + 40) / 8);
      const lineGap = Math.max(8, Math.round((leading / 100) * 14));

      glyphLines.forEach((line) => {
        const row = document.createElement("div");
        row.className = "type-juice-glyph-row";
        row.style.gap = `${Math.max(2, gap)}px`;
        row.style.marginBottom = `${lineGap}px`;

        const characters = Array.from(line);
        if (!characters.length) {
          const spacer = document.createElement("span");
          spacer.className = "type-juice-glyph-space";
          spacer.style.width = `${Math.round(glyphSize * 0.8)}px`;
          spacer.style.height = `${glyphSize}px`;
          row.appendChild(spacer);
        } else {
          characters.forEach((char) => {
            if (char === " ") {
              const spacer = document.createElement("span");
              spacer.className = "type-juice-glyph-space";
              spacer.style.width = `${Math.round(glyphSize * 0.45)}px`;
              spacer.style.height = `${glyphSize}px`;
              row.appendChild(spacer);
              return;
            }

            const index = glyphIndexForChar(char);
            const glyph = document.createElement("img");
            glyph.className = "type-juice-glyph";
            glyph.width = glyphSize;
            glyph.height = glyphSize;
            glyph.loading = "lazy";
            glyph.decoding = "async";
            glyph.alt = "";
            glyph.src = glyphUrls[index] || glyphUrls[0] || "";
            row.appendChild(glyph);
          });
        }

        typeGlyphOutput.appendChild(row);
      });
    };

    const buildTypeBoard = (rawText, size) => {
      if (!typeBoard) {
        return;
      }
      const cleaned = (rawText || "").replace(/\s+/g, "");
      const chars = Array.from(cleaned).slice(0, 120);
      typeBoard.innerHTML = "";
      if (!chars.length) {
        return;
      }

      const rect = typeBoard.getBoundingClientRect();
      const baseSize = Math.max(34, Math.min(180, Math.round(size * 0.46)));

      chars.forEach((char, idx) => {
        const glyph = document.createElement("img");
        glyph.className = "type-juice-board-glyph";
        glyph.src = glyphUrls[glyphIndexForChar(char)] || glyphUrls[0] || "";
        glyph.alt = "";
        glyph.loading = "lazy";
        glyph.decoding = "async";

        const variance = ((idx * 37) % 24) - 12;
        const glyphSize = Math.max(28, baseSize + variance);
        const maxX = Math.max(0, rect.width - glyphSize);
        const maxY = Math.max(0, rect.height - glyphSize);
        const x = Math.round((idx * 53) % (maxX + 1 || 1));
        const y = Math.round((idx * 97) % (maxY + 1 || 1));

        glyph.style.width = `${glyphSize}px`;
        glyph.style.height = `${glyphSize}px`;
        glyph.style.left = `${x}px`;
        glyph.style.top = `${y}px`;
        glyph.dataset.x = String(x);
        glyph.dataset.y = String(y);
        glyph.dataset.dragId = `glyph-${idx}`;
        glyph.style.transform = `rotate(${((idx * 19) % 44) - 22}deg)`;

        typeBoard.appendChild(glyph);
      });
    };

    let dragTarget = null;
    let dragOffsetX = 0;
    let dragOffsetY = 0;
    if (typeBoard) {
      typeBoard.addEventListener("pointerdown", (event) => {
        const target = event.target;
        if (!(target instanceof HTMLElement) || !target.classList.contains("type-juice-board-glyph")) {
          return;
        }
        dragTarget = target;
        dragTarget.classList.add("is-dragging");
        const rect = dragTarget.getBoundingClientRect();
        dragOffsetX = event.clientX - rect.left;
        dragOffsetY = event.clientY - rect.top;
        dragTarget.setPointerCapture(event.pointerId);
      });

      typeBoard.addEventListener("pointermove", (event) => {
        if (!dragTarget) {
          return;
        }
        const boardRect = typeBoard.getBoundingClientRect();
        const glyphWidth = dragTarget.offsetWidth;
        const glyphHeight = dragTarget.offsetHeight;
        const maxX = Math.max(0, boardRect.width - glyphWidth);
        const maxY = Math.max(0, boardRect.height - glyphHeight);
        const nextX = Math.max(0, Math.min(maxX, event.clientX - boardRect.left - dragOffsetX));
        const nextY = Math.max(0, Math.min(maxY, event.clientY - boardRect.top - dragOffsetY));
        dragTarget.style.left = `${Math.round(nextX)}px`;
        dragTarget.style.top = `${Math.round(nextY)}px`;
      });

      const stopDragging = (event) => {
        if (!dragTarget) {
          return;
        }
        dragTarget.classList.remove("is-dragging");
        if (event && dragTarget.hasPointerCapture(event.pointerId)) {
          dragTarget.releasePointerCapture(event.pointerId);
        }
        dragTarget = null;
      };

      typeBoard.addEventListener("pointerup", stopDragging);
      typeBoard.addEventListener("pointercancel", stopDragging);
      typeBoard.addEventListener("pointerleave", stopDragging);
    }

    const updateTypeOutput = () => {
      const mode = typeMode ? typeMode.value : "poster";
      const systemMode = typeSystem ? typeSystem.value : "typeset";
      const selectedCase = typeCase ? typeCase.value : "as-typed";
      const selectedEngine = typeEngine ? typeEngine.value : "glyph";
      let text = typeInput.value || "";

      if (selectedCase === "uppercase") {
        text = text.toUpperCase();
      } else if (selectedCase === "lowercase") {
        text = text.toLowerCase();
      }

      typeOutput.textContent = modeToText(text, mode);
      typeOutput.classList.toggle("mode-stack", mode === "stack");
      typeOutput.classList.toggle("mode-ticker", mode === "ticker");

      if (typeScale) {
        typeOutput.style.fontSize = `${typeScale.value}px`;
      }
      if (typeTracking) {
        typeOutput.style.letterSpacing = `${Number(typeTracking.value) / 100}em`;
      }
      if (typeLeading) {
        typeOutput.style.lineHeight = `${Number(typeLeading.value) / 100}`;
      }
      if (typeWeight) {
        typeOutput.style.fontWeight = typeWeight.value;
      }
      if (typeAlign) {
        typeOutput.style.textAlign = typeAlign.value;
      }
      if (typeSkew) {
        typeOutput.style.setProperty("--type-skew", `${typeSkew.value}deg`);
      }

      const motionMode = mode === "motion";
      if (typeStage) {
        typeStage.classList.toggle("is-motion", motionMode);
      }
      if (typeMotion) {
        typeMotion.style.display = motionMode ? "grid" : "none";
      }

      if (motionMode) {
        if (typeBoard) {
          typeBoard.classList.remove("is-active");
        }
        if (typeReshuffle) {
          typeReshuffle.disabled = true;
        }
        typeOutput.style.display = "none";
        if (typeGlyphOutput) {
          typeGlyphOutput.style.display = "none";
        }
        startMotion(modeToText(text, "motion"));
        if (typeStage) {
          typeStage.classList.remove("is-inverted");
        }
        return;
      }

      stopMotion();

      if (selectedEngine === "glyph") {
        if (typeBoard) {
          typeBoard.classList.toggle("is-active", systemMode === "board");
        }
        if (typeReshuffle) {
          typeReshuffle.disabled = systemMode !== "board";
        }

        if (systemMode === "board") {
          typeOutput.style.display = "none";
          if (typeGlyphOutput) {
            typeGlyphOutput.style.display = "none";
          }
          buildTypeBoard(text, Number(typeScale ? typeScale.value : 140));
          return;
        }

        typeOutput.style.display = "none";
        if (typeGlyphOutput) {
          typeGlyphOutput.style.display = "grid";
        }
        renderGlyphOutput(
          modeToText(text, mode),
          mode,
          typeAlign ? typeAlign.value : "left",
          Number(typeScale ? typeScale.value : 140),
          Number(typeTracking ? typeTracking.value : -10),
          Number(typeLeading ? typeLeading.value : 90),
          Number(typeSkew ? typeSkew.value : 0)
        );
      } else {
        if (typeBoard) {
          typeBoard.classList.remove("is-active");
        }
        if (typeReshuffle) {
          typeReshuffle.disabled = true;
        }
        typeOutput.style.fontFamily = builtInFontFamily;
        typeOutput.style.display = "grid";
        if (typeGlyphOutput) {
          typeGlyphOutput.style.display = "none";
        }
      }

      if (typeStage) {
        typeStage.classList.toggle("is-inverted", mode === "ticker");
      }
    };

    if (typeFontUpload && typeFontName) {
      typeFontUpload.addEventListener("change", () => {
        const file = typeFontUpload.files && typeFontUpload.files[0];
        if (!file) {
          return;
        }
        if (uploadedFontUrl) {
          URL.revokeObjectURL(uploadedFontUrl);
        }
        uploadedFontUrl = URL.createObjectURL(file);
        customStyleTag.textContent = `
          @font-face {
            font-family: "TypeJuiceCustom";
            src: url("${uploadedFontUrl}");
            font-display: swap;
          }
        `;
        typeOutput.style.fontFamily = '"TypeJuiceCustom", var(--font-display)';
        typeFontName.textContent = `Loaded: ${file.name}`;
        updateTypeOutput();
      });
    }

    if (typeFontName) {
      typeFontName.textContent = "Using glyph-grid font system (built from your image)";
    }
    typeOutput.style.fontFamily = builtInFontFamily;

    const reactiveFields = [
      typeInput,
      typeScale,
      typeTracking,
      typeLeading,
      typeWeight,
      typeAlign,
      typeCase,
      typeMode,
      typeSystem,
      typeEngine,
      typeSkew,
    ];

    reactiveFields.forEach((field) => {
      if (field) {
        field.addEventListener("input", updateTypeOutput);
        field.addEventListener("change", updateTypeOutput);
      }
    });

    if (!typeTester) {
      typeInput.addEventListener("input", updateTypeOutput);
      if (typeScale) {
        typeScale.addEventListener("input", updateTypeOutput);
      }
    }

    if (typeReshuffle) {
      typeReshuffle.addEventListener("click", () => {
        buildTypeBoard(typeInput ? typeInput.value : "", Number(typeScale ? typeScale.value : 140));
      });
    }

    updateTypeOutput();
  }

  if (pageKey === "exhibition") {
    const projectButtons = Array.from(document.querySelectorAll("[data-exhibition-target]"));
    const projectSections = Array.from(document.querySelectorAll("[data-exhibition-project]"));
    if (projectButtons.length && projectSections.length) {
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

    const geojeButtons = Array.from(document.querySelectorAll("[data-geoje-target]"));
    const geojeSections = Array.from(document.querySelectorAll("[data-geoje-section]"));
    if (geojeButtons.length && geojeSections.length) {
      const validGeojeIds = geojeSections.map((section) => section.id);

      const setActiveGeoje = (nextId) => {
        const activeId = validGeojeIds.includes(nextId) ? nextId : "geoje-seomkot";
        geojeSections.forEach((section) => {
          section.hidden = section.id !== activeId;
        });
        geojeButtons.forEach((button) => {
          button.classList.toggle("is-active", button.dataset.geojeTarget === activeId);
        });
      };

      geojeButtons.forEach((button) => {
        button.addEventListener("click", () => {
          setActiveGeoje(button.dataset.geojeTarget || "geoje-seomkot");
        });
      });

      setActiveGeoje("geoje-seomkot");
    }
  }

  if (pageKey === "amygdala-body-as-archive" || pageKey === "amygdala-body-as-archive-v2") {
    const createImageCard = (item) => `
      <article class="media-card${item.cardClass ? ` ${item.cardClass}` : ""}">
        ${item.title ? `<h3 class="media-card-title">${item.title}</h3>` : ""}
        <button class="media-trigger" type="button" data-lightbox-trigger data-gallery="${item.gallery}" aria-label="Open ${item.alt}">
          <img class="gallery-media${item.landscape ? " gallery-media-landscape" : ""}${item.imageClass ? ` ${item.imageClass}` : ""}" src="${item.src}" alt="${item.alt}" loading="lazy" />
        </button>
      </article>
    `;

    const createVideoCard = (item) => `
      <article class="video-card${item.cardClass ? ` ${item.cardClass}` : ""}">
        ${item.title ? `<h3 class="video-card-title">${item.title}</h3>` : ""}
        <video
          class="video-frame-local${item.frameClass ? ` ${item.frameClass}` : ""}"
          src="${item.src}"
          ${item.controls === false ? "" : "controls"}
          playsinline
          preload="metadata"
          ${item.autoplayMuted ? "autoplay loop muted" : ""}
          ${item.allowUnmute ? "data-click-unmute" : ""}
          ${typeof item.endAtSeconds === "number" ? `data-end-at="${item.endAtSeconds}"` : ""}
        ></video>
        ${item.hideOpenButton ? "" : `<div class="embed-actions">
          <button class="wide-button" type="button" data-lightbox-trigger data-lightbox-video="${item.src}" data-gallery="${item.gallery}">
            Open wide
          </button>
        </div>`}
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
          title: "Amygdala - In Motion Storyboard",
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
      "#amygdala-directors-cut-videos",
      [
        createVideoCard({
          title: "Amygdala - High Road",
          src: "../assets/videos/amygdala/directors-cut-01-high-road.mp4",
          gallery: "amygdala-directors-cut-videos",
          autoplayMuted: true,
          allowUnmute: true,
        }),
        createVideoCard({
          title: "Amygdala - Type in motion",
          src: "../assets/videos/amygdala/amygdala-typeinmotion.mov",
          gallery: "amygdala-directors-cut-videos",
          autoplayMuted: true,
          allowUnmute: true,
        }),
        createVideoCard({
          title: "Sehnsucht",
          src: "../assets/videos/amygdala/directors-cut-03-sehnsucht.mp4",
          gallery: "amygdala-directors-cut-videos",
          autoplayMuted: true,
          allowUnmute: true,
          cardClass: "director-center-card",
          frameClass: "director-white-frame",
        }),
        createVideoCard({
          title: "Amygdala - End credits",
          src: "../assets/videos/amygdala/directors-cut-04-whatsapp-2026-04-05.mp4",
          gallery: "amygdala-directors-cut-videos",
          autoplayMuted: true,
          allowUnmute: true,
          endAtSeconds: 36,
        }),
      ].join("")
    );

    renderInto(
      "#amygdala-cansu-grid",
      Array.from({ length: 12 }, (_, index) =>
        createImageCard({
          src: `../assets/images/amygdala/cansu-${String(index + 1).padStart(2, "0")}.jpeg`,
          alt: `Veritas Corpus image ${index + 1}`,
          gallery: "amygdala-cansu",
        })
      ).join("")
    );

    renderInto(
      "#amygdala-process-extra-videos",
      [
        createVideoCard({
          title: "Suchen",
          src: "../assets/videos/amygdala/directors-cut-04-end-credits.mp4",
          gallery: "amygdala-process-extra-videos",
          autoplayMuted: true,
          controls: false,
          hideOpenButton: true,
          cardClass: "process-top-card",
        }),
        createVideoCard({
          title: "Die Gefuehle im Raum",
          src: "../assets/videos/amygdala/process-extra-03-die-gefuehle-im-raum.mp4",
          gallery: "amygdala-process-extra-videos",
          autoplayMuted: true,
          controls: false,
          hideOpenButton: true,
          cardClass: "process-top-card",
        }),
        createVideoCard({
          title: "Sehnsucht",
          src: "../assets/videos/amygdala/process-extra-02-sehnsucht.mp4",
          gallery: "amygdala-process-extra-videos",
          autoplayMuted: true,
          allowUnmute: true,
          cardClass: "process-bottom-card",
        }),
        createVideoCard({
          title: "Zwei Gesichter",
          src: "../assets/videos/amygdala/process-extra-01-zwei-gesichter.mp4",
          gallery: "amygdala-process-extra-videos",
          autoplayMuted: true,
          allowUnmute: true,
          cardClass: "process-bottom-card",
        }),
        createVideoCard({
          title: "Das Innere",
          src: "../assets/videos/amygdala/process-extra-04-das-innere.mov",
          gallery: "amygdala-process-extra-videos",
          autoplayMuted: true,
          allowUnmute: true,
          cardClass: "process-bottom-card",
        }),
      ].join("")
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
          src: "../assets/images/amygdala/installation-06-a-installation-002.jpeg",
          alt: "Amygdala installation image 1",
          gallery: "amygdala-installation",
          imageClass: "gallery-media-uncropped",
        },
        {
          src: "../assets/images/amygdala/installation-04-replacement.jpeg",
          alt: "Amygdala installation image 2",
          gallery: "amygdala-installation",
          imageClass: "gallery-media-uncropped",
        },
        {
          src: "../assets/images/amygdala/installation-02-replacement.jpeg",
          alt: "Amygdala installation image 3",
          gallery: "amygdala-installation",
          imageClass: "gallery-media-uncropped",
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
          autoplayMuted: true,
        }),
        createVideoCard({
          src: "../assets/videos/amygdala/amygdala-in-type.mp4",
          gallery: "amygdala-installation-videos",
          autoplayMuted: true,
        }),
        createVideoCard({
          src: "../assets/videos/amygdala/installation-04.mp4",
          gallery: "amygdala-installation-videos",
          autoplayMuted: true,
        }),
      ].join("")
    );

    const bodyMotionVideos = [
      { title: "Der Zwang", src: "../assets/videos/amygdala/body-in-motion/01-der-zwang.mp4" },
      { title: "Emotionen im Sein", src: "../assets/videos/amygdala/body-in-motion/02-emotionen-im-sein-18.mp4" },
      { title: "Es kommt wieder", src: "../assets/videos/amygdala/body-in-motion/03-es-kommt-wieder.mp4" },
      { title: "Friedensuchend", src: "../assets/videos/amygdala/body-in-motion/04-friedensuchend.mp4" },
      { title: "Greifbar", src: "../assets/videos/amygdala/body-in-motion/05-greifbar.mp4" },
      { title: "Nicht sein", src: "../assets/videos/amygdala/body-in-motion/06-nicht-sein.mp4" },
      { title: "Nichtsein", src: "../assets/videos/amygdala/body-in-motion/07-nichtsein.mp4" },
      { title: "Stehen nicht stehen", src: "../assets/videos/amygdala/body-in-motion/08-stehen-nicht-stehen.mp4" },
      { title: "Suchen nach der Wahrheit", src: "../assets/videos/amygdala/body-in-motion/09-suchen-nach-der-wahrheit.mp4" },
      { title: "Tic", src: "../assets/videos/amygdala/body-in-motion/10-tic.mp4" },
      { title: "Tourette", src: "../assets/videos/amygdala/body-in-motion/11-tourette.mp4" },
      { title: "Trance", src: "../assets/videos/amygdala/body-in-motion/12-trance.mp4" },
      { title: "Iterare", src: "../assets/videos/amygdala/body-in-motion/13-whatsapp-video.mp4" },
      { title: "Wo der Frieden lebt", src: "../assets/videos/amygdala/body-in-motion/14-wo-der-frieden-lebt.mp4" },
      { title: "zwangzwangzwang", src: "../assets/videos/amygdala/body-in-motion/15-zwangzwangzwang.mp4" },
      { title: "die seele", src: "../assets/videos/amygdala/body-in-motion/16-die-seele.mp4" },
      { title: "Die Wahrheit finden", src: "../assets/videos/amygdala/body-in-motion/17-die-wahrheit-finden.mp4" },
      { title: "Da ist es", src: "../assets/videos/amygdala/body-in-motion/18-da-ist-es.mp4" },
      { title: "das was in mir lebt", src: "../assets/videos/amygdala/body-in-motion/19-das-was-in-mir-lebt.mp4" },
      { title: "der Koerper", src: "../assets/videos/amygdala/body-in-motion/20-der-koerper.mp4" },
      { title: "Leid", src: "../assets/videos/amygdala/body-in-motion/21-leid.mp4" },
      {
        title: "Dort wo die Gedanken leben",
        src: "../assets/videos/amygdala/body-in-motion/22-dort-wo-die-gedanken-leben.mp4",
        cardClass: "body-motion-fullwidth",
        frameClass: "video-frame-large",
      },
      {
        title: "Dort wo die Gedanken ueberleben",
        src: "../assets/videos/amygdala/body-in-motion/23-dort-wo-die-gedanken-ueberleben.mp4",
        cardClass: "body-motion-fullwidth",
        frameClass: "video-frame-large",
      },
    ];

    renderInto(
      "#amygdala-body-motion-videos",
      bodyMotionVideos
        .map((item) =>
          createVideoCard({
            ...item,
            gallery: "amygdala-body-motion-videos",
            autoplayMuted: true,
          })
        )
        .join("")
    );

    renderInto(
      "#amygdala-visitor-grid",
      [
        "../assets/images/amygdala/visitor-01.jpeg",
        "../assets/images/amygdala/visitor-02.jpeg",
        "../assets/images/amygdala/visitor-03.jpeg",
        "../assets/images/amygdala/visitor-04.jpeg",
        "../assets/images/amygdala/visitor-05.jpeg",
        "../assets/images/amygdala/visitor-06.jpeg",
        "../assets/images/amygdala/visitor-07.jpeg",
        "../assets/images/amygdala/visitor-08.jpeg",
        "../assets/images/amygdala/visitor-13-friends.jpeg",
        "../assets/images/amygdala/visitor-09-zwei-profs.jpeg",
        "../assets/images/amygdala/visitor-10-daniela-001.jpeg",
        "../assets/images/amygdala/visitor-12-rena-and-mey.jpeg",
        "../assets/images/amygdala/visitor-11-daniela-002.jpeg",
      ]
        .map((src, index) =>
          createImageCard({
            src,
            alt: `Visitor image ${index + 1}`,
            gallery: "amygdala-visitors",
            cardClass: "visitor-card",
            imageClass: "gallery-media-uncropped",
          })
        )
        .join("")
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

    document.querySelectorAll("video[data-click-unmute]").forEach((video) => {
      const enableSoundOnClick = () => {
        if (video.muted) {
          video.muted = false;
          video.volume = 1;
        }
      };

      video.addEventListener("click", enableSoundOnClick);
      video.addEventListener("play", () => {
        if (video.muted) {
          video.play().catch(() => {});
        }
      });
    });

    document.querySelectorAll("video[data-end-at]").forEach((video) => {
      const endAt = Number(video.dataset.endAt);
      if (!Number.isFinite(endAt) || endAt <= 0) {
        return;
      }

      video.addEventListener("timeupdate", () => {
        if (video.currentTime >= endAt) {
          video.pause();
          video.currentTime = endAt;
        }
      });
    });
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
