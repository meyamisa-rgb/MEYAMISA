(function () {
  const viewer = document.querySelector('[data-project-viewer]');
  const viewerImage = document.querySelector('[data-viewer-image]');
  const viewerVideo = document.querySelector('[data-viewer-video]');
  const viewerTitle = document.querySelector('[data-viewer-title]');
  const viewerMeta = document.querySelector('[data-viewer-meta]');
  const viewerDescription = document.querySelector('[data-viewer-description]');
  const viewerStrip = document.querySelector('[data-viewer-strip]');
  const viewerPrev = document.querySelector('[data-viewer-prev]');
  const viewerNext = document.querySelector('[data-viewer-next]');
  let activeMedia = [];
  let activeIndex = 0;

  const renderMedia = () => {
    const item = activeMedia[activeIndex];
    if (!item || !viewerImage || !viewerVideo) return;

    if (item.type === 'video') {
      viewerImage.hidden = true;
      viewerVideo.hidden = false;
      viewerVideo.src = item.src;
      viewerVideo.load();
      viewerVideo.play().catch(() => {});
    } else {
      viewerVideo.pause();
      viewerVideo.hidden = true;
      viewerVideo.removeAttribute('src');
      viewerVideo.load();
      viewerImage.hidden = false;
      viewerImage.src = item.src;
      viewerImage.alt = item.label || 'Project media';
    }

    if (viewerStrip) {
      viewerStrip.querySelectorAll('.viewer-thumb').forEach((thumb, index) => {
        thumb.classList.toggle('is-active', index === activeIndex);
      });
    }
  };

  const renderStrip = () => {
    if (!viewerStrip) return;
    viewerStrip.textContent = '';

    activeMedia.forEach((item, index) => {
      const thumb = document.createElement('button');
      thumb.type = 'button';
      thumb.className = 'viewer-thumb';

      if (item.type === 'video') {
        thumb.textContent = 'Video';
      } else {
        const img = document.createElement('img');
        img.src = item.src;
        img.alt = item.label || 'Project thumbnail';
        thumb.appendChild(img);
      }

      thumb.addEventListener('click', () => {
        activeIndex = index;
        renderMedia();
      });

      viewerStrip.appendChild(thumb);
    });
  };

  const closeViewer = () => {
    if (!viewer) return;
    if (viewerVideo) {
      viewerVideo.pause();
      viewerVideo.removeAttribute('src');
      viewerVideo.load();
    }
    viewer.hidden = true;
    viewer.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  };

  const stepMedia = (direction) => {
    if (!activeMedia.length) return;
    activeIndex = (activeIndex + direction + activeMedia.length) % activeMedia.length;
    renderMedia();
  };

  document.querySelectorAll('[data-project-card]').forEach((card) => {
    card.addEventListener('click', () => {
      const title = card.getAttribute('data-title') || 'Project';
      const meta = card.getAttribute('data-meta') || '';
      const description = card.getAttribute('data-description') || '';
      const images = (card.getAttribute('data-images') || '')
        .split('|')
        .map((src) => src.trim())
        .filter(Boolean)
        .map((src) => ({ type: 'image', src, label: title }));
      const videos = (card.getAttribute('data-videos') || '')
        .split('|')
        .map((src) => src.trim())
        .filter(Boolean)
        .map((src) => ({ type: 'video', src, label: title }));

      activeMedia = [...images, ...videos];
      activeIndex = 0;
      if (viewerTitle) viewerTitle.textContent = title;
      if (viewerMeta) viewerMeta.textContent = meta;
      if (viewerDescription) viewerDescription.textContent = description;
      renderStrip();
      renderMedia();
      if (viewer) {
        viewer.hidden = false;
        viewer.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
      }
    });
  });

  document.querySelectorAll('[data-viewer-close]').forEach((node) => {
    node.addEventListener('click', closeViewer);
  });
  if (viewerPrev) viewerPrev.addEventListener('click', () => stepMedia(-1));
  if (viewerNext) viewerNext.addEventListener('click', () => stepMedia(1));

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') closeViewer();
    if (viewer && !viewer.hidden && event.key === 'ArrowLeft') stepMedia(-1);
    if (viewer && !viewer.hidden && event.key === 'ArrowRight') stepMedia(1);
  });
})();
