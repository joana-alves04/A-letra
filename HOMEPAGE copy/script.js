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

// ── MOTOR DO ESTENDAL (Corrigido para evitar saltos no final) ──────────────
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
          
          // Correção: Garantimos que o limite é o fim exato da imagem
          maxVerticalMove = Math.max(0, imgHeight - viewportHeight);
          horizontalMoveMax = Math.max(0, track.scrollWidth - viewportWidth);
          
          window.handleEstendalScroll();
      }, 150);
  };

  window.handleEstendalScroll = function() {
     const scrollTop = page.scrollTop; 
     const docHeight = page.scrollHeight - page.clientHeight; 
     
     let scrollPercent = scrollTop / docHeight;
     if(isNaN(scrollPercent) || docHeight === 0) scrollPercent = 0; 
     
     // Fade in das cartas
     if (scrollPercent > 0.03) {
         track.classList.add('cards-visible');
     } else {
         track.classList.remove('cards-visible');
     }

     // Lógica de fases (Fachada sobe, depois cartas movem-se)
     const phase1End = 0.15;
     let vPercent = Math.min(1, Math.max(0, scrollPercent / phase1End)); 
     let hPercent = Math.min(1, Math.max(0, (scrollPercent - phase1End) / (1 - phase1End))); 

     // Arredondamento para evitar tremuras (usando floor/ceil para precisão)
     const currentY = Math.floor(vPercent * maxVerticalMove);
     const currentX = Math.floor(hPercent * horizontalMoveMax);

     facadeWrapper.style.transform = `translateY(-${currentY}px)`;
     track.style.transform = `translateX(-${currentX}px)`;

     // Lógica de destaque da carta central
     const cards = track.querySelectorAll('.estendal-card-scrolly');
     let centerIndex = 0;
     let minDistance = Infinity;

     cards.forEach((card, index) => {
         const rect = card.getBoundingClientRect();
         const dist = Math.abs((rect.left + rect.width / 2) - (viewportWidth / 2));
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

// ── SISTEMA DE NAVEGAÇÃO SUAVE ──────────────────────────────────────────
document.addEventListener("DOMContentLoaded", () => {
  initObservers();
  initEstendalScrollytelling(); 
});

document.addEventListener("click", async (e) => {
  const link = e.target.closest('a');
  if (!link || !link.href || link.target === '_blank' || link.hostname !== window.location.hostname) return;

  e.preventDefault();
  if (isAnimating) return;
  isAnimating = true;

  const targetUrl = link.href;
  const container = document.getElementById('horizontal-container');
  const isBack = link.classList.contains('nav-link-back');

  try {
    const response = await fetch(targetUrl);
    if (!response.ok) throw new Error('Erro');
    
    const htmlText = await response.text();
    const doc = new DOMParser().parseFromString(htmlText, 'text/html');
    const newPage = doc.querySelector('.page, .estendal-page-scrolly');
    
    if (!newPage) throw new Error('HTML inválido');

    if (isBack) {
      container.insertBefore(newPage, container.firstElementChild);
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