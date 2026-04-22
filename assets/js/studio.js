(function () {
  const pathParts = window.location.pathname.split('/');
  const currentPage = pathParts[pathParts.length - 1] || 'index.html';

  document.querySelectorAll('[data-page-link]').forEach((link) => {
    const href = link.getAttribute('href');
    if (href === null || href === '') return;
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('is-active');
    }
  });

  const navToggle = document.querySelector('[data-nav-toggle]');
  const siteHeader = document.querySelector('.site-header');
  if (navToggle && siteHeader) {
    navToggle.addEventListener('click', () => {
      const isOpen = siteHeader.classList.toggle('nav-open');
      navToggle.setAttribute('aria-expanded', String(isOpen));
    });
  }

  const overlay = document.querySelector('[data-project-overlay]');
  const overlayImage = document.querySelector('[data-project-image]');
  const overlayTitle = document.querySelector('[data-project-title]');
  const overlayMeta = document.querySelector('[data-project-meta]');
  const overlayDescription = document.querySelector('[data-project-description]');
  const overlayFacts = document.querySelector('[data-project-facts]');

  const projectWall = document.querySelector('[data-project-wall]');
  const projectPlaceholderTemplate = document.querySelector('#project-placeholder-template');
  if (projectWall && projectPlaceholderTemplate) {
    const placeholderImages = [
      'assets/images/home/projects/project-01.jpeg',
      'assets/images/home/projects/project-02.jpeg',
      'assets/images/home/projects/project-03.jpeg',
      'assets/images/home/projects/project-ref-eguide.png',
      'assets/images/exhibition/punio/punio-poster.png',
      'assets/images/exhibition/deviations-hero-collage.png'
    ];

    for (let i = 11; i <= 30; i += 1) {
      const clone = projectPlaceholderTemplate.content.firstElementChild.cloneNode(true);
      const isLandscape = i % 5 === 0;
      const isMotion = i % 4 === 0;
      const imgPath = placeholderImages[i % placeholderImages.length];
      const title = `Placeholder Project ${String(i).padStart(2, '0')}`;

      clone.classList.toggle('landscape', isLandscape);
      clone.classList.toggle('portrait', !isLandscape);
      clone.classList.toggle('motion', isMotion);
      clone.setAttribute('data-title', title);
      clone.setAttribute('data-meta', `Archive placeholder, 2026`);
      clone.setAttribute(
        'data-description',
        'Placeholder project card. Tap or click to open image and project information. Replace with final project details.'
      );
      clone.setAttribute('data-facts', 'Artist: Mey Amisa|Format: Placeholder|Location: Studio|Year: 2026');
      clone.setAttribute('data-image', imgPath);

      const img = clone.querySelector('img');
      if (img) {
        img.src = imgPath;
        img.alt = title;
      }
      projectWall.appendChild(clone);
    }
  }

  const closeOverlay = () => {
    if (!overlay) return;
    overlay.hidden = true;
    overlay.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  };

  if (overlay && overlayImage && overlayTitle && overlayMeta && overlayDescription && overlayFacts) {
    document.querySelectorAll('[data-project-card]').forEach((card) => {
      card.addEventListener('click', () => {
        const image = card.getAttribute('data-image') || '';
        const title = card.getAttribute('data-title') || 'Project';
        const meta = card.getAttribute('data-meta') || '';
        const description = card.getAttribute('data-description') || '';
        const facts = card.getAttribute('data-facts') || '';

        overlayImage.src = image;
        overlayImage.alt = title;
        overlayTitle.textContent = title;
        overlayMeta.textContent = meta;
        overlayDescription.textContent = description;
        overlayFacts.textContent = '';
        facts
          .split('|')
          .map((item) => item.trim())
          .filter(Boolean)
          .forEach((fact) => {
            const [label, ...rest] = fact.split(':');
            const value = rest.join(':').trim();
            const row = document.createElement('div');
            const dt = document.createElement('dt');
            const dd = document.createElement('dd');
            dt.textContent = label || 'Detail';
            dd.textContent = value || fact;
            row.appendChild(dt);
            row.appendChild(dd);
            overlayFacts.appendChild(row);
          });

        overlay.hidden = false;
        overlay.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
      });
    });

    document.querySelectorAll('[data-project-close]').forEach((closeNode) => {
      closeNode.addEventListener('click', closeOverlay);
    });

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') {
        closeOverlay();
      }
    });
  }

  const symbols = ['~', '_', '+', '*', '=', '-', ':', '/', '.'];
  document.querySelectorAll('[data-cipher-text]').forEach((node) => {
    const value = node.getAttribute('data-cipher-text') || '';
    const fragment = document.createDocumentFragment();

    Array.from(value).forEach((char, index) => {
      if (char === '\n') {
        fragment.appendChild(document.createElement('br'));
        return;
      }
      if (char === ' ') {
        fragment.appendChild(document.createTextNode(' '));
        return;
      }

      const pair = document.createElement('span');
      pair.className = 'cipher-pair';

      const main = document.createElement('span');
      main.textContent = char;
      const alt = document.createElement('i');
      alt.textContent = symbols[index % symbols.length];

      pair.appendChild(main);
      pair.appendChild(alt);
      fragment.appendChild(pair);
    });

    node.textContent = '';
    node.appendChild(fragment);
  });
})();
