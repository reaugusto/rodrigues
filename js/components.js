/* ============================================================
   RODRIGUES THEODORO ADVOGADOS — Components Module
   Navbar, Modal de Áreas, Formulário, Mobile Menu
   ============================================================ */

const WA_NUMBER = '5511932053967';
const WA_BASE = `https://wa.me/${WA_NUMBER}`;

/** Dados dos modais por área */
const MODAL_DATA = {
  trabalhista: {
    icon: 'work',
    tag: '// Direito Trabalhista',
    title: 'Direito Trabalhista',
    desc: 'Defesa dos seus direitos nas relações de trabalho. Atuamos tanto na recuperação de verbas não pagas quanto na proteção de empresas em reclamações trabalhistas, sempre com estratégia e rigor técnico.',
    services: [
      'Cálculo de Verbas Rescisórias',
      'Ações Trabalhistas',
      'Acordo Judicial',
      'Rescisão Indireta',
      'Defesa para Empresas',
      'FGTS e Multas',
      'Horas Extras e Adicionais',
      'Assédio Moral e Sexual',
    ],
    note: '📋 Trazendo sua CTPS, holerites e contrato de trabalho, aceleramos a análise do seu caso.',
    waText: 'Olá! Preciso de ajuda com uma questão trabalhista. Gostaria de falar com o Rodrigues Theodoro Advogados.',
  },
  previdenciario: {
    icon: 'health_and_safety',
    tag: '// Previdenciário / INSS',
    title: 'Previdenciário / INSS',
    desc: 'Atuamos para garantir que você receba os benefícios previdenciários que tem direito junto ao INSS. Contestamos negativas, revisamos valores e aceleramos concessões por via judicial quando necessário.',
    services: [
      'LOAS (BPC)',
      'Aposentadoria por Idade',
      'Revisão de Aposentadoria',
      'Auxílio Doença',
      'Auxílio Acidente',
      'Pensão por Morte',
      'Acordo Judicial INSS',
      'Aposentadoria por Invalidez',
    ],
    note: '📋 Reúna documentos médicos, histórico do CNIS e laudos para agilizar sua consulta.',
    waText: 'Olá! Preciso de orientação sobre benefício previdenciário/INSS. Gostaria de falar com o Rodrigues Theodoro Advogados.',
  },
  civel: {
    icon: 'family_restroom',
    tag: '// Cível / Família',
    title: 'Direito Cível e Família',
    desc: 'Protegemos seus direitos nas relações civis e familiares com sensibilidade e precisão técnica. Atuamos em questões patrimoniais, de família e de consumo, buscando a solução mais justa para você.',
    services: [
      'Pensão Alimentícia',
      'Redução de Pensão',
      'Divórcio e Separação',
      'Guarda de Filhos',
      'Direito do Consumidor',
      'Inventário e Herança',
      'Reconhecimento de Paternidade',
      'Usucapião',
    ],
    note: '📋 Para casos de família, certidões de nascimento e casamento são documentos importantes na primeira consulta.',
    waText: 'Olá! Tenho uma questão de direito cível/família e gostaria de falar com o Rodrigues Theodoro Advogados.',
  },
};

/**
 * Inicializa o Modal de Áreas
 */
export function initModal() {
  const overlay = document.getElementById('modal-overlay');
  const closeBtn = document.getElementById('modal-close');

  if (!overlay || !closeBtn) return;

  // Abertura dos cards
  document.querySelectorAll('[data-modal]').forEach(card => {
    card.addEventListener('click', () => openModal(card.dataset.modal));
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openModal(card.dataset.modal);
      }
    });
  });

  // Fechar
  closeBtn.addEventListener('click', closeModal);
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) closeModal();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal();
  });
}

function openModal(key) {
  const data = MODAL_DATA[key];
  if (!data) return;

  const overlay = document.getElementById('modal-overlay');
  const iconEl = document.getElementById('modal-icon');
  const tagEl = document.getElementById('modal-tag');
  const titleEl = document.getElementById('modal-title-el');
  const descEl = document.getElementById('modal-desc');
  const servicesEl = document.getElementById('modal-services');
  const noteEl = document.getElementById('modal-note');
  const ctaEl = document.getElementById('modal-cta');

  if (iconEl) iconEl.innerHTML = `<span class="material-symbols-outlined" aria-hidden="true">${data.icon}</span>`;
  if (tagEl) tagEl.textContent = data.tag;
  if (titleEl) titleEl.textContent = data.title;
  if (descEl) descEl.textContent = data.desc;
  if (noteEl) noteEl.textContent = data.note;

  if (servicesEl) {
    servicesEl.innerHTML = data.services.map(s => `
      <div class="modal-service-item">
        <span class="modal-service-dot"></span>
        ${s}
      </div>
    `).join('');
  }

  if (ctaEl) {
    ctaEl.href = `${WA_BASE}?text=${encodeURIComponent(data.waText)}`;
  }

  overlay.setAttribute('aria-hidden', 'false');
  overlay.classList.add('active');
  document.body.style.overflow = 'hidden';

  // Focus trap
  setTimeout(() => {
    const closeBtn = document.getElementById('modal-close');
    closeBtn?.focus();
  }, 100);
}

function closeModal() {
  const overlay = document.getElementById('modal-overlay');
  overlay.classList.remove('active');
  overlay.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}

/**
 * Inicializa a Navbar (scroll + mobile menu)
 */
export function initNavbar() {
  const navbar = document.getElementById('navbar');
  const toggle = document.getElementById('menu-toggle');
  const links = document.getElementById('nav-links');

  if (!navbar) return;

  // Scroll behavior
  let lastScroll = 0;
  window.addEventListener('scroll', () => {
    const currentScroll = window.scrollY;
    if (currentScroll > 80) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
    lastScroll = currentScroll;
  }, { passive: true });

  // Mobile menu toggle
  if (toggle && links) {
    toggle.addEventListener('click', () => {
      const isOpen = links.classList.toggle('open');
      toggle.classList.toggle('open', isOpen);
      toggle.setAttribute('aria-expanded', String(isOpen));
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    // Fechar ao clicar em link
    links.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        links.classList.remove('open');
        toggle.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      });
    });
  }

  // Smooth scroll para links internos — usa Lenis quando disponível
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const href = anchor.getAttribute('href');
      if (href === '#') return; // ignora logo link

      const target = document.querySelector(href);
      if (!target) return;

      e.preventDefault();

      // Fecha menu mobile se aberto
      if (links.classList.contains('open')) {
        links.classList.remove('open');
        toggle?.classList.remove('open');
        toggle?.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      }

      const navH = navbar?.offsetHeight ?? 80;

      if (window.__lenis) {
        // Lenis cuida da animação com easing premium
        window.__lenis.scrollTo(target, {
          offset: -navH,
          duration: 1.4,
          easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        });
      } else {
        // Fallback nativo
        const top = target.getBoundingClientRect().top + window.scrollY - navH;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });
}

/**
 * Inicializa o formulário de contato
 */
export function initForm() {
  const form = document.getElementById('form-contato');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = document.getElementById('form-submit');

    const nome = document.getElementById('f-nome')?.value?.trim();
    const tel = document.getElementById('f-tel')?.value?.trim();
    const email = document.getElementById('f-email')?.value?.trim();
    const area = document.getElementById('f-area')?.value;
    const msg = document.getElementById('f-msg')?.value?.trim();

    if (!nome) {
      shakeField('f-nome');
      return;
    }

    // Monta mensagem WhatsApp
    const areaLabel = area
      ? { trabalhista: 'Trabalhista', previdenciario: 'Previdenciário/INSS', civel: 'Cível/Família', outros: 'Outros' }[area] || area
      : 'Não especificada';

    const waMsg = [
      `Olá! Vim pelo site do Rodrigues Theodoro Advogados.`,
      ``,
      `*Nome:* ${nome}`,
      tel ? `*Telefone:* ${tel}` : null,
      email ? `*E-mail:* ${email}` : null,
      `*Área de interesse:* ${areaLabel}`,
      msg ? `\n*Mensagem:* ${msg}` : null,
    ].filter(Boolean).join('\n');

    // Feedback visual
    if (btn) {
      btn.disabled = true;
      btn.innerHTML = `<span>Abrindo WhatsApp...</span><span class="material-symbols-outlined" aria-hidden="true">check</span>`;
    }

    // Abre WhatsApp
    window.open(`${WA_BASE}?text=${encodeURIComponent(waMsg)}`, '_blank', 'noopener');

    // Reset após 2s
    setTimeout(() => {
      form.reset();
      if (btn) {
        btn.disabled = false;
        btn.innerHTML = `<span>Enviar Mensagem</span><span class="material-symbols-outlined" aria-hidden="true">send</span>`;
      }
    }, 2000);
  });
}

function shakeField(id) {
  const el = document.getElementById(id);
  if (!el) return;
  el.style.animation = 'none';
  el.offsetHeight; // reflow
  el.style.animation = 'shake 0.4s ease';
  el.style.borderColor = '#ef4444';
  el.focus();
  setTimeout(() => {
    el.style.borderColor = '';
    el.style.animation = '';
  }, 1000);
}

// Injeta keyframe para shake
const shakeStyle = document.createElement('style');
shakeStyle.textContent = `
@keyframes shake {
  0%,100% { transform: translateX(0); }
  20%      { transform: translateX(-6px); }
  40%      { transform: translateX(6px); }
  60%      { transform: translateX(-4px); }
  80%      { transform: translateX(4px); }
}`;
document.head.appendChild(shakeStyle);
