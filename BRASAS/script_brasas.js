if (!window.jogoBrasasIniciado) {
    window.jogoBrasasIniciado = true;

    function iniciarJogoBrasas() {
        const container = document.getElementById('jogo-brasas-container');
        if (!container) return;

        container.classList.remove('fase-dormir');
        container.classList.remove('fase-acordar');

        const scrollContainer = container.querySelector('#scroll-narrativa');
        const canvas = container.querySelector('#tela-brasas');
        const lareiraInterativa = container.querySelector('#lareira-interativa');
        const btnAcordar = container.querySelector('#btn-acordar-meio');

        if (!canvas || !scrollContainer || !lareiraInterativa) return;

        const ctx = canvas.getContext('2d');
        let particulas = [];
        let sono = 0;

        let estadoAtivo = "NORMAL";
        let chegouASala = false;
        let isHoveringLareira = false;
        let ultimoX = 0;
        let ultimoY = 0;

        function redimensionar() {
            if (!document.body.contains(container)) return;
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }
        redimensionar();
        window.addEventListener('resize', redimensionar);

        // Hover Puro
        lareiraInterativa.addEventListener('mouseenter', () => { isHoveringLareira = true; });
        lareiraInterativa.addEventListener('mouseleave', () => { isHoveringLareira = false; });

        // Clique em Acordar
        if (btnAcordar) {
            btnAcordar.addEventListener('click', () => {
                estadoAtivo = "ACORDOU";
                container.classList.remove('fase-dormir');
                container.classList.add('fase-acordar');
                container.style.setProperty('--sono', 0);
            });
        }

        // Scroll
        scrollContainer.addEventListener('scroll', () => {
            if (estadoAtivo !== "NORMAL") return;
            const maxScroll = (scrollContainer.scrollHeight - scrollContainer.clientHeight) || 1;
            const progressoScroll = Math.min(Math.max(scrollContainer.scrollTop / maxScroll, 0), 1);

            let r, g, b;
            if (progressoScroll < 0.33) {
                const p = progressoScroll / 0.33;
                r = 135 + p * (240 - 135); g = 206 - p * (206 - 130); b = 235 - p * (235 - 50);
            } else if (progressoScroll < 0.66) {
                const p = (progressoScroll - 0.33) / 0.33;
                r = 240 - p * (240 - 70); g = 130 - p * (130 - 35); b = 50 + p * (110 - 50);
            } else {
                const p = (progressoScroll - 0.66) / 0.34;
                r = 70 - p * (70 - 15); g = 35 - p * (35 - 12); b = 110 - p * (110 - 10);
            }

            container.style.setProperty('--bg-r', Math.floor(r));
            container.style.setProperty('--bg-g', Math.floor(g));
            container.style.setProperty('--bg-b', Math.floor(b));

            if (progressoScroll > 0.95) chegouASala = true;
            else chegouASala = false;
        });

        class Brasa {
            constructor(x, y, velocidadeExtra = 0) {
                this.x = x; this.y = y; this.vida = 1;
                this.velocidadeX = (Math.random() - 0.5) * (1.5 + velocidadeExtra);
                this.velocidadeY = (Math.random() * -3) - 0.5 - (velocidadeExtra * 0.5);

                this.isZzz = (estadoAtivo === "DORMIU") && Math.random() > 0.85 && velocidadeExtra === 0;

                if (this.isZzz) {
                    this.texto = 'Zzz'; this.tamanho = Math.random() * 20 + 15; this.cor = '#ffd700';
                } else {
                    this.tamanho = Math.random() * 5 + 3.5;
                    const cores = ['#ff4500', '#ff8c00', '#ffd700'];
                    this.cor = cores[Math.floor(Math.random() * cores.length)];
                }
            }
            atualizar() {
                this.x += this.velocidadeX; this.y += this.velocidadeY;
                this.vida -= 0.012; if (!this.isZzz) this.tamanho *= 0.96;
            }
            desenhar() {
                ctx.globalAlpha = Math.max(this.vida, 0);
                ctx.fillStyle = this.cor;
                ctx.shadowBlur = this.isZzz ? 20 : 10;
                ctx.shadowColor = this.cor;
                if (this.isZzz) {
                    ctx.font = `bold ${this.tamanho}px 'Baloo 2', sans-serif`;
                    ctx.fillText(this.texto, this.x, this.y);
                } else {
                    ctx.beginPath(); ctx.arc(this.x, this.y, this.tamanho, 0, Math.PI * 2); ctx.fill();
                }
            }
        }

        function interagir(clientX, clientY) {
            if (!chegouASala) return;

            let velocidadeMovimento = Math.abs(clientX - ultimoX) + Math.abs(clientY - ultimoY);
            ultimoX = clientX; ultimoY = clientY;

            let velLimitada = Math.min(velocidadeMovimento, 100);
            if (velLimitada < 4) return;

            const qtd = Math.ceil(velLimitada / 16);
            for (let i = 0; i < qtd; i++) {
                particulas.push(new Brasa(clientX, clientY, velLimitada / 18));
            }

            if (estadoAtivo === "NORMAL") {
                const rect = lareiraInterativa.getBoundingClientRect();
                if (clientX >= rect.left && clientX <= rect.right &&
                    clientY >= rect.top && clientY <= rect.bottom) {

                    sono += (velLimitada * 0.06);
                    if (sono > 100) sono = 100;
                }
            }
        }

        window.addEventListener('mousemove', (e) => interagir(e.clientX, e.clientY));
        window.addEventListener('touchmove', (e) => interagir(e.touches[0].clientX, e.touches[0].clientY), { passive: true });

        function loopJogo() {
            if (!document.body.contains(container)) return;

            ctx.clearRect(0, 0, canvas.width, canvas.height);

            for (let i = 0; i < particulas.length; i++) {
                particulas[i].atualizar(); particulas[i].desenhar();
                if (particulas[i].vida <= 0 || (!particulas[i].isZzz && particulas[i].tamanho <= 0.3)) {
                    particulas.splice(i, 1); i--;
                }
            }

            if (estadoAtivo === "DORMIU") {
                if (Math.random() > 0.95) particulas.push(new Brasa(Math.random() * canvas.width, canvas.height + 20, 0));
                requestAnimationFrame(loopJogo);
                return;
            }

            if (estadoAtivo === "NORMAL" && chegouASala) {
                if (isHoveringLareira) {
                    sono += 0.5;
                    if (sono > 100) sono = 100;
                }

                container.style.setProperty('--sono', sono);

                if (sono >= 100) {
                    estadoAtivo = "DORMIU";
                    container.classList.add('fase-dormir');

                    scrollContainer.style.overflowY = 'hidden';
                    scrollContainer.scrollTop = scrollContainer.scrollHeight;
                }
            }

            requestAnimationFrame(loopJogo);
        }
        loopJogo();
    }

    if (document.readyState === 'complete') iniciarJogoBrasas();
    else window.addEventListener('load', iniciarJogoBrasas);

    const obsBrasas = new MutationObserver(() => {
        if (document.getElementById('tela-brasas')) iniciarJogoBrasas();
    });
    obsBrasas.observe(document.body, { childList: true, subtree: true });
}