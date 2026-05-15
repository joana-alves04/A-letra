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

    page.innerHTML = `
      <p class="detail-page__title">${item.label}</p>
      <p class="detail-page__sub">(conteudo)</p>
      <button class="detail-page__back" onclick="goHome()">← voltar</button>
    `;

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

    // Animação de entrada
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