const btn = document.getElementById("turnBtn");
const frango = document.getElementById("frango");
const counter = document.getElementById("counter");

let years = 0;
let rotation = 0;
let virouFrango = false;

// ── 1. LÓGICA DO JOGO DO FRANGO ──
if (btn) {
    btn.addEventListener("click", () => {
        years++;
        rotation += 360;
        frango.style.transform = `rotate(${rotation}deg)`;
        if (years < 50) counter.innerHTML = `${years} anos a virar frangos`;
        if (years === 15) {
            frango.innerHTML = `<img src="../imgs/galinha_animal.png" class="animal" draggable="false">`;
            document.body.classList.add("galinha-mode");
        }
        if (years >= 50) {
            if (!virouFrango) {
                virouFrango = true;
                frango.innerHTML = `<img src="../imgs/chicken_little.png" class="animal" draggable="false">`;
                document.body.classList.remove("galinha-mode");
                document.body.classList.add("insane");
                frango.style.transition = "transform 0.15s linear";
            }
            counter.innerHTML = `<div class="final-text"><span class="main">VIRASTE UM FRANGO!</span><span class="years">${years} anos a virar frangos</span></div>`;
        }
        if (years >= 65 && !document.querySelector(".end-buttons")) {
            frango.style.display = "none"; btn.style.display = "none"; counter.style.display = "none";
            const buttons = document.createElement("div");
            buttons.classList.add("end-buttons");
            buttons.innerHTML = `<button class="final-btn" onclick="window.location.href='sobre_frangos.html'">Saber mais sobre a expressão</button><button class="final-btn" onclick="window.location.href='../HOMEPAGE/expressoes.html'">Página Inicial</button>`;
            document.querySelector(".scene").appendChild(buttons);
        }
    });
}

// ── 2. MOTOR DE SCROLLYTELLING ──
function initObservers() {
    const elements = document.querySelectorAll('.reveal');
    const obs = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
            } else {
                entry.target.classList.remove('is-visible');
            }
        });
    }, { threshold: 0.5 });
    elements.forEach(el => obs.observe(el));
}

// Inicializa o Scrollytelling quando a página carrega
document.addEventListener("DOMContentLoaded", () => {
    initObservers();
});