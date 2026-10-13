/* Originkit Round Carousel: preserve the original ring geometry in HTML/CSS/JS.
 * Source: components/originkit/ui/roundcarousel.tsx, installed with the Originkit CLI.
 * SETEC adaptation: 17 uncropped logos, controls, vertical touch scrolling,
 * visibility-aware animation and a grid fallback using the same image elements.
 */
(() => {
  'use strict';
  const root = document.querySelector('[data-round-carousel]');
  if (!root) return;
  const stage = root.querySelector('.round-carousel-stage');
  const ring = root.querySelector('.round-carousel-ring');
  const items = [...root.querySelectorAll('.round-client')];
  const count = items.length;
  if (count < 2) return;
  const angle = 360 / count;
  const previous = root.querySelector('[data-client-prev]');
  const next = root.querySelector('[data-client-next]');
  const pause = root.querySelector('[data-client-pause]');
  const all = root.querySelector('[data-client-all]');
  const name = root.querySelector('[data-client-name]');
  const index = root.querySelector('[data-client-index]');
  const status = root.querySelector('.round-carousel-status');
  const help = root.querySelector('.round-carousel-help');
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  let rotation = 0, radius = 0, frame = 0, lastTime = 0, activeIndex = -1;
  let paused = reducedMotion.matches, visible = false, hover = false, focused = false, grid = false;
  let tween = null, pointer = null;

  function updateStatus() {
    const current = ((-Math.round(rotation / angle) % count) + count) % count;
    if (current === activeIndex) return;
    activeIndex = current;
    name.textContent = items[current].dataset.client;
    index.textContent = String(current + 1).padStart(2, '0');
    root.dataset.activeClient = String(current);
  }
  function paint() {
    ring.style.transform = `translateZ(${-radius}px) rotateY(${rotation}deg)`;
    updateStatus();
  }
  function resize() {
    const width = stage.clientWidth;
    const cardWidth = width < 600 ? 168 : width < 900 ? 190 : 208;
    const cardHeight = width < 600 ? 112 : 136;
    // The same count-based radius formula used by the Originkit component.
    const spacing = .75;
    radius = (cardWidth * (1 + spacing * .15)) / (2 * Math.tan(Math.PI / count));
    root.style.setProperty('--client-width', cardWidth + 'px');
    root.style.setProperty('--client-height', cardHeight + 'px');
    items.forEach((item, i) => {
      item.style.transform = `rotateY(${i * angle}deg) translateZ(${radius}px)`;
    });
    paint();
  }
  function canAnimate() {
    return visible && !document.hidden && !grid && !pointer?.dragging &&
      (tween || (!paused && !hover && !focused && !reducedMotion.matches));
  }
  function schedule() {
    if (canAnimate() && !frame) frame = requestAnimationFrame(draw);
    if (!canAnimate() && frame) { cancelAnimationFrame(frame); frame = 0; lastTime = 0; }
  }
  function draw(time) {
    frame = 0;
    const dt = lastTime ? Math.min((time - lastTime) / 1000, .05) : 0;
    lastTime = time;
    if (tween) {
      if (!tween.start) tween.start = time;
      const t = Math.min((time - tween.start) / 380, 1);
      const ease = 1 - (1 - t) ** 3;
      rotation = tween.from + (tween.to - tween.from) * ease;
      if (t === 1) tween = null;
    } else if (!paused && !hover && !focused && !reducedMotion.matches) {
      rotation -= 4 * dt;
    }
    paint();
    schedule();
    if (!frame) lastTime = 0;
  }
  function updatePause() {
    pause.hidden = grid || reducedMotion.matches;
    const label = paused ? 'Retomar rotação' : 'Pausar rotação';
    pause.setAttribute('aria-label', label);
    pause.title = label;
    pause.querySelector('path').setAttribute('d', paused ? 'M9 6l9 6-9 6z' : 'M9 6v12M15 6v12');
    status.setAttribute('aria-live', paused ? 'polite' : 'off');
  }
  function moveTo(target) {
    paused = true;
    updatePause();
    if (reducedMotion.matches) { rotation = target; tween = null; paint(); }
    else tween = { from: rotation, to: target, start: 0 };
    schedule();
  }
  function move(direction) { moveTo((Math.round(rotation / angle) - direction) * angle); }
  previous.addEventListener('click', () => move(-1));
  next.addEventListener('click', () => move(1));
  stage.addEventListener('keydown', event => {
    if (grid || !['ArrowLeft','ArrowRight','Home','End'].includes(event.key)) return;
    event.preventDefault();
    if (event.key === 'ArrowLeft') move(-1);
    if (event.key === 'ArrowRight') move(1);
    if (event.key === 'Home') moveTo(0);
    if (event.key === 'End') moveTo(-(count - 1) * angle);
  });
  pause.addEventListener('click', () => { paused = !paused; tween = null; updatePause(); schedule(); });
  all.addEventListener('click', () => {
    grid = !grid;
    paused = true;
    tween = null;
    root.classList.toggle('is-grid', grid);
    all.setAttribute('aria-expanded', String(grid));
    all.textContent = grid ? 'Voltar ao carrossel' : 'Ver todos os 17 clientes';
    pause.hidden = grid;
    help.hidden = grid;
    stage.tabIndex = grid ? -1 : 0;
    stage.setAttribute('aria-label', grid ? 'Todos os 17 clientes' : 'Carrossel de logotipos');
    updatePause();
    resize();
    schedule();
    stage.focus({ preventScroll: true });
    requestAnimationFrame(() => stage.scrollIntoView({ block: 'start', behavior: reducedMotion.matches ? 'instant' : 'smooth' }));
  });

  // Lock dragging to the horizontal axis; leave page scroll and pinch zoom native.
  stage.addEventListener('pointerdown', event => {
    if (grid || event.button !== 0) return;
    pointer = { id: event.pointerId, x: event.clientX, y: event.clientY, lastX: event.clientX, dragging: false };
  });
  stage.addEventListener('pointermove', event => {
    if (!pointer || pointer.id !== event.pointerId) return;
    const dx = event.clientX - pointer.x, dy = event.clientY - pointer.y;
    if (!pointer.dragging) {
      if (Math.max(Math.abs(dx), Math.abs(dy)) < 7) return;
      if (Math.abs(dy) > Math.abs(dx)) { pointer = null; return; }
      pointer.dragging = true;
      stage.setPointerCapture(event.pointerId);
      paused = true; tween = null;
      updatePause(); root.classList.add('is-dragging'); schedule();
    }
    rotation += (event.clientX - pointer.lastX) * .15;
    pointer.lastX = event.clientX;
    paint();
  });
  function endPointer(event) {
    if (!pointer || pointer.id !== event.pointerId) return;
    const dragged = pointer.dragging;
    if (stage.hasPointerCapture(event.pointerId)) stage.releasePointerCapture(event.pointerId);
    pointer = null;
    root.classList.remove('is-dragging');
    if (dragged) moveTo(Math.round(rotation / angle) * angle);
  }
  stage.addEventListener('pointerup', endPointer);
  stage.addEventListener('pointercancel', endPointer);
  root.addEventListener('pointerenter', event => { if (event.pointerType === 'mouse') { hover = true; schedule(); } });
  root.addEventListener('pointerleave', () => { hover = false; schedule(); });
  root.addEventListener('focusin', () => { focused = true; schedule(); });
  root.addEventListener('focusout', event => {
    if (!root.contains(event.relatedTarget)) { focused = false; schedule(); }
  });
  document.addEventListener('visibilitychange', schedule);
  reducedMotion.addEventListener('change', () => {
    if (reducedMotion.matches) { paused = true; tween = null; updatePause(); }
    schedule();
  });
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(entries => { visible = entries[0].isIntersecting; schedule(); }, { threshold: .1 }).observe(root);
  } else visible = true;
  if ('ResizeObserver' in window) new ResizeObserver(resize).observe(stage);
  else window.addEventListener('resize', resize, { passive: true });
  root.classList.add('is-enhanced');
  root.querySelector('.round-carousel-toolbar').hidden = false;
  help.hidden = false;
  resize();
  updatePause();
  schedule();
})();
