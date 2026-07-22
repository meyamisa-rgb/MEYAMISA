(() => {
  const output = document.querySelector('[data-writing-poem-output]');
  const accessible = document.querySelector('[data-writing-poem-accessible]');
  const count = document.querySelector('[data-writing-poem-count]');
  const source = document.querySelector('[data-writing-poems]');

  if (!output || !accessible || !count || !source) return;

  let poems;
  try {
    poems = JSON.parse(source.textContent);
  } catch (error) {
    return;
  }

  if (!Array.isArray(poems) || !poems.length) return;

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let poemIndex = 0;
  let characterIndex = 0;

  const updateCount = () => {
    count.textContent = `${String(poemIndex + 1).padStart(2, '0')} / ${String(poems.length).padStart(2, '0')}`;
  };

  const delayFor = (character) => {
    if (/[.!?]/.test(character)) return 270;
    if (/[,—:;]/.test(character)) return 175;
    return 56;
  };

  const showNextPoem = () => {
    output.classList.add('is-changing');

    window.setTimeout(() => {
      poemIndex = (poemIndex + 1) % poems.length;
      characterIndex = 0;
      output.textContent = '';
      output.classList.remove('is-complete', 'is-changing');
      updateCount();
      typeNextCharacter();
    }, 700);
  };

  const typeNextCharacter = () => {
    const poem = poems[poemIndex];

    if (characterIndex >= poem.length) {
      output.classList.add('is-complete');
      accessible.textContent = poem;
      window.setTimeout(showNextPoem, 3800);
      return;
    }

    const character = poem[characterIndex];
    characterIndex += 1;
    output.textContent = poem.slice(0, characterIndex);
    window.setTimeout(typeNextCharacter, delayFor(character));
  };

  updateCount();

  if (reduceMotion) {
    output.textContent = poems[0];
    accessible.textContent = poems[0];
    output.classList.add('is-complete');
  } else {
    output.textContent = '';
    window.setTimeout(typeNextCharacter, 650);
  }

  const storageKey = 'meyamisa.words-in-ink.v1';
  const entries = document.querySelectorAll('[data-poetry-entry]');
  let savedState = { likes: {}, comments: {} };

  try {
    const storedState = window.localStorage.getItem(storageKey);
    if (storedState) savedState = JSON.parse(storedState);
  } catch (error) {
    savedState = { likes: {}, comments: {} };
  }

  if (!savedState || typeof savedState !== 'object' || Array.isArray(savedState)) {
    savedState = { likes: {}, comments: {} };
  }
  if (!savedState.likes || typeof savedState.likes !== 'object') savedState.likes = {};
  if (!savedState.comments || typeof savedState.comments !== 'object') savedState.comments = {};

  const saveState = () => {
    try {
      window.localStorage.setItem(storageKey, JSON.stringify(savedState));
    } catch (error) {
      // The interactions still work for this visit when storage is unavailable.
    }
  };

  const renderComments = (entry, comments) => {
    const list = entry.querySelector('[data-comment-list]');
    const count = entry.querySelector('[data-comment-count]');

    if (!list || !count) return;

    list.textContent = '';
    comments.forEach((comment) => {
      const paragraph = document.createElement('p');
      paragraph.className = 'words-in-ink-comment';
      paragraph.textContent = comment;
      list.appendChild(paragraph);
    });
    count.textContent = String(comments.length);
  };

  entries.forEach((entry) => {
    const entryId = entry.dataset.poetryEntry;
    const likeButton = entry.querySelector('[data-poetry-like]');
    const likeCount = entry.querySelector('[data-poetry-like-count]');
    const heart = entry.querySelector('[data-poetry-heart]');
    const commentToggle = entry.querySelector('[data-comment-toggle]');
    const commentPanel = entry.querySelector('[data-comment-panel]');
    const commentForm = entry.querySelector('[data-comment-form]');
    const status = entry.querySelector('[data-comment-status]');
    const comments = Array.isArray(savedState.comments[entryId]) ? savedState.comments[entryId] : [];

    savedState.comments[entryId] = comments;

    const renderLike = () => {
      const isLiked = Boolean(savedState.likes[entryId]);
      likeButton.setAttribute('aria-pressed', String(isLiked));
      likeCount.textContent = isLiked ? '1' : '0';
      heart.textContent = isLiked ? '♥' : '♡';
    };

    renderLike();
    renderComments(entry, comments);

    likeButton.addEventListener('click', () => {
      savedState.likes[entryId] = !savedState.likes[entryId];
      renderLike();
      saveState();
    });

    commentToggle.addEventListener('click', () => {
      const willOpen = commentPanel.hidden;
      commentPanel.hidden = !willOpen;
      commentToggle.setAttribute('aria-expanded', String(willOpen));
      if (willOpen) commentForm.elements.comment.focus();
    });

    commentForm.addEventListener('submit', (event) => {
      event.preventDefault();
      const comment = commentForm.elements.comment.value.trim();

      if (!comment) {
        status.textContent = 'Please write a comment first.';
        return;
      }

      comments.push(comment);
      commentForm.reset();
      status.textContent = 'Your comment has been saved.';
      renderComments(entry, comments);
      saveState();
    });
  });
})();
