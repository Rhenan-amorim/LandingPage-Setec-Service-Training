/* SETEC — small progressive enhancements shared by all static pages. */
(() => {
  'use strict';
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const dock = document.querySelector('.glass-dock');
  const dockLinks = [...document.querySelectorAll('.dock-link')];
  const mobileMenu = document.querySelector('.mobile-menu');
  const menuLinks = [...document.querySelectorAll('.mobile-menu-panel a')];
  const navigationLinks = [...dockLinks, ...menuLinks];
  const mobileLayout = window.matchMedia('(max-width:700px)');
  const indicator = dock?.querySelector('.dock-indicator');
  const sectionMap = {
    home: 'home', 'quem-somos': 'quem-somos', clientes: 'quem-somos',
    vantagens: 'quem-somos', servicos: 'servicos', locacao: 'servicos',
    simulador: 'servicos', gestao: 'gestao', ead: 'gestao',
    'nr-cursos': 'nr-cursos', treinamentos: 'treinamentos', contato: 'contato'
  };
  const sections = [...document.querySelectorAll('main > section[id]')];
  let selectedLink;
  function positionIndicator() {
    if (!indicator || !selectedLink) return;
    if (!selectedLink.offsetWidth) { indicator.style.opacity = '0'; return; }
    indicator.style.width = selectedLink.offsetWidth + 'px';
    indicator.style.height = selectedLink.offsetHeight + 'px';
    indicator.style.transform = 'translate(' + selectedLink.offsetLeft + 'px,' + selectedLink.offsetTop + 'px)';
    indicator.style.opacity = '1';
  }
  function selectDestination(id) {
    const next = dockLinks.find(link => link.dataset.section === id);
    if (!next || next === selectedLink) return;
    selectedLink = next;
    navigationLinks.forEach(link => {
      if (link.dataset.section === id) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
    positionIndicator();
  }
  function updateDestination() {
    if (!sections.length) {
      if (document.body.classList.contains('nr-page-body')) selectDestination('nr-cursos');
      return;
    }
    let current = sections[0];
    const readingLine = Math.min(window.innerHeight * .3, 240);
    for (const section of sections) {
      if (section.getBoundingClientRect().top <= readingLine) current = section;
    }
    if (window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 4) current = sections.at(-1);
    selectDestination(sectionMap[current.id]);
  }
  let scrollPending = false;
  window.addEventListener('scroll', () => {
    if (scrollPending) return;
    scrollPending = true;
    requestAnimationFrame(() => { updateDestination(); scrollPending = false; });
  }, { passive: true });
  updateDestination();
  function layoutNavigation() {
    // Match keyboard order to the visible controls at each breakpoint.
    const order = mobileLayout.matches
      ? ['treinamentos','servicos','nr-cursos','contato','home','quem-somos','gestao']
      : ['home','quem-somos','servicos','gestao','treinamentos','nr-cursos','contato'];
    order.forEach(id => {
      const link = dockLinks.find(item => item.dataset.section === id);
      if (link) dock.append(link);
    });
    if (!mobileLayout.matches && mobileMenu) mobileMenu.open = false;
    positionIndicator();
  }
  layoutNavigation();
  mobileLayout.addEventListener('change', layoutNavigation);
  if (mobileMenu) {
    const toggle = mobileMenu.querySelector('summary');
    document.addEventListener('click', event => {
      if (mobileMenu.open && !mobileMenu.contains(event.target)) mobileMenu.open = false;
    });
    document.addEventListener('keydown', event => {
      if (event.key === 'Escape' && mobileMenu.open) {
        event.preventDefault();
        mobileMenu.open = false;
        toggle.focus({ preventScroll: true });
      }
    });
    menuLinks.forEach(link => link.addEventListener('click', () => { mobileMenu.open = false; }));
    mobileMenu.addEventListener('focusout', event => {
      if (event.relatedTarget && !mobileMenu.contains(event.relatedTarget)) mobileMenu.open = false;
    });
  }
  requestAnimationFrame(() => dock?.classList.add('dock-ready'));
  if (dock && 'ResizeObserver' in window) new ResizeObserver(positionIndicator).observe(dock);
  window.addEventListener('resize', positionIndicator, { passive: true });
  document.fonts?.ready.then(positionIndicator);

  // Keep real anchors and browser history; transfer focus to the destination.
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', event => {
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const id = link.getAttribute('href').slice(1);
      const target = document.getElementById(id);
      if (!target) return;
      target.setAttribute('tabindex', '-1');
      target.focus({ preventScroll: true });
      // Default anchor action performs navigation and updates the URL.
      if (link.classList.contains('dock-link')) selectDestination(id);
    });
  });

  // Content remains visible when JS is absent or the animation is interrupted.
  if ('IntersectionObserver' in window) {
    const reveal = new IntersectionObserver(entries => {
      entries.forEach(({ target, isIntersecting }) => {
        if (!isIntersecting) return;
        if (!reducedMotion.matches) {
          target.classList.add('reveal-enter');
          target.addEventListener('animationend', () => target.classList.remove('reveal-enter'), { once: true });
        }
        reveal.unobserve(target);
      });
    }, { threshold: .08 });
    document.querySelectorAll('.reveal').forEach(el => reveal.observe(el));
  }

  // WAI-ARIA tabs: roving tabindex, arrows, Home/End and labelled panels.
  const tabs = [...document.querySelectorAll('.nr-tab-btn')];
  const panels = [...document.querySelectorAll('.nr-tab-content')];
  function activateTab(tab, focus = false) {
    tabs.forEach(item => {
      const active = item === tab;
      item.setAttribute('aria-selected', String(active));
      item.tabIndex = active ? 0 : -1;
      item.classList.toggle('active', active);
    });
    panels.forEach(panel => {
      panel.hidden = panel.id !== tab.getAttribute('aria-controls');
      panel.classList.toggle('active', !panel.hidden);
    });
    try { sessionStorage.setItem('setec-nr-category', tab.dataset.category); } catch { /* Storage is optional. */ }
    if (focus) tab.focus();
  }
  if (tabs.length) {
    document.documentElement.classList.add('js-tabs');
    let initial = tabs[0];
    try { initial = tabs.find(tab => tab.dataset.category === sessionStorage.getItem('setec-nr-category')) || initial; } catch { /* Private browsing fallback. */ }
    activateTab(initial);
    tabs.forEach((tab, index) => {
      tab.addEventListener('click', () => activateTab(tab));
      tab.addEventListener('keydown', event => {
        let next;
        if (event.key === 'ArrowRight') next = (index + 1) % tabs.length;
        if (event.key === 'ArrowLeft') next = (index - 1 + tabs.length) % tabs.length;
        if (event.key === 'Home') next = 0;
        if (event.key === 'End') next = tabs.length - 1;
        if (next === undefined) return;
        event.preventDefault();
        activateTab(tabs[next], true);
      });
    });
  }
  const filters = [...document.querySelectorAll('.filter-btn')];
  const courses = [...document.querySelectorAll('.t-card')];
  function filterCourses(button) {
    filters.forEach(item => {
      item.setAttribute('aria-pressed', String(item === button));
      item.classList.toggle('active', item === button);
    });
    courses.forEach(card => { card.hidden = card.dataset.cat !== button.dataset.filter; });
  }
  if (filters.length) {
    filterCourses(filters[0]);
    filters.forEach(button => button.addEventListener('click', () => filterCourses(button)));
  }

  // Native validation is followed by an external handoff, never a fake success.
  const form = document.getElementById('proposal-form');
  if (form) {
    const requiredText = ['nome', 'empresa'].map(id => document.getElementById(id));
    requiredText.forEach(input => {
      input.addEventListener('input', () => input.setCustomValidity(''));
      input.addEventListener('change', () => {
        input.value = input.value.trim();
        input.setCustomValidity(input.value ? '' : 'Por favor, preencha os campos obrigatórios: Nome, E-mail e Empresa.');
      });
    });
    form.addEventListener('submit', event => {
      event.preventDefault();
      requiredText.forEach(input => {
        input.value = input.value.trim();
        input.setCustomValidity(input.value ? '' : 'Por favor, preencha os campos obrigatórios: Nome, E-mail e Empresa.');
      });
      if (!form.reportValidity()) return;
      const data = new FormData(form);
      const value = name => String(data.get(name) || '').trim();
      const message = 'Olá! Sou ' + value('nome') + ' da empresa ' + value('empresa') + '.\n' +
        'E-mail: ' + value('email') + '\n' +
        (value('telefone') ? 'Telefone: ' + value('telefone') + '\n' : '') +
        (value('servico') ? 'Interesse: ' + value('servico') + '\n' : '') +
        (value('mensagem') ? '\n' + value('mensagem') : '');
      const url = 'https://wa.me/5521982874662?text=' + encodeURIComponent(message);
      const status = form.querySelector('.form-status');
      status.replaceChildren(document.createTextNode('Conclua o envio no WhatsApp. '));
      const fallback = document.createElement('a');
      fallback.href = url;
      fallback.target = '_blank';
      fallback.rel = 'noopener noreferrer';
      fallback.textContent = 'Continuar no WhatsApp';
      status.append(fallback);
      status.hidden = false;
      // No delivery is inferred from a popup return value; noopener may return null.
      window.open(url, '_blank', 'noopener,noreferrer');
    });
  }

  // Focus must stay above the fixed dock, including with enlarged text.
  document.addEventListener('focusin', event => {
    const element = event.target;
    if (!(element instanceof HTMLElement) || dock?.contains(element) || element.closest('[role="dialog"],dialog')) return;
    requestAnimationFrame(() => {
      const box = element.getBoundingClientRect();
      const lowerEdge = dock?.getBoundingClientRect().top ?? window.innerHeight;
      if (box.bottom > lowerEdge - 16 && box.height < window.innerHeight / 2) {
        window.scrollBy({ top: box.bottom - lowerEdge + 24, behavior: 'instant' });
      }
    });
  });
  if (window.visualViewport) {
    window.visualViewport.addEventListener('resize', () => {
      const typing = document.activeElement?.matches('input,textarea,select');
      document.body.classList.toggle('keyboard-open', Boolean(typing && window.innerHeight - window.visualViewport.height > 160));
    });
    document.addEventListener('focusout', () => document.body.classList.remove('keyboard-open'));
  }

  // Preserve original credit links while making the existing dialog modal.
  const modal = document.getElementById('devSocialModal');
  let restoreFocus;
  let inertElements = [];
  if (modal) {
    const triggers = [...document.querySelectorAll('.dev-credits-btn')];
    const close = modal.querySelector('.dev-modal-close');
    function closeModal() {
      modal.classList.remove('is-active');
      modal.setAttribute('aria-hidden', 'true');
      inertElements.forEach(element => { element.inert = false; });
      inertElements = [];
      document.body.classList.remove('dialog-open');
      triggers.forEach(button => button.setAttribute('aria-expanded', 'false'));
      restoreFocus?.focus({ preventScroll: true });
    }
    triggers.forEach(button => button.addEventListener('click', () => {
      restoreFocus = button;
      modal.classList.add('is-active');
      modal.setAttribute('aria-hidden', 'false');
      button.setAttribute('aria-expanded', 'true');
      inertElements = [...document.body.children].filter(el => el !== modal && !el.inert && !['SCRIPT','STYLE'].includes(el.tagName));
      inertElements.forEach(element => { element.inert = true; });
      document.body.classList.add('dialog-open');
      close.focus();
    }));
    close.addEventListener('click', closeModal);
    modal.addEventListener('click', event => { if (event.target === modal) closeModal(); });
    modal.addEventListener('keydown', event => {
      if (event.key === 'Escape') { event.preventDefault(); closeModal(); }
      if (event.key !== 'Tab') return;
      const focusable = [...modal.querySelectorAll('a[href],button')];
      const first = focusable[0], last = focusable.at(-1);
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    });
  }

  // The gallery is an enhancement of real image links, not a JS-only surface.
  const galleryLinks = [...document.querySelectorAll('.gallery-link')];
  if (galleryLinks.length && typeof HTMLDialogElement !== 'undefined') {
    const dialog = document.createElement('dialog');
    dialog.className = 'gallery-dialog';
    dialog.setAttribute('aria-label', 'Imagem da infraestrutura');
    const close = document.createElement('button');
    close.type = 'button';
    close.className = 'gallery-close';
    close.setAttribute('aria-label', 'Fechar imagem');
    close.textContent = '×';
    const image = document.createElement('img');
    const caption = document.createElement('p');
    caption.className = 'gallery-caption';
    caption.id = 'gallery-caption';
    dialog.setAttribute('aria-describedby', caption.id);
    dialog.append(close, image, caption);
    document.body.append(dialog);
    let origin;
    galleryLinks.forEach(link => link.addEventListener('click', event => {
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      event.preventDefault();
      origin = link;
      image.src = link.href;
      image.alt = link.querySelector('img').alt;
      caption.textContent = image.alt;
      dialog.showModal();
      document.body.classList.add('dialog-open');
      close.focus();
    }));
    close.addEventListener('click', () => dialog.close());
    dialog.addEventListener('click', event => {
      if (event.target !== dialog) return;
      const bounds = dialog.getBoundingClientRect();
      if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) dialog.close();
    });
    dialog.addEventListener('close', () => {
      document.body.classList.remove('dialog-open');
      origin?.focus({ preventScroll: true });
    });
  }
})();
