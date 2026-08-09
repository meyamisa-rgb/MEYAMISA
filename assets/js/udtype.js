(() => {
  const xPositions = [10, 20, 30, 39, 48, 57, 66, 75, 86];
  const yPositions = [5, 20, 35];

  const glyphPosition = (character) => {
    const code = character.charCodeAt(0) - 65;

    if (code < 0 || code > 25) {
      return null;
    }

    const row = code < 9 ? 0 : code < 18 ? 1 : 2;
    const column = row === 0 ? code : row === 1 ? code - 9 : code - 18;

    return {
      x: xPositions[column],
      y: yPositions[row],
    };
  };

  const makeGlyph = (character) => {
    const glyph = document.createElement("span");
    glyph.className = "udtype-audax-glyph";
    glyph.setAttribute("aria-hidden", "true");

    if (character === "\n") {
      glyph.classList.add("is-break");
      return glyph;
    }

    const position = glyphPosition(character);

    if (!position) {
      glyph.classList.add("is-space");
      return glyph;
    }

    glyph.style.setProperty("--udtype-x", `${position.x}%`);
    glyph.style.setProperty("--udtype-y", `${position.y}%`);
    return glyph;
  };

  document.querySelectorAll("[data-udtype-marquee]").forEach((track) => {
    const sequence = track.dataset.udtypeMarquee.toUpperCase();

    for (let copy = 0; copy < 2; copy += 1) {
      const loop = document.createElement("span");
      loop.className = "udtype-audax-loop";

      Array.from(sequence).forEach((character) => {
        loop.append(makeGlyph(character));
      });

      track.append(loop);
    }
  });

  const input = document.querySelector("[data-udtype-input]");
  const output = document.querySelector("[data-udtype-output]");
  const sizeControl = document.querySelector("[data-udtype-size]");
  const sizeOutput = document.querySelector("[data-udtype-size-output]");

  if (!input || !output) {
    return;
  }

  const renderTester = () => {
    const text = input.value.toUpperCase();
    const fragment = document.createDocumentFragment();

    Array.from(text).forEach((character) => {
      fragment.append(makeGlyph(character));
    });

    output.replaceChildren(fragment);
    output.setAttribute("aria-label", text.trim() || "Empty Audax specimen");
  };

  const updateSize = () => {
    if (!sizeControl) {
      return;
    }

    const size = `${sizeControl.value}px`;
    output.style.setProperty("--udtype-tester-size", size);

    if (sizeOutput) {
      sizeOutput.value = size;
      sizeOutput.textContent = size;
    }
  };

  input.addEventListener("input", renderTester);
  sizeControl?.addEventListener("input", updateSize);

  renderTester();
  updateSize();
})();
