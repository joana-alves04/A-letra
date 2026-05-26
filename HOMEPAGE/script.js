let isAnimating = false;

function initObservers() {
  const elements = document.querySelectorAll('.slide-text, .row, .card, .inner-section');
  if ('IntersectionObserver' in window) {
    const obs = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -5% 0px' });
    elements.forEach(el => obs.observe(el));
  } else {
    elements.forEach(el => el.classList.add('is-visible'));
  }
}

// ── O MOTOR DO ESTENDAL PERFEITO (Afinado) ─────────────────────────────────
function initEstendalScrollytelling() {
  const page = document.querySelector('.estendal-page-scrolly');
  const facadeWrapper = document.getElementById('facade-wrapper');
  const track = document.getElementById('clothesline-track');
  const fachadaImg = document.getElementById('fachada-img');
  
  if (!page || !facadeWrapper || !track || !fachadaImg) return;

  if (window.handleEstendalScroll) {
      page.removeEventListener('scroll', window.handleEstendalScroll);
      window.removeEventListener('resize', window.calculateEstendalDimensions);
  }

  let maxVerticalMove = 0;
  let horizontalMoveMax = 0;
  let viewportWidth = window.innerWidth;
  let viewportHeight = window.innerHeight;

  window.calculateEstendalDimensions = function() {
      viewportWidth = window.innerWidth;
      viewportHeight = window.innerHeight;

      setTimeout(() => {
          const imgHeight = fachadaImg.getBoundingClientRect().height;
          
          maxVerticalMove = imgHeight - viewportHeight;
          if (maxVerticalMove < 0) maxVerticalMove = 0;

          horizontalMoveMax = track.scrollWidth - viewportWidth;
          
          window.handleEstendalScroll();
      }, 100);
  };

  window.handleEstendalScroll = function() {
     const scrollTop = page.scrollTop; 
     const docHeight = page.scrollHeight - page.clientHeight; 
     
     let scrollPercent = scrollTop / docHeight;
     if(isNaN(scrollPercent) || docHeight === 0) scrollPercent = 0; 
     
     // 1. LÓGICA DA OPACIDADE
     if (scrollPercent > 0.03) {
         track.classList.add('cards-visible');
     } else {
         track.classList.remove('cards-visible');
     }

     // 2. LÓGICA DO MOVIMENTO
     const phase1End = 0.15;

     let vPercent = scrollPercent / phase1End;
     vPercent = Math.min(1, Math.max(0, vPercent)); 

     let hPercent = (scrollPercent - phase1End) / (1 - phase1End);
     hPercent = Math.min(1, Math.max(0, hPercent)); 

     // Arredondamento para evitar saltos visuais (tremor)
     const currentY = (vPercent * maxVerticalMove).toFixed(1);
     const currentX = (hPercent * horizontalMoveMax).toFixed(1);

     facadeWrapper.style.transform = `translateY(-${currentY}px)`;
     track.style.transform = `translateX(-${currentX}px)`;

     // --- Lógica das Cartas em Destaque ---
     const cards = track.querySelectorAll('.estendal-card-scrolly');
     let centerIndex = 0;
     let minDistance = Infinity;

     cards.forEach((card, index) => {
         const rect = card.getBoundingClientRect();
         const cardCenter = rect.left + rect.width / 2;
         const screenCenter = viewportWidth / 2;
         const dist = Math.abs(cardCenter - screenCenter);

         if (dist < minDistance) {
             minDistance = dist;
             centerIndex = index;
         }
     });

     cards.forEach(c => c.classList.remove('is-active'));
     if(cards[centerIndex]) cards[centerIndex].classList.add('is-active');
  };

  window.addEventListener('resize', window.calculateEstendalDimensions);
  page.addEventListener('scroll', window.handleEstendalScroll);
  
  window.calculateEstendalDimensions();
}

// ── SISTEMA GERAL DE NAVEGAÇÃO ───────────────────────────────────────────
document.addEventListener("DOMContentLoaded", () => {
  initObservers();
  initEstendalScrollytelling(); 
  
  const savedScroll = sessionStorage.getItem('scroll_' + window.location.pathname);
  if (savedScroll !== null) {
    const pageEl = document.querySelector('.page, .estendal-page-scrolly');
    if (pageEl) pageEl.scrollTop = parseInt(savedScroll, 10);
  }
});

document.addEventListener("click", async (e) => {
  const link = e.target.closest('a');
  
  // REMOVI a exclusão de 'estendal-card-scrolly' para permitir a navegação nos cards
  if (!link || !link.href || link.target === '_blank' || link.hostname !== window.location.hostname) return;

  e.preventDefault();
  if (isAnimating) return;
  isAnimating = true;

  const targetUrl = link.href;
  const targetPath = new URL(targetUrl, window.location.origin).pathname;
  const isBack = link.classList.contains('nav-link-back');
  const container = document.getElementById('horizontal-container');

  const currentPageEl = document.querySelector('.page, .estendal-page-scrolly');
  if (currentPageEl) {
    sessionStorage.setItem('scroll_' + window.location.pathname, currentPageEl.scrollTop);
  }

  try {
    const response = await fetch(targetUrl);
    if (!response.ok) throw new Error('Erro');
    
    const htmlText = await response.text();
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlText, 'text/html');
    const newPage = doc.querySelector('.page, .estendal-page-scrolly');
    
    if (!newPage) throw new Error('HTML inválido');

    if (isBack) {
      container.insertBefore(newPage, container.firstElementChild);
      
      const savedScroll = sessionStorage.getItem('scroll_' + targetPath);
      if (savedScroll !== null) newPage.scrollTop = parseInt(savedScroll, 10);

      container.style.transition = 'none';
      container.style.transform = 'translateX(-100vw)';
      container.getBoundingClientRect(); 
      
      container.style.transition = 'transform 800ms cubic-bezier(0.77, 0, 0.175, 1)';
      container.style.transform = 'translateX(0vw)';
    } else {
      container.appendChild(newPage);
      newPage.scrollTop = 0;
      container.style.transition = 'transform 800ms cubic-bezier(0.77, 0, 0.175, 1)';
      container.style.transform = 'translateX(-100vw)';
    }

    history.pushState({}, '', targetUrl);

    setTimeout(() => {
      if (isBack) container.lastElementChild.remove();
      else {
        container.firstElementChild.remove();
        container.style.transition = 'none';
        container.style.transform = 'translateX(0vw)';
      }
      initObservers();
      initEstendalScrollytelling(); 
      isAnimating = false;
    }, 800);

  } catch (err) {
    window.location.href = targetUrl;
  }
});

window.addEventListener("popstate", () => window.location.reload());