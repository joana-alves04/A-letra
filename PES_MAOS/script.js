document.addEventListener("DOMContentLoaded", () => {
    const root = document.documentElement;
    const screens = document.querySelectorAll('.screen');
    const pes = document.querySelectorAll('.pe');
    const maos = document.querySelectorAll('.mao');

    // O progresso total do mapa (de 0.0 a 1.0)
    let targetProgress = 0;
    let currentProgress = 0;

    // A maldição: começa a Falso (direção normal)
    let isInverted = false;

    // ── 1. CLICAR NAS PEGADAS (Avançar ou Recuar) ──
    pes.forEach(pe => {
        pe.addEventListener('click', () => {
            // Se estiver invertido, andar nos pés empurra-te para trás!
            if (isInverted) {
                targetProgress -= 0.08;
            } else {
                targetProgress += 0.08;
            }

            // Limites de segurança do mapa (não deixa passar do fim nem antes do início)
            if (targetProgress > 1) targetProgress = 1;
            if (targetProgress < 0) targetProgress = 0;
        });
    });

    // ── 2. CLICAR NA MÃO (A Maldição invisível) ──
    maos.forEach(mao => {
        mao.addEventListener('click', () => {
            // Apenas inverte o sentido! Não mexe a câmara na hora.
            // O utilizador só descobre quando clicar no próximo pé.
            isInverted = !isInverted;
        });
    });

    // Variáveis para a posição da câmara
    let currentX = 0;
    let currentY = 0;
    let targetX = 0;
    let targetY = 0;

    // ── 3. MOTOR DA CÂMARA (Limpo e elegante) ──
    function animate() {
        // Interpolação suave do progresso do clique
        currentProgress += (targetProgress - currentProgress) * 0.08;

        // Mapeia o Progresso (0 a 1) para a posição da câmara (X, Y)
        if (currentProgress <= 0.33) {
            targetX = currentProgress / 0.33;
            targetY = 0;
        } else if (currentProgress <= 0.66) {
            targetX = 1;
            targetY = (currentProgress - 0.33) / 0.33;
        } else {
            targetX = 1 + ((currentProgress - 0.66) / 0.34);
            targetY = 1;
        }

        // Movimento sedoso da câmara (Efeito Cinematográfico)
        currentX += (targetX - currentX) * 0.1;
        currentY += (targetY - currentY) * 0.1;

        // Injeta os valores no CSS para mover o Mapa Gigante
        root.style.setProperty('--cam-x', currentX);
        root.style.setProperty('--cam-y', currentY);

        // Mostrar os textos quando a câmara se aproxima
        screens.forEach((screen, index) => {
            const anchorX = [0, 1, 1, 2][index];
            const anchorY = [0, 0, 1, 1][index];
            const dist = Math.abs(currentX - anchorX) + Math.abs(currentY - anchorY);

            const text = screen.querySelector('.reveal-text');
            if (text) {
                if (dist < 0.4) text.classList.add('is-visible');
                else text.classList.remove('is-visible');
            }
        });

        // Loop contínuo
        requestAnimationFrame(animate);
    }

    // Arranca o sistema
    animate();
});