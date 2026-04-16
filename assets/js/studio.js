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
