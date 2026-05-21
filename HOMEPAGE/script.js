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

// O MOTOR DO ESTENDAL HORIZONTAL
function initEstendalScroll() {
  const page = document.querySelector('.page');
  const track = document.getElementById('clothesline-track');
  
  if (!track || !page) return;

  const viewportWidth = window.innerWidth;

  if (window.handleEstendalScroll) {
    page.removeEventListener('scroll', window.handleEstendalScroll);
  }

  window.handleEstendalScroll = function() {
     const scrollTop = page.scrollTop; 
     const docHeight = page.scrollHeight - page.clientHeight; 
     
     let scrollPercent = scrollTop / docHeight;
     if(isNaN(scrollPercent) || docHeight === 0) scrollPercent = 0; 
     
     const trackWidth = track.scrollWidth;
     const horizontalMove = (trackWidth - viewportWidth) * scrollPercent;
     
     // Move a corda. Note-se a remoção do translateY(-50%) para manter o alinhamento da mola
     track.style.transform = `translateX(-${horizontalMove}px)`;

     const cards = track.querySelectorAll('.estendal-card');
     let centerIndex = 0;
     let minDistance = Infinity;

     // Deteta a carta mais perto do centro do ecrã
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

     // Destaca a carta do centro
     cards.forEach(c => c.classList.remove('is-active'));
     if(cards[centerIndex]) cards[centerIndex].classList.add('is-active');
  };

  page.addEventListener('scroll', window.handleEstendalScroll);
  window.handleEstendalScroll(); 
}

document.addEventListener("DOMContentLoaded", () => {
  initObservers();
  initEstendalScroll(); 
  
  const savedScroll = sessionStorage.getItem('scroll_' + window.location.pathname);
  if (savedScroll !== null) {
    const pageEl = document.querySelector('.page');
    if (pageEl) pageEl.scrollTop = parseInt(savedScroll, 10);
  }
});

document.addEventListener("click", async (e) => {
  const link = e.target.closest('a');
  
  // Ignora o router se for link dos cartões ou link externo
  if (!link || link.classList.contains('estendal-card') || !link.href || link.target === '_blank' || link.hostname !== window.location.hostname) return;

  e.preventDefault();
  if (isAnimating) return;
  isAnimating = true;

  const targetUrl = link.href;
  const targetPath = new URL(targetUrl, window.location.origin).pathname;
  const isBack = link.classList.contains('nav-link-back');
  const container = document.getElementById('horizontal-container');

  const currentPageEl = document.querySelector('.page');
  if (currentPageEl) {
    sessionStorage.setItem('scroll_' + window.location.pathname, currentPageEl.scrollTop);
  }

  try {
    const response = await fetch(targetUrl);
    if (!response.ok) throw new Error('Erro');
    
    const htmlText = await response.text();
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlText, 'text/html');
    const newPage = doc.querySelector('.page');
    
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
      initEstendalScroll(); 
      isAnimating = false;
    }, 800);

  } catch (err) {
    window.location.href = targetUrl;
  }
});

window.addEventListener("popstate", () => window.location.reload());