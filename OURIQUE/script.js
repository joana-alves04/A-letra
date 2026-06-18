document.addEventListener("DOMContentLoaded", () => {
    // BUG FIX DE POSIÇÃO
    window.history.scrollRestoration = 'manual';
    window.scrollTo(0, 0);

    const ponteiro = document.getElementById('ponteiro');
    const btn = document.getElementById('btn-stop');
    const msg = document.getElementById('mensagem-final');
    const textoRes = document.getElementById('texto-res');

    let pos = 0;
    let direcao = 1; // 1 para direita, -1 para esquerda
    let jogoAtivo = true;

    // Loop do Ponteiro (O destino da cidade)
    const loop = setInterval(() => {
        if (!jogoAtivo) return clearInterval(loop);

        pos += direcao * 2;
        if (pos >= 95 || pos <= 0) direcao *= -1;
        ponteiro.style.left = pos + "%";
    }, 20);

    btn.addEventListener('click', () => {
        jogoAtivo = false;
        // Se estiver entre 85% e 95% (a zona do Resvés)
        if (pos >= 85 && pos <= 95) {
            textoRes.innerText = "Resvés! Paraste exatamente no limite.";
        } else {
            textoRes.innerText = "Passaste o limite... a cidade caiu.";
        }
        msg.classList.remove('hidden');
    });
});