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

// ── CONTROLOS DO VÍDEO DA HOMEPAGE ────────────────────────────────────────
function initHomeVideoControls() {
  const video = document.getElementById("meuVideo");
  const btnPlay = document.getElementById("btnPlay");
  const btnSound = document.getElementById("btnSound");
  const imgPlay = document.getElementById("imgPlay");
  const imgSound = document.getElementById("imgSound");

  if (video && btnPlay && btnSound) {

    function atualizarIconePlay() {
      if (video.paused) imgPlay.src = "imgs/play.png";
      else imgPlay.src = "imgs/pause.png";
    }

    function atualizarIconeSom() {
      if (video.muted) imgSound.src = "imgs/som_off.png";
      else imgSound.src = "imgs/som_on.png";
    }

    atualizarIconePlay();
    atualizarIconeSom();

    btnPlay.onclick = () => {
      if (video.paused) video.play().catch(err => console.log("Erro ao dar play:", err));
      else video.pause();
    };

    btnSound.onclick = () => {
      video.muted = !video.muted;
    };

    video.addEventListener('play', atualizarIconePlay);
    video.addEventListener('pause', atualizarIconePlay);
    video.addEventListener('volumechange', atualizarIconeSom);
  }
}

// ── MOTOR DO ESTENDAL ─────────────────────────────────────────────────────
function initEstendalScrollytelling() {
  const page = document.querySelector('.estendal-page-scrolly');
  const track = document.getElementById('clothesline-track');

  if (!page || !track) return;

  if (window.handleEstendalScroll) {
    page.removeEventListener('scroll', window.handleEstendalScroll);
    window.removeEventListener('resize', window.calculateEstendalDimensions);
    page.removeEventListener('wheel', window.stopSnap);
    page.removeEventListener('touchstart', window.stopSnap);
  }
  if (window.handleMobileScroll) {
    track.removeEventListener('scroll', window.handleMobileScroll);
  }

  const isMobile = window.innerWidth <= 768;

  if (isMobile) {
    track.style.transform = 'none';
    track.classList.add('cards-visible');

    let mobileScrollTimeout;

    window.handleMobileScroll = function () {
      const cards = track.querySelectorAll('.estendal-card-scrolly');
      const targetScreenCenter = window.innerWidth / 2;
      let centerIndex = 0;
      let minDistance = Infinity;

      cards.forEach((card, index) => {
        const rect = card.getBoundingClientRect();
        const cardCenter = rect.left + rect.width / 2;
        const dist = Math.abs(cardCenter - targetScreenCenter);
        if (dist < minDistance) {
          minDistance = dist;
          centerIndex = index;
        }
      });

      cards.forEach(c => c.classList.remove('is-active'));
      if (cards[centerIndex]) cards[centerIndex].classList.add('is-active');

      clearTimeout(mobileScrollTimeout);
      mobileScrollTimeout = setTimeout(() => {
        if (isAnimating) return;
        const activeCard = cards[centerIndex];
        if (!activeCard) return;

        const rect = activeCard.getBoundingClientRect();
        const cardCenter = rect.left + rect.width / 2;
        const diff = cardCenter - targetScreenCenter;

        if (Math.abs(diff) > 2) {
          track.scrollBy({ left: diff, behavior: 'smooth' });
        }
      }, 150);
    };

    track.addEventListener('scroll', window.handleMobileScroll, { passive: true });
    setTimeout(window.handleMobileScroll, 100);

    window.calculateEstendalDimensions = function () {
      if (window.innerWidth > 768) initEstendalScrollytelling();
    };
    window.addEventListener('resize', window.calculateEstendalDimensions);

    return;
  }

  let horizontalMoveMax = 0;
  let viewportWidth = window.innerWidth;
  let scrollTimeout;
  let isSnapping = false;
  let snapAnimationId;

  function easeOutCubic(t) { return 1 - Math.pow(1 - t, 3); }

  function customSmoothScroll(target, duration) {
    const start = page.scrollTop;
    const distance = target - start;
    let startTime = null;

    function step(timestamp) {
      if (!startTime) startTime = timestamp;
      const progress = timestamp - startTime;
      const percentage = Math.min(progress / duration, 1);

      page.scrollTop = start + distance * easeOutCubic(percentage);

      if (progress < duration) {
        snapAnimationId = requestAnimationFrame(step);
      } else {
        isSnapping = false;
      }
    }
    cancelAnimationFrame(snapAnimationId);
    snapAnimationId = requestAnimationFrame(step);
  }

  window.stopSnap = function () {
    if (isSnapping) {
      cancelAnimationFrame(snapAnimationId);
      isSnapping = false;
    }
  };

  page.addEventListener('wheel', window.stopSnap, { passive: true });
  page.addEventListener('touchstart', window.stopSnap, { passive: true });

  window.calculateEstendalDimensions = function () {
    viewportWidth = window.innerWidth;
    if (viewportWidth <= 768) {
      initEstendalScrollytelling();
      return;
    }
    setTimeout(() => {
      horizontalMoveMax = Math.max(0, track.scrollWidth - viewportWidth);
      window.handleEstendalScroll();
    }, 150);
  };

  window.handleEstendalScroll = function () {
    const scrollTop = page.scrollTop;
    const docHeight = page.scrollHeight - page.clientHeight;
    if (docHeight <= 0) return;
    let scrollPercent = scrollTop / docHeight;

    if (scrollTop <= 5) track.classList.remove('cards-visible');
    else track.classList.add('cards-visible');

    const moveStart = 0.15;
    let hPercent = 0;
    if (scrollPercent > moveStart) {
      hPercent = (scrollPercent - moveStart) / (1 - moveStart);
    }
    hPercent = Math.min(1, Math.max(0, hPercent));

    const currentX = hPercent * horizontalMoveMax;
    track.style.transform = `translateX(-${currentX}px)`;

    const cards = track.querySelectorAll('.estendal-card-scrolly');
    let centerIndex = 0;
    let minDistance = Infinity;
    const targetScreenCenter = viewportWidth / 2;

    cards.forEach((card, index) => {
      const rect = card.getBoundingClientRect();
      const cardCenter = rect.left + rect.width / 2;
      const dist = Math.abs(cardCenter - targetScreenCenter);
      if (dist < minDistance) {
        minDistance = dist;
        centerIndex = index;
      }
    });

    cards.forEach(c => c.classList.remove('is-active'));
    if (cards[centerIndex]) cards[centerIndex].classList.add('is-active');

    if (!isSnapping && horizontalMoveMax > 0 && scrollPercent >= moveStart) {
      clearTimeout(scrollTimeout);

      scrollTimeout = setTimeout(() => {
        if (isAnimating || isSnapping) return;
        const activeCard = cards[centerIndex];
        if (!activeCard) return;

        const trackRect = track.getBoundingClientRect();
        const cardRect = activeCard.getBoundingClientRect();
        const cardCenterInTrack = (cardRect.left - trackRect.left) + (cardRect.width / 2);

        let desiredTranslateX = cardCenterInTrack - targetScreenCenter;
        desiredTranslateX = Math.max(0, Math.min(desiredTranslateX, horizontalMoveMax));

        const diffX = Math.abs(currentX - desiredTranslateX);

        if (diffX > 2) {
          isSnapping = true;
          let targetHPercent = desiredTranslateX / horizontalMoveMax;
          let targetScrollPercent = (targetHPercent * (1 - moveStart)) + moveStart;
          let targetScrollTop = targetScrollPercent * docHeight;

          customSmoothScroll(targetScrollTop, 600);
        }
      }, 250);
    }
  };

  window.addEventListener('resize', window.calculateEstendalDimensions);
  page.addEventListener('scroll', window.handleEstendalScroll);
  window.calculateEstendalDimensions();
}

// ── INICIALIZAÇÃO GERAL DA PÁGINA ─────────────────────────────────────────
document.addEventListener("DOMContentLoaded", () => {
  initObservers();
  initEstendalScrollytelling();
  initHomeVideoControls();

  const savedScroll = sessionStorage.getItem('scroll_' + window.location.pathname);
  if (savedScroll !== null) {
    const pageEl = document.querySelector('.page, .estendal-page-scrolly');
    if (pageEl) pageEl.scrollTop = parseInt(savedScroll, 10);
  }
});

// ── SISTEMA DE NAVEGAÇÃO SUAVE E EVENTOS GLOBAIS ─────────────────────────
document.addEventListener("click", async (e) => {

  // 1. SOLUÇÃO DEFINITIVA DA EQUIPA (Event Delegation)
  // Ouve globalmente os cliques. Agora deteta se clicas no NOME ou na FOTO!
  const btnEquipa = e.target.closest('.eqp-nome, .eqp-foto');

  if (btnEquipa) {
    // Procura o contentor principal (.eqp-membro) para encontrar a gaveta certa
    const membroGeral = btnEquipa.closest('.eqp-membro');
    const gavetaDescricao = membroGeral.querySelector('.eqp-desc-wrapper');
    const dicaTexto = membroGeral.querySelector('.eqp-dica');

    if (gavetaDescricao) {
      gavetaDescricao.classList.toggle('aberto');

      if (gavetaDescricao.classList.contains('aberto')) {
        if (dicaTexto) { dicaTexto.style.opacity = '0'; dicaTexto.style.transform = 'translateY(-10px)'; }
      } else {
        if (dicaTexto) { dicaTexto.style.opacity = '0.7'; dicaTexto.style.transform = 'translateY(0)'; }
      }
    }
    return; // Pára aqui para que o Router Ajax não tente processar o clique
  }

  // 2. LÓGICA DO ROUTER AJAX
  const link = e.target.closest('a');

  if (!link || !link.href || link.target === '_blank' || link.hostname !== window.location.hostname || link.classList.contains('link-direto')) return;

  e.preventDefault();
  if (isAnimating) return;
  isAnimating = true;

  const targetUrl = link.href;
  const targetPath = new URL(targetUrl, window.location.origin).pathname;
  const container = document.getElementById('horizontal-container');
  const isBack = link.classList.contains('nav-link-back');

  const currentPageEl = document.querySelector('.page, .estendal-page-scrolly');
  if (currentPageEl) {
    sessionStorage.setItem('scroll_' + window.location.pathname, currentPageEl.scrollTop);
  }

  try {
    // MAGIA AQUI: { cache: 'no-cache' } garante que vais sempre buscar o HTML novo
    const response = await fetch(targetUrl, { cache: 'no-cache' });
    if (!response.ok) throw new Error('Erro');

    const htmlText = await response.text();
    const doc = new DOMParser().parseFromString(htmlText, 'text/html');

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
      if (isBack) {
        container.lastElementChild.remove();
      } else {
        container.firstElementChild.remove();
        container.style.transition = 'none';
        container.style.transform = 'translateX(0vw)';
      }

      // Reinicializa todos os scripts nas páginas injetadas dinamicamente
      initObservers();
      initEstendalScrollytelling();
      initHomeVideoControls();
      isAnimating = false;
    }, 800);

  } catch (err) { window.location.href = targetUrl; }
});

window.addEventListener("popstate", () => window.location.reload());


