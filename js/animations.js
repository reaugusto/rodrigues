/* ============================================================
   RODRIGUES THEODORO ADVOGADOS — Animations Module
   Scroll-triggered animations usando GSAP + IntersectionObserver
   ============================================================ */

/**
 * Configura animações de entrada baseadas em scroll (IntersectionObserver)
 * Fallback sem GSAP para elementos .anim-up, .anim-slide-left, .anim-slide-right
 */
export function initScrollAnimations() {
  const animElements = document.querySelectorAll('.anim-up, .anim-slide-left, .anim-slide-right');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        // Stagger delay para siblings
        const siblings = [...entry.target.parentElement.children];
        const siblingIndex = siblings.indexOf(entry.target);
        const delay = entry.target.classList.contains('anim-up') ? siblingIndex * 80 : 0;

        setTimeout(() => {
          entry.target.classList.add('visible');
        }, delay);

        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -60px 0px'
  });

  animElements.forEach(el => observer.observe(el));
}

/**
 * Hero entrance animation com GSAP
 */
export function initHeroAnimation() {
  if (typeof gsap === 'undefined') return;

  const tl = gsap.timeline({ delay: 0.1 });

  // Eyebrow
  const eyebrow = document.getElementById('hero-eyebrow');
  if (eyebrow) {
    tl.fromTo(eyebrow,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }
    );
  }

  // Título palavra por palavra (split)
  const title = document.getElementById('hero-title');
  if (title) {
    tl.fromTo(title,
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 1, ease: 'power3.out' },
      '-=0.5'
    );
  }

  const drama = document.getElementById('hero-drama');
  if (drama) {
    tl.fromTo(drama,
      { opacity: 0, y: 20, skewX: -3 },
      { opacity: 1, y: 0, skewX: 0, duration: 1.2, ease: 'power4.out' },
      '-=0.8'
    );
  }

  // Sub
  const sub = document.getElementById('hero-sub');
  if (sub) {
    tl.fromTo(sub,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.9, ease: 'power3.out' },
      '-=0.8'
    );
  }

  // Actions
  const actions = document.getElementById('hero-actions');
  if (actions) {
    tl.fromTo(actions,
      { opacity: 0, y: 15 },
      { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' },
      '-=0.6'
    );
  }

  // Stats bar
  const stats = document.querySelectorAll('.hero-stat');
  if (stats.length) {
    tl.fromTo(stats,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.7, stagger: 0.1, ease: 'power3.out' },
      '-=0.4'
    );
  }

  // Decorative circles
  const circles = document.querySelectorAll('.hero-decor-circle');
  gsap.fromTo(circles,
    { opacity: 0, scale: 0.8 },
    { opacity: 1, scale: 1, duration: 2.5, stagger: 0.3, ease: 'power2.out', delay: 0.3 }
  );
}

/**
 * Painel horizontal de Diferenciais via GSAP ScrollTrigger
 */
export function initDiferenciaisScroll() {
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
    initDiferenciaisFallback();
    return;
  }

  const section = document.getElementById('diferenciais');
  const track = section?.querySelector('.diferenciais-track');
  const panels = section?.querySelectorAll('.diferencial-panel');
  const dots = document.querySelectorAll('.prog-dot');
  const progress = document.querySelector('.dif-progress');

  if (!section || !track || !panels || panels.length === 0) return;

  const totalPanels = panels.length;
  let currentPanel = 0;

  // Mostra dots quando a seção está visível
  ScrollTrigger.create({
    trigger: section,
    start: 'top center',
    end: 'bottom center',
    onEnter: () => progress?.classList.add('visible'),
    onLeave: () => progress?.classList.remove('visible'),
    onEnterBack: () => progress?.classList.add('visible'),
    onLeaveBack: () => progress?.classList.remove('visible'),
  });

  // Scroll horizontal pinned
  gsap.to(track, {
    x: () => -(section.offsetWidth * (totalPanels - 1)),
    ease: 'none',
    scrollTrigger: {
      trigger: section,
      pin: true,
      scrub: 1,
      start: 'top top',
      end: () => `+=${section.offsetWidth * (totalPanels - 1)}`,
      onUpdate: (self) => {
        const newPanel = Math.round(self.progress * (totalPanels - 1));
        if (newPanel !== currentPanel) {
          currentPanel = newPanel;
          updateDots(newPanel);
        }
      }
    }
  });

  function updateDots(index) {
    dots.forEach((dot, i) => {
      dot.classList.toggle('active', i === index);
    });
  }

  // Clique nos dots para navegar
  dots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
      const sectionTop = section.getBoundingClientRect().top + window.scrollY;
      const totalHeight = section.offsetWidth * (totalPanels - 1);
      const targetScroll = sectionTop + (totalHeight / (totalPanels - 1)) * index;
      window.scrollTo({ top: targetScroll, behavior: 'smooth' });
    });
  });
}

/**
 * Fallback mobile: Diferenciais em scroll vertical normal
 */
function initDiferenciaisFallback() {
  const track = document.querySelector('.diferenciais-track');
  if (!track) return;
  track.style.flexDirection = 'column';
  track.style.width = '100%';
  document.querySelectorAll('.diferencial-panel').forEach(p => {
    p.style.width = '100%';
    p.style.height = 'auto';
    p.style.minHeight = '80vh';
  });
}

/**
 * Animação de contadores numéricos
 */
export function initCounters() {
  const counters = document.querySelectorAll('[data-counter]');
  if (!counters.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.dataset.counter);
        const suffix = el.dataset.suffix || '';
        const duration = 1500;
        const start = performance.now();

        const animate = (time) => {
          const elapsed = time - start;
          const progress = Math.min(elapsed / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3); // cubic ease out
          el.textContent = Math.round(eased * target).toLocaleString('pt-BR') + suffix;
          if (progress < 1) requestAnimationFrame(animate);
        };

        requestAnimationFrame(animate);
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(el => observer.observe(el));
}
