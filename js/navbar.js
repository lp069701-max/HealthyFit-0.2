/* =====================================================================
   HEALTHYFIT · navbar.js
   1 Utilidades (window.HF) · 2 Altura de la barra (--nav-offset) · 3 Menú móvil
   4 Botón activo (data-pagina) · 5 Scroll: progreso, subir, "Estás en", puntos
   Se carga PRIMERO (funciones.js lo necesita).
   Clases que usa estilo.css: .is-open (barra), body.menu-open, .active/.is-selected (botón),
   .on (puntos), .show (botón subir)
   ===================================================================== */
(() => {
  'use strict';

  /* ---------- 1. UTILIDADES ---------- */
  const $  = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => Array.from(c.querySelectorAll(s));
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  window.HF = { $, $$, reduceMotion };

  const nav = $('#hfNav');

  /* ---------- 2. ALTURA DE LA BARRA ---------- */
  // estilo.css usa --nav-offset para que los enlaces #ancla no queden tapados por la barra
  function medirBarra() {
    if (nav) document.documentElement.style.setProperty('--nav-offset', nav.offsetHeight + 'px');
  }

  /* ---------- 3. MENÚ MÓVIL ---------- */
  function iniciarMenu() {
    const toggle = $('#navToggle'), cerrar = $('#navClose'), fondo = $('#navBackdrop'), panel = $('#navPanel');
    if (!nav || !toggle || !panel) return;

    const abrir = (v) => {
      nav.classList.toggle('is-open', v);
      document.body.classList.toggle('menu-open', v);
      toggle.setAttribute('aria-expanded', String(v));
      toggle.setAttribute('aria-label', v ? 'Cerrar menú' : 'Abrir menú');
      if (v) cerrar?.focus({ preventScroll: true });
    };
    toggle.addEventListener('click', () => abrir(!nav.classList.contains('is-open')));
    cerrar?.addEventListener('click', () => { abrir(false); toggle.focus(); });
    fondo?.addEventListener('click', () => abrir(false));
    panel.addEventListener('click', (e) => { if (e.target.closest('a')) abrir(false); });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && nav.classList.contains('is-open')) { abrir(false); toggle.focus(); }
    });
    window.matchMedia('(min-width: 769px)').addEventListener('change', (e) => { if (e.matches) abrir(false); });
  }

  /* ---------- 4. BOTÓN ACTIVO ---------- */
  // <body data-pagina="servicios"> colorea el enlace con data-pagina="servicios"
  function marcarActivo() {
    const pagina = document.body.dataset.pagina;
    $$('.hf-nav__links a[data-pagina]').forEach((a) => {
      const on = a.dataset.pagina === pagina;
      a.classList.toggle('active', on);
      a.classList.toggle('is-selected', on);
      if (on) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current');
    });
  }

  /* ---------- 5. SCROLL ---------- */
  function iniciarScroll() {
    const barra = $('#progressBar'), subir = $('#toTop'), aqui = $('#hereName');
    const puntos = $$('#sectionDots a');
    const secciones = $$('main [data-label]');
    const inicial = aqui ? aqui.textContent : '';
    let pendiente = false, actual = null;

    const seccion = () => {
      if (!secciones.length) return;
      const linea = (nav ? nav.offsetHeight : 80) + window.innerHeight * 0.25;
      let elegida = secciones[0];
      secciones.forEach((s) => { if (s.getBoundingClientRect().top <= linea) elegida = s; });
      if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4) elegida = secciones[secciones.length - 1];
      if (elegida === actual) return;
      actual = elegida;
      if (aqui) aqui.textContent = elegida.dataset.label || inicial;
      puntos.forEach((p) => p.classList.toggle('on', p.getAttribute('href') === '#' + elegida.id));
    };

    const alScroll = () => {
      const y = window.scrollY;
      const total = document.documentElement.scrollHeight - window.innerHeight;
      if (barra) barra.style.width = (total > 0 ? Math.min(y / total, 1) * 100 : 0).toFixed(2) + '%';
      subir?.classList.toggle('show', y > 500);
      seccion();
      pendiente = false;
    };
    window.addEventListener('scroll', () => { if (!pendiente) { pendiente = true; requestAnimationFrame(alScroll); } }, { passive: true });
    window.addEventListener('resize', () => { medirBarra(); alScroll(); });
    subir?.addEventListener('click', () => window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' }));
    alScroll();
  }

  medirBarra();
  if ('ResizeObserver' in window && nav) new ResizeObserver(medirBarra).observe(nav);
  iniciarMenu();
  marcarActivo();
  iniciarScroll();
})();
