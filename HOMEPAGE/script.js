// ── Slides de texto (reveal on scroll vertical) ───────────────────────────
const texts = document.querySelectorAll('.slide-text');
const textObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) entry.target.classList.add('is-visible');
  });
}, { threshold: 0.35 });
texts.forEach(el => textObserver.observe(el));


// ── Dados ─────────────────────────────────────────────────────────────────
const ITEMS = [
  { n: "01", label: "Expressões", desc: "Expressões linguísticas." },
  { n: "02", label: "Sobre nós",  desc: "Quem somos, onde estamos, no que acreditamos." },
  { n: "03", label: "Equipa",     desc: "Quem faz parte." },
];

const EXPRESSOES = [
  { label: "Muitos anos a virar frangos",         img: null },
  { label: "Passar pelas brasas",                 img: null },
  { label: "Barriga a dar horas",                 img: null },
  { label: "Bater as botas",                      img: null },
  { label: "Procurar uma agulha no palheiro",     img: null },
  { label: "Meter os pés pelas mãos",             img: null },
  { label: "Estar-se nas tintas",                 img: null },
  { label: "Estar com a pulga atrás da orelha",   img: null },
  { label: "Misturar alhos com bugalhos",         img: null },
  { label: "O mundo é bue cenas",                 img: null },
  { label: "Ficar a ver navios",                  img: null },
  { label: "Dar graxa",                           img: null },
  { label: "Ferver em pouca água",                img: null },
  { label: "Partir o côco a rir",                 img: null },
  { label: "Acordar com os pés de fora",          img: null },
  { label: "Tempestade num copo de água",         img: null },
  { label: "O gato comeu-te a língua",            img: null },
  { label: "Dar a volta ao bilhar grande",        img: null },
  { label: "Pão pão, queijo queijo",              img: null },
  { label: "Cão que ladra não morde",             img: null },
  { label: "Macacos me mordam",                   img: null },
  { label: "Custou os olhos da cara",             img: null },
  { label: "Estar pelos cabelos",                 img: null },
  { label: "Ficar de mãos a abanar",              img: null },
  { label: "Dar nozes a quem não tem dentes",     img: null },
  { label: "Ter a faca e o queijo na mão",        img: null },
  { label: "Correr que nem um desalmado",         img: null },
  { label: "Dar um passo maior que a perna",      img: null },
  { label: "Deitar lenha na fogueira",            img: null },
  { label: "Andar a comer muitos elásticos",      img: null },
  { label: "Trigo limpo, farinha Amparo",         img: null },
  { label: "Résves campo de Ourique",             img: null },
];

const PLACEHOLDER_SVG = `
  <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
    <ellipse cx="32" cy="28" rx="16" ry="12" stroke="#450707" stroke-width="1.5"/>
    <path d="M28 40 L32 48 L36 40" fill="#450707" stroke="#450707" stroke-width="1" stroke-linejoin="round"/>
  </svg>`;


// ── Render grid de Expressões ──────────────────────────────────────────────
function buildExpressoesPage(container) {
  const cols = window.innerWidth <= 600 ? 2 : window.innerWidth <= 900 ? 3 : 4;

  container.innerHTML = `
    <div class="exp-inner">
      <header class="exp-header">
        <button class="detail-page__back exp-back-btn" onclick="goHome()">← voltar</button>
        <h1 class="exp-title">Expressões</h1>
      </header>
      <div class="exp-grid" id="exp-grid"></div>
    </div>
  `;

  const grid = container.querySelector('#exp-grid');

  EXPRESSOES.forEach((exp, i) => {
    const isLandscape = i < cols;
    const card = document.createElement('article');
    card.className = `card ${isLandscape ? 'card--landscape' : 'card--portrait'}`;
    card.setAttribute('tabindex', '0');
    card.setAttribute('aria-label', exp.label);

    const imgContent = exp.img
      ? `<img class="card__img" src="${exp.img}" alt="${exp.label}" loading="lazy" />`
      : `<div class="card__img-placeholder">${PLACEHOLDER_SVG}</div>`;

    card.innerHTML = `
      <div class="card__img-wrap">${imgContent}</div>
      <div class="card__body">
        <p class="card__label">${exp.label}</p>
        <span class="card__arrow">ver →</span>
      </div>
    `;

    card.addEventListener('click', () => console.log('Expressão:', exp.label));
    card.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') console.log('Expressão:', exp.label);
    });

    grid.appendChild(card);
  });

  // Reveal cards
  const cards = container.querySelectorAll('.card');
  if ('IntersectionObserver' in window) {
    const obs = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08 });
    cards.forEach(c => obs.observe(c));
  } else {
    cards.forEach(c => c.classList.add('is-visible'));
  }
}


document.addEventListener("DOMContentLoaded", () => {

  // 1. Criar wrapper horizontal
  const wrapper = document.createElement('div');
  wrapper.id = 'h-scroll';

  const mainCol = document.createElement('div');
  const mainEl = document.querySelector('main');
  mainEl.parentNode.insertBefore(wrapper, mainEl);
  mainCol.appendChild(mainEl);
  wrapper.appendChild(mainCol);


  // 2. Criar páginas de detalhe
  ITEMS.forEach((item, i) => {
    const page = document.createElement('div');
    page.id = `page-${i}`;
    page.className = 'detail-page';

    if (i === 0) {
      // Página Expressões — grid de cards
      buildExpressoesPage(page);
    } else {
      // Outras páginas — placeholder
      page.innerHTML = `
        <p class="detail-page__title">${item.label}</p>
        <p class="detail-page__sub">em construção</p>
        <button class="detail-page__back" onclick="goHome()">← voltar</button>
      `;
    }

    wrapper.appendChild(page);
  });


  // 3. Render lista
  const list = document.querySelector('.list');
  if (list) {
    list.innerHTML = ITEMS.map((it, i) => `
      <div class="row">
        <a href="#" class="row-link" data-page="${i}">
          <span class="row-num">${it.n}</span>
          <span class="row-label">${it.label}</span>
          <span class="row-cta">ver →</span>
        </a>
      </div>
    `).join('');
  }


  // 4. Reveal on scroll (linhas do índice)
  const rows = document.querySelectorAll('.row');
  if (rows.length > 0 && 'IntersectionObserver' in window) {
    const obs = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0, rootMargin: '0px 0px -12% 0px' });
    rows.forEach(row => obs.observe(row));
  } else {
    rows.forEach(row => row.classList.add('is-visible'));
  }


  // 5. Clique nas linhas → scroll horizontal
  document.addEventListener('click', e => {
    const link = e.target.closest('.row-link[data-page]');
    if (!link) return;
    e.preventDefault();

    const pageIndex = parseInt(link.dataset.page, 10);
    const targetPage = document.getElementById(`page-${pageIndex}`);
    if (!targetPage) return;

    wrapper.scrollTo({ left: targetPage.offsetLeft, behavior: 'smooth' });

    // Animação de entrada (só para páginas sem grid próprio)
    targetPage.classList.remove('is-entered');
    setTimeout(() => targetPage.classList.add('is-entered'), 80);
  });


  // 6. Ano no footer (se existir)
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

});


// ── Voltar à home ─────────────────────────────────────────────────────────
function goHome() {
  const wrapper = document.getElementById('h-scroll');
  if (wrapper) wrapper.scrollTo({ left: 0, behavior: 'smooth' });
}