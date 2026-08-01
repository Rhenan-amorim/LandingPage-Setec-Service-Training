/* ============================================
   Grupo SETEC — Páginas de NR
   Luz/aurora moderna que acompanha o mouse no fundo
   ============================================ */
(function () {
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var bg = document.querySelector('.nr-geo-bg');
  if (!bg) return;

  bg.innerHTML = '';
  var a = document.createElement('div'); a.className = 'nr-glow nr-glow--a';
  var b = document.createElement('div'); b.className = 'nr-glow nr-glow--b';
  var c = document.createElement('div'); c.className = 'nr-glow nr-glow--c';
  bg.appendChild(b); bg.appendChild(a); bg.appendChild(c);

  function place(el, x, y) {
    el.style.transform = 'translate3d(' + (x - el.offsetWidth / 2).toFixed(1) + 'px,' +
                                          (y - el.offsetHeight / 2).toFixed(1) + 'px,0)';
  }

  // alvo (mouse) e posições atuais de cada camada
  var tx = window.innerWidth * 0.5, ty = window.innerHeight * 0.4;
  var ax = tx, ay = ty, bx = tx, by = ty, cx = tx, cy = ty;

  // posição inicial estática
  place(a, ax, ay); place(b, bx, by); place(c, cx, cy);
  if (reduce) return;   // sem seguir o mouse se o usuário prefere menos movimento

  window.addEventListener('mousemove', function (e) {
    tx = e.clientX; ty = e.clientY;
  }, { passive: true });

  function frame() {
    ax += (tx - ax) * 0.12;            // camada A: rápida (cobre)
    ay += (ty - ay) * 0.12;
    bx += (tx - bx) * 0.05;            // camada B: lenta (azul) → rastro/aurora
    by += (ty - by) * 0.05;
    cx += (tx - cx) * 0.08;            // camada C: média (teal)
    cy += (ty - cy) * 0.08;
    place(a, ax, ay);
    place(b, bx, by);
    place(c, cx, cy);
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
})();

// ===== DEVELOPER SOCIAL MODAL LOGIC FOR NR PAGES =====
(function() {
  function ensureDevModalExists() {
    let modal = document.getElementById('devSocialModal');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'devSocialModal';
      modal.className = 'dev-social-modal';
      modal.setAttribute('aria-hidden', 'true');
      modal.setAttribute('role', 'dialog');
      modal.setAttribute('aria-labelledby', 'devModalTitle');
      modal.innerHTML = `
  <div class="dev-social-card">
    <button type="button" class="dev-modal-close" id="closeDevModalBtn" aria-label="Fechar modal">✕</button>
    <div class="dev-profile-header">
      <div class="dev-avatar">RA</div>
      <div class="dev-info">
        <h4 id="devModalTitle">Rhenan Amorim</h4>
        <p>Desenvolvedor Web & UI/UX</p>
      </div>
    </div>
    <div class="dev-links-list">
      <a href="https://wa.me/5521971146102" target="_blank" rel="noopener noreferrer" class="dev-social-item whatsapp">
        <div class="dev-social-icon whatsapp">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
        </div>
        <div class="dev-social-details">
          <span class="dev-social-title">WhatsApp</span>
          <span class="dev-social-subtitle">+55 21 97114-6102</span>
        </div>
        <svg class="dev-social-arrow" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"></polyline></svg>
      </a>

      <a href="https://www.instagram.com/amorimads/" target="_blank" rel="noopener noreferrer" class="dev-social-item instagram">
        <div class="dev-social-icon instagram">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
        </div>
        <div class="dev-social-details">
          <span class="dev-social-title">Instagram</span>
          <span class="dev-social-subtitle">@amorimads</span>
        </div>
        <svg class="dev-social-arrow" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"></polyline></svg>
      </a>

      <a href="https://www.linkedin.com/in/rhenanamorim/" target="_blank" rel="noopener noreferrer" class="dev-social-item linkedin">
        <div class="dev-social-icon linkedin">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
        </div>
        <div class="dev-social-details">
          <span class="dev-social-title">LinkedIn</span>
          <span class="dev-social-subtitle">in/rhenanamorim</span>
        </div>
        <svg class="dev-social-arrow" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"></polyline></svg>
      </a>
    </div>
  </div>`;
      document.body.appendChild(modal);
    }
    return modal;
  }

  function initDevModal() {
    const modal = ensureDevModalExists();
    const triggers = document.querySelectorAll('.dev-credits-btn');
    const closeBtn = modal.querySelector('#closeDevModalBtn') || document.getElementById('closeDevModalBtn');

    function openModal(e) {
      if (e) e.preventDefault();
      modal.classList.add('is-active');
      modal.setAttribute('aria-hidden', 'false');
    }

    function closeModal() {
      modal.classList.remove('is-active');
      modal.setAttribute('aria-hidden', 'true');
    }

    triggers.forEach(btn => {
      btn.addEventListener('click', openModal);
    });

    if (closeBtn) {
      closeBtn.addEventListener('click', closeModal);
    }

    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        closeModal();
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modal.classList.contains('is-active')) {
        closeModal();
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initDevModal);
  } else {
    initDevModal();
  }
})();

