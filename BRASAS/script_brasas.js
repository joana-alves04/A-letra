function iniciarBrasas() {
    const container = document.getElementById('scroll-brasas');
    const cima = document.getElementById('palpebra-cima');
    const baixo = document.getElementById('palpebra-baixo');
    const zzzContainer = document.getElementById('zzz-container');
    
    if (!container || !cima || !baixo) return;

    container.onscroll = () => {
        // Cálculo de progresso protegido contra NaN
        const maxScroll = (container.scrollHeight - container.clientHeight) || 1;
        const progress = Math.min(Math.max(container.scrollTop / maxScroll, 0), 1);

        // Movimento das pálpebras
        const offset = 100 - (progress * 100);
        cima.style.transform = `translateY(-${offset}%)`;
        baixo.style.transform = `translateY(${offset}%)`;
        
        // Geração dinâmica de Zzzs
        if (progress > 0.5 && Math.random() > 0.9) {
            const z = document.createElement('div');
            z.className = 'zzz';
            z.innerText = 'Zzz';
            z.style.left = (40 + Math.random() * 20) + '%';
            z.style.top = (40 + Math.random() * 20) + '%';
            zzzContainer.appendChild(z);
            setTimeout(() => z.remove(), 3000);
        }
    };
}

// Inicialização robusta para evitar F5
if (document.readyState === 'complete') {
    iniciarBrasas();
} else {
    window.addEventListener('load', iniciarBrasas);
}

const observer = new MutationObserver(() => {
    if (document.getElementById('scroll-brasas')) {
        iniciarBrasas();
        observer.disconnect();
    }
});
observer.observe(document.body, { childList: true, subtree: true });