/*script.js - Barriga*/

// ==========================================

// 1. LÓGICA DA PÁGINA PRINCIPAL (Scrollytelling)

// ==========================================

function iniciarExperienciaBarriga() {

  const elements = document.querySelectorAll('.reveal');

  const observer = new IntersectionObserver((entries) => {

    entries.forEach(entry => {

      if (entry.isIntersecting) entry.target.classList.add('is-visible');

      else entry.target.classList.remove('is-visible');

    });

  }, { threshold: 0.5 });

  elements.forEach(el => observer.observe(el));



  const scrollContainer = document.getElementById('scroll-container');

  const timeBackground = document.getElementById('time-background');

  const gear = document.getElementById('corner-gear-wrapper');



  if (!scrollContainer || !timeBackground || !gear) return;



  const colorStart = { r: 244, g: 235, b: 216 };

  const colorEnd = { r: 139, g: 0, b: 0 };

  const timeStart = 720;

  const timeEnd = 1170;

  const maxGearDegrees = 1080;



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



  function updateVisualsAndGear() {

    const scrollTop = scrollContainer.scrollTop;

    const maxScroll = scrollContainer.scrollHeight - scrollContainer.clientHeight;

    const progress = Math.min(Math.max(scrollTop / maxScroll, 0), 1);



    gear.style.transform = `rotate(${progress * maxGearDegrees}deg)`;



    const currentMinutes = Math.floor(timeStart + (progress * (timeEnd - timeStart)));

    const hours = Math.floor(currentMinutes / 60);

    const mins = currentMinutes % 60;

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



  let isDraggingGear = false;

  let lastAngle = 0;



  function getAngle(e) {

    const rect = gear.getBoundingClientRect();

    const centerX = rect.left + rect.width / 2;

    const centerY = rect.top + rect.height / 2;

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



    if (diff > Math.PI) diff -= 2 * Math.PI;

    else if (diff < -Math.PI) diff += 2 * Math.PI;



    let diffDeg = diff * (180 / Math.PI);

    let maxScroll = scrollContainer.scrollHeight - scrollContainer.clientHeight;



    let progressChange = diffDeg / maxGearDegrees;

    scrollContainer.scrollTop += (progressChange * maxScroll);



    lastAngle = currentAngle;

  };



  gear.addEventListener('mousedown', startDrag);

  window.addEventListener('mouseup', stopDrag);

  window.addEventListener('mousemove', onDrag);

  gear.addEventListener('touchstart', startDrag, { passive: false });

  window.addEventListener('touchend', stopDrag);

  window.addEventListener('touchmove', onDrag, { passive: false });



  updateVisualsAndGear();

}



// ==========================================

// 2. LÓGICA DA PÁGINA SOBRE (Caixa Surpresa)

// ==========================================

function iniciarCuriosidadeBarriga() {

  const card = document.getElementById('curiosity-box');

  const gear = document.getElementById('interactive-gear');



  if (!card || !gear) return;



  let isDragging = false;

  let startAngle = 0;

  let currentRotation = 0;

  const maxRotation = 360;



  function getAngle(e) {

    const rect = gear.getBoundingClientRect();

    const centerX = rect.left + rect.width / 2;

    const centerY = rect.top + rect.height / 2;

    const clientX = e.touches ? e.touches[0].clientX : e.clientX;

    const clientY = e.touches ? e.touches[0].clientY : e.clientY;

    return Math.atan2(clientY - centerY, clientX - centerX);

  }



  const startDrag = (e) => {

    isDragging = true;

    card.classList.remove('is-snapping');

    startAngle = getAngle(e);

    gear.style.cursor = 'grabbing';

    if (e.type === 'mousedown') e.preventDefault();

  };



  const onDrag = (e) => {

    if (!isDragging) return;

    e.preventDefault();



    let angle = getAngle(e);

    let diff = angle - startAngle;



    if (diff > Math.PI) diff -= 2 * Math.PI;

    else if (diff < -Math.PI) diff += 2 * Math.PI;



    let diffDeg = diff * (180 / Math.PI);

    currentRotation += diffDeg;



    if (currentRotation < 0) currentRotation = 0;

    if (currentRotation > maxRotation) currentRotation = maxRotation;



    let progress = currentRotation / maxRotation;

    card.style.setProperty('--reveal-progress', progress);



    startAngle = angle;

  };



  const stopDrag = () => {

    if (!isDragging) return;

    isDragging = false;

    gear.style.cursor = 'grab';

    card.classList.add('is-snapping');



    if (currentRotation > maxRotation / 2) {

      currentRotation = maxRotation;

      card.style.setProperty('--reveal-progress', 1);

    } else {

      currentRotation = 0;

      card.style.setProperty('--reveal-progress', 0);

    }

  };



  gear.addEventListener('mousedown', startDrag);

  window.addEventListener('mousemove', onDrag);

  window.addEventListener('mouseup', stopDrag);

  gear.addEventListener('touchstart', startDrag, { passive: false });

  window.addEventListener('touchmove', onDrag, { passive: false });

  window.addEventListener('touchend', stopDrag);

}



// ==========================================

// 3. O MOTOR DE ARRANQUE INTELIGENTE

// ==========================================

function arrancarTudo() {

  iniciarExperienciaBarriga();

  iniciarCuriosidadeBarriga();

}



if (document.readyState === "complete" || document.readyState === "interactive") {

  arrancarTudo();

} else {

  document.addEventListener("DOMContentLoaded", arrancarTudo);

}