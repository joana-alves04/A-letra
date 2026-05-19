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
  { n: "02", label: "Sobre nós", desc: "Quem somos, onde estamos, no que acreditamos." },
  { n: "03", label: "Equipa", desc: "Quem faz parte." },
];

const EXPRESSOES = [
  { label: "Muitos anos a virar frangos", img: null },
  { label: "Passar pelas brasas", img: null },
  { label: "Barriga a dar horas", img: null },
  { label: "Bater as botas", img: null },
  { label: "Procurar uma agulha no palheiro", img: null },
  { label: "Meter os pés pelas mãos", img: null },
  { label: "Estar-se nas tintas", img: null },
  { label: "Estar com a pulga atrás da orelha", img: null },
  { label: "Misturar alhos com bugalhos", img: null },
  { label: "O mundo é bue cenas", img: null },
  { label: "Ficar a ver navios", img: null },
  { label: "Dar graxa", img: null },
  { label: "Ferver em pouca água", img: null },
  { label: "Partir o côco a rir", img: null },
  { label: "Acordar com os pés de fora", img: null },
  { label: "Tempestade num copo de água", img: null },
  { label: "O gato comeu-te a língua", img: null },
  { label: "Dar a volta ao bilhar grande", img: null },
  { label: "Pão pão, queijo queijo", img: null },
  { label: "Cão que ladra não morde", img: null },
  { label: "Macacos me mordam", img: null },
  { label: "Custou os olhos da cara", img: null },
  { label: "Estar pelos cabelos", img: null },
  { label: "Ficar de mãos a abanar", img: null },
  { label: "Dar nozes a quem não tem dentes", img: null },
  { label: "Ter a faca e o queijo na mão", img: null },
  { label: "Correr que nem um desalmado", img: null },
  { label: "Dar um passo maior que a perna", img: null },
  { label: "Deitar lenha na fogueira", img: null },
  { label: "Andar a comer muitos elásticos", img: null },
  { label: "Trigo limpo, farinha Amparo", img: null },
  { label: "Résves campo de Ourique", img: null },
];


// ── Scrollytelling das Expressões ─────────────────────────────────────────
function buildExpressoesPage(container) {
  container.innerHTML = `
    <div class="exp-varanda">

      <!-- Topo: header sobre fundo creme -->
      <div class="exp-varanda__header">
        <button class="detail-page__back" onclick="goHome()">← voltar</button>
        <h1 class="exp-title">Expressões</h1>
        <img src="logo.png" alt="Àletra" class="exp-logo" />
      </div>

      <!-- Fachada + fio (área fixa de cena) -->
      <div class="exp-varanda__scene" id="exp-scene">
        <!-- Imagem de fundo da fachada -->
<img src="./imgs/fachada.png">
        <canvas id="exp-wire-canvas"></canvas>

        <!-- Expressões penduradas -->
        <div id="exp-clothesline"></div>

        <!-- Label da expressão activa ao centro -->
        <div class="exp-active-label" id="exp-active-label"></div>

        <!-- Hint scroll -->
        <div class="exp-scroll-hint" id="exp-scroll-hint">
          <span>scroll</span>
          <span>↓</span>
        </div>
      </div>

      <!-- Driver de scroll invisível (por cima da cena) -->
      <div class="exp-varanda__driver" id="exp-driver">
        <div id="exp-driver-inner"></div>
      </div>

    </div>
  `;

  // Aguarda o DOM estar pronto e inicializa
  requestAnimationFrame(() => initVaranda(container));
}


function initVaranda(container) {
  const scene = container.querySelector('#exp-scene');
  const canvas = container.querySelector('#exp-wire-canvas');
  const lineEl = container.querySelector('#exp-clothesline');
  const driver = container.querySelector('#exp-driver');
  const label = container.querySelector('#exp-active-label');
  const hint = container.querySelector('#exp-scroll-hint');
  const ctx = canvas.getContext('2d');

  // Config
  const ITEM_SPACING = 200;
  const WIRE_Y_RATIO = 0.60;   // fio a 60% da altura da cena (entre as janelas)
  const SAG = 14;
  const CARD_HANG = 24;

  let W, H, wireY, items = [];

  // Altura da cena = viewport menos o header
  function getSceneH() {
    const headerH = container.querySelector('.exp-varanda__header').offsetHeight;
    return window.innerHeight - headerH;
  }

  function setup() {
    W = scene.offsetWidth;
    H = scene.offsetHeight;
    wireY = H * WIRE_Y_RATIO;

    canvas.width = W;
    canvas.height = H;

    // Driver altura — suficiente para percorrer todas as expressões
    driver.querySelector('#exp-driver-inner').style.height =
      (EXPRESSOES.length * ITEM_SPACING + window.innerHeight) + 'px';

    // Render itens
    lineEl.innerHTML = '';
    items = [];

    EXPRESSOES.forEach((exp, i) => {
      const el = document.createElement('div');
      el.className = 'exp-item';
      const tilt = (Math.random() - 0.5) * 7;
      el.dataset.tilt = tilt;

      const imgHTML = exp.img
        ? `<img class="exp-card__img" src="${exp.img}" alt="${exp.label}" />`
        : `<div class="exp-card__placeholder"><svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg"><ellipse cx="32" cy="28" rx="16" ry="12" stroke="#450707" stroke-width="1.5"/><path d="M28 40 L32 48 L36 40" fill="#450707" stroke="#450707" stroke-width="1" stroke-linejoin="round"/></svg></div>`;

      el.innerHTML = `
        <div class="exp-peg"></div>
        <div class="exp-card">
          ${imgHTML}
          <p class="exp-card__label">${exp.label}</p>
          <span class="exp-card__num">${String(i + 1).padStart(2, '0')}</span>
        </div>`;

      lineEl.appendChild(el);
      items.push({ el, tilt });
    });
  }

  function drawWire(offset) {
    ctx.clearRect(0, 0, W, H);

    // Sombra
    ctx.beginPath();
    ctx.moveTo(0, wireY + 3);
    ctx.quadraticCurveTo(W / 2, wireY + SAG + 3, W, wireY + 3);
    ctx.strokeStyle = 'rgba(0,0,0,0.10)';
    ctx.lineWidth = 3;
    ctx.stroke();

    // Fio
    ctx.beginPath();
    ctx.moveTo(0, wireY);
    ctx.quadraticCurveTo(W / 2, wireY + SAG, W, wireY);
    ctx.strokeStyle = '#4a3010';
    ctx.lineWidth = 2.5;
    ctx.lineCap = 'round';
    ctx.stroke();
  }

  function positionItems(offset) {
    const centreX = W / 2;
    let activeIdx = -1;
    let minDist = Infinity;

    items.forEach((item, i) => {
      const rawX = i * ITEM_SPACING - offset + W * 0.5;

      // Y ao longo da curva do fio
      const t = Math.max(0, Math.min(1, rawX / W));
      const sagY = 4 * SAG * t * (1 - t);
      const y = wireY + sagY;

      item.el.style.left = (rawX - 75) + 'px';
      item.el.style.top = (y + CARD_HANG) + 'px';

      const dist = Math.abs(rawX - centreX);
      const maxDist = W * 0.55;
      const proximity = Math.max(0, 1 - dist / maxDist);
      const scale = 0.70 + proximity * 0.40;
      const opacity = 0.30 + proximity * 0.70;

      item.el.style.transform = `rotate(${item.tilt}deg) scale(${scale})`;
      item.el.style.opacity = opacity;
      item.el.classList.toggle('is-active', dist < ITEM_SPACING * 0.45);

      if (dist < minDist) {
        minDist = dist;
        activeIdx = i;
      }
    });

    if (activeIdx >= 0) {
      label.textContent = EXPRESSOES[activeIdx].label;
      label.style.opacity = '1';
    }
  }

  function onScroll() {
    const scrollTop = driver.scrollTop;
    const scrollMax = driver.scrollHeight - driver.clientHeight;
    const progress = scrollMax > 0 ? scrollTop / scrollMax : 0;
    const offset = progress * (EXPRESSOES.length * ITEM_SPACING);

    drawWire(offset);
    positionItems(offset);

    if (scrollTop > 20) hint.style.opacity = '0';
    else hint.style.opacity = '1';
  }

  function resize() {
    scene.style.height = getSceneH() + 'px';
    setup();
    onScroll();
  }

  driver.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', resize);

  resize();
}


// ── DOMContentLoaded ──────────────────────────────────────────────────────
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
      buildExpressoesPage(page);
    } else {
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

    if (pageIndex !== 0) {
      targetPage.classList.remove('is-entered');
      setTimeout(() => targetPage.classList.add('is-entered'), 80);
    }
  });

  // 6. Ano no footer
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
});


// ── Voltar à home ─────────────────────────────────────────────────────────
function goHome() {
  const wrapper = document.getElementById('h-scroll');
  if (wrapper) wrapper.scrollTo({ left: 0, behavior: 'smooth' });
}