/* ============================================================
   RODRIGUES THEODORO ADVOGADOS — Main Entry Point
   Orquestra todos os módulos da aplicação
   ============================================================ */

import {
  initScrollAnimations,
  initHeroAnimation,
  initDiferenciaisScroll,
  initCounters,
} from './animations.js';

import {
  initNavbar,
  initModal,
  initForm,
} from './components.js';

// Instância global do Lenis — acessível por outros módulos
export let lenisInstance = null;

/**
 * Bootstrap: inicializa todos os módulos após o DOM carregar
 */
function bootstrap() {
  // 1. Lenis PRIMEIRO — precisa estar ativo antes de tudo que usa scroll
  initLenis();

  // 2. UI / Interatividade
  initNavbar();
  initModal();
  initForm();

  // 3. Animações de entrada
  initScrollAnimations();
  initCounters();

  // 4. Hero animation
  if (document.fonts?.ready) {
    document.fonts.ready.then(initHeroAnimation);
  } else {
    initHeroAnimation();
  }

  // 5. Diferenciais horizontal scroll (após GSAP carregar)
  waitForGSAP(() => {
    initDiferenciaisScroll();
  });
}

/**
 * Aguarda GSAP + ScrollTrigger estarem disponíveis globalmente
 */
function waitForGSAP(callback, attempts = 0) {
  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
    callback();
  } else if (attempts < 20) {
    setTimeout(() => waitForGSAP(callback, attempts + 1), 100);
  } else {
    // GSAP não carregou — fallback mobile
    console.warn('[RT Adv] GSAP não disponível. Usando fallback de animações.');
    callback(); // animations.js lida com o fallback internamente
  }
}

/**
 * Inicializa Lenis smooth scroll com integração GSAP ScrollTrigger
 */
function initLenis() {
  if (typeof Lenis === 'undefined') {
    console.warn('[RT Adv] Lenis não disponível — usando scroll nativo.');
    return;
  }

  // Respeita acessibilidade: não aplica smooth se usuário prefere movimento reduzido
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) return;

  lenisInstance = new Lenis({
    lerp: 0.1,          // suavidade da inércia (0 = instantâneo, 1 = sem movimento)
    smoothWheel: true,  // suaviza roda do mouse
    syncTouch: false,   // não interfere no touch nativo (mobile)
    duration: 1.2,      // duração base das transições
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // expo ease-out
  });

  // RAF loop — integra Lenis com GSAP ScrollTrigger
  function raf(time) {
    lenisInstance.raf(time);
    requestAnimationFrame(raf);
  }
  requestAnimationFrame(raf);

  // Sincroniza ScrollTrigger com o scroll virtual do Lenis
  lenisInstance.on('scroll', () => {
    if (typeof ScrollTrigger !== 'undefined') {
      ScrollTrigger.update();
    }
  });

  // Expõe globalmente para o módulo de componentes usar no smooth scroll de âncoras
  window.__lenis = lenisInstance;
}

// Entry point
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', bootstrap);
} else {
  bootstrap();
}
