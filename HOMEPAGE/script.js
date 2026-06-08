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

  let horizontalMoveMax = 0;
  let viewportWidth = window.innerWidth;
  let scrollTimeout;
  let isSnapping = false;
  let snapAnimationId;
  const ajusteHorizontal = 0;

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
      if (progress < duration) snapAnimationId = requestAnimationFrame(step);
      else isSnapping = false;
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

    if (scrollTop <= 5) {
      track.classList.remove('cards-visible');
    } else {
      track.classList.add('cards-visible');
    }

    const moveStart = 0.15;
    let hPercent = 0;
    if (scrollPercent > moveStart) {
      hPercent = (scrollPercent - moveStart) / (1 - moveStart);
    }
    hPercent = Math.min(1, Math.max(0, hPercent));

    const currentX = Math.floor(hPercent * horizontalMoveMax);
    track.style.transform = `translateX(-${currentX}px)`;

    const cards = track.querySelectorAll('.estendal-card-scrolly');
    let centerIndex = 0;
    let minDistance = Infinity;
    const targetScreenCenter = (viewportWidth / 2) + ajusteHorizontal;

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

    if (!isSnapping && horizontalMoveMax > 0 && scrollTop > 5) {
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        if (isAnimating) return;
        const activeCard = cards[centerIndex];
        if (!activeCard) return;
        const rect = activeCard.getBoundingClientRect();
        const cardCenter = rect.left + rect.width / 2;
        const diff = cardCenter - targetScreenCenter;
        if (Math.abs(diff) > 2 && scrollPercent >= moveStart) {
          isSnapping = true;
          let targetX = currentX + diff;
          targetX = Math.max(0, Math.min(targetX, horizontalMoveMax));
          let targetHPercent = targetX / horizontalMoveMax;
          let targetScrollPercent = (targetHPercent * (1 - moveStart)) + moveStart;
          let targetScrollTop = targetScrollPercent * docHeight;
          customSmoothScroll(targetScrollTop, 800);
        }
      }, 150);
    }
  };

  window.addEventListener('resize', window.calculateEstendalDimensions);
  page.addEventListener('scroll', window.handleEstendalScroll);
  window.calculateEstendalDimensions();
}

// ── MOTOR DA BARRIGA (inicializa após injeção via fetch) ──────────────────
function initBarriga(container) {
  const scrollContainer = container.querySelector('#scroll-container');
  const timeBackground = container.querySelector('#time-background');
  const gear = container.querySelector('#corner-gear-wrapper');

  if (!scrollContainer || !timeBackground || !gear) return;

  const colorStart = { r: 244, g: 235, b: 216 };
  const colorEnd   = { r: 139, g: 0,   b: 0   };
  const timeStart  = 720;
  const timeEnd    = 1170;
  const maxGearDegrees = 1080;

  // Elementos reveal da Barriga
  const reveals = container.querySelectorAll('.reveal');
  const revealObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) entry.target.classList.add('is-visible');
      else entry.target.classList.remove('is-visible');
    });
  }, { threshold: 0.5 });
  reveals.forEach(el => revealObs.observe(el));

  function updateVisualsAndGear() {
    const scrollTop  = scrollContainer.scrollTop;
    const maxScroll  = scrollContainer.scrollHeight - scrollContainer.clientHeight;
    const progress   = maxScroll > 0 ? Math.min(Math.max(scrollTop / maxScroll, 0), 1) : 0;

    gear.style.transform = `rotate(${progress * maxGearDegrees}deg)`;

    const currentMinutes = Math.floor(timeStart + (progress * (timeEnd - timeStart)));
    const hours = Math.floor(currentMinutes / 60);
    const mins  = currentMinutes % 60;
    timeBackground.textContent = `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;

    const r = Math.round(colorStart.r + (progress * (colorEnd.r - colorStart.r)));
    const g = Math.round(colorStart.g + (progress * (colorEnd.g - colorStart.g)));
    const b = Math.round(colorStart.b + (progress * (colorEnd.b - colorStart.b)));
    const currentRGB = `rgb(${r}, ${g}, ${b})`;

    document.body.style.backgroundColor = currentRGB;
    document.documentElement.style.setProperty('--bg-dynamic', currentRGB);

    if (progress > 0.4) document.body.classList.add('hungry-mode');
    else document.body.classList.remove('hungry-mode');
  }

  let isScrolling = false;
  scrollContainer.addEventListener('scroll', () => {
    if (!isScrolling) {
      window.requestAnimationFrame(() => {
        updateVisualsAndGear();
        isScrolling = false;
      });
      isScrolling = true;
    }
  });

  // Drag na engrenagem
  let isDraggingGear = false;
  let lastAngle = 0;

  function getAngle(e) {
    const rect    = gear.getBoundingClientRect();
    const centerX = rect.left + rect.width  / 2;
    const centerY = rect.top  + rect.height / 2;
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    return Math.atan2(clientY - centerY, clientX - centerX);
  }

  const startDrag = (e) => {
    isDraggingGear = true;
    lastAngle = getAngle(e);
    gear.style.cursor = 'grabbing';
    if (e.type === 'mousedown') e.preventDefault();
  };
  const stopDrag = () => {
    isDraggingGear = false;
    gear.style.cursor = 'grab';
  };
  const onDrag = (e) => {
    if (!isDraggingGear) return;
    let currentAngle = getAngle(e);
    let diff = currentAngle - lastAngle;
    if (diff > Math.PI)  diff -= 2 * Math.PI;
    if (diff < -Math.PI) diff += 2 * Math.PI;
    let diffDeg = diff * (180 / Math.PI);
    let maxScroll = scrollContainer.scrollHeight - scrollContainer.clientHeight;
    scrollContainer.scrollTop += (diffDeg / maxGearDegrees) * maxScroll;
    lastAngle = currentAngle;
  };

  gear.addEventListener('mousedown', startDrag);
  window.addEventListener('mouseup', stopDrag);
  window.addEventListener('mousemove', onDrag);
  gear.addEventListener('touchstart', startDrag, { passive: false });
  window.addEventListener('touchend', stopDrag);
  window.addEventListener('touchmove', onDrag, { passive: false });

  // Aplica estado inicial
  requestAnimationFrame(() => requestAnimationFrame(() => updateVisualsAndGear()));
}

// ── SISTEMA DE NAVEGAÇÃO SUAVE ────────────────────────────────────────────
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
  if (!link || !link.href || link.target === '_blank' || link.hostname !== window.location.hostname) return;

  e.preventDefault();
  if (isAnimating) return;
  isAnimating = true;

  const targetUrl  = link.href;
  const targetPath = new URL(targetUrl, window.location.origin).pathname;
  const container  = document.getElementById('horizontal-container');
  const isBack     = link.classList.contains('nav-link-back');

  const currentPageEl = document.querySelector('.page, .estendal-page-scrolly');
  if (currentPageEl) {
    sessionStorage.setItem('scroll_' + window.location.pathname, currentPageEl.scrollTop);
  }

  try {
    const response = await fetch(targetUrl);
    if (!response.ok) throw new Error('Erro');

    const htmlText = await response.text();
    const doc      = new DOMParser().parseFromString(htmlText, 'text/html');
    const newPage  = doc.querySelector('.page, .estendal-page-scrolly');

    if (!newPage) throw new Error('HTML inválido');

    if (isBack) {
      container.insertBefore(newPage, container.firstElementChild);

      const savedScroll = sessionStorage.getItem('scroll_' + targetPath);
      if (savedScroll !== null) newPage.scrollTop = parseInt(savedScroll, 10);

      container.style.transition = 'none';
      container.style.transform  = 'translateX(-100vw)';
      container.getBoundingClientRect();
      container.style.transition = 'transform 800ms cubic-bezier(0.77, 0, 0.175, 1)';
      container.style.transform  = 'translateX(0vw)';
    } else {
      container.appendChild(newPage);
      newPage.scrollTop = 0;
      container.style.transition = 'transform 800ms cubic-bezier(0.77, 0, 0.175, 1)';
      container.style.transform  = 'translateX(-100vw)';
    }

    history.pushState({}, '', targetUrl);

    setTimeout(() => {
      if (isBack) {
        container.lastElementChild.remove();
      } else {
        container.firstElementChild.remove();
        container.style.transition = 'none';
        container.style.transform  = 'translateX(0vw)';
      }

      // ✅ CORREÇÃO CENTRAL: após a animação, deteta que página foi carregada
      // e inicializa o motor correto
      const currentPage = container.querySelector('.page, .estendal-page-scrolly');

      if (currentPage && currentPage.querySelector('#scroll-container')) {
        // É a página da Barriga (ou similar com scroll-container)
        initBarriga(currentPage);
      } else {
        // É outra página normal
        initObservers();
        initEstendalScrollytelling();
      }

      isAnimating = false;
    }, 800);

  } catch (err) { window.location.href = targetUrl; }
});

window.addEventListener("popstate", () => window.location.reload());