document.addEventListener("DOMContentLoaded", () => {
    const root = document.documentElement;
    const screens = document.querySelectorAll('.screen');

    // Variáveis para suavidade (Lerping)
    let currentX = 0;
    let currentY = 0;
    let targetX = 0;
    let targetY = 0;

    // 1. O MOTOR DE CÂMARA
    window.addEventListener('scroll', () => {
        // Leitura à prova de bala para qualquer browser
        const scrollTop = window.scrollY || document.documentElement.scrollTop;
        const maxScroll = document.documentElement.scrollHeight - window.innerHeight;

        // Evita cálculos vazios caso a página ainda esteja a carregar
        if (maxScroll <= 0) return;

        // Garante que o progresso está sempre preso entre 0 e 1
        const progress = Math.max(0, Math.min(1, scrollTop / maxScroll));

        // Pedaço 1: Direita (Ecrã 1 -> Ecrã 2)
        if (progress <= 0.33) {
            targetX = progress / 0.33;
            targetY = 0;
        }
        // Pedaço 2: Baixo (Ecrã 2 -> Ecrã 3)
        else if (progress <= 0.66) {
            targetX = 1;
            targetY = (progress - 0.33) / 0.33;
        }
        // Pedaço 3: Direita (Ecrã 3 -> Ecrã 4)
        else {
            targetX = 1 + ((progress - 0.66) / 0.34);
            targetY = 1;
        }
    });

    // 2. HIGHLIGHT DOS TEXTOS
    function checkVisibility() {
        screens.forEach((screen, index) => {
            const perfectPositions = [
                { x: 0, y: 0 },
                { x: 1, y: 0 },
                { x: 1, y: 1 },
                { x: 2, y: 1 }
            ];

            const pos = perfectPositions[index];

            // Deteta quão perto a câmara está do ecrã em questão
            const dist = Math.abs(currentX - pos.x) + Math.abs(currentY - pos.y);
            const text = screen.querySelector('.reveal-text');

            if (text) {
                if (dist < 0.4) text.classList.add('is-visible');
                else text.classList.remove('is-visible');
            }
        });
    }

    // 3. ANIMAÇÃO DE FLUIDEZ E RENDERIZAÇÃO
    function animateCamera() {
        // Dá aquele aspeto de câmara profissional e suave
        currentX += (targetX - currentX) * 0.08;
        currentY += (targetY - currentY) * 0.08;

        // Passa a localização para o CSS puxar o mapa
        root.style.setProperty('--cam-x', currentX);
        root.style.setProperty('--cam-y', currentY);

        checkVisibility();

        requestAnimationFrame(animateCamera);
    }

    // Arranca o sistema
    animateCamera();
});