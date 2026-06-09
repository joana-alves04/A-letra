function iniciarJogoBrasas() {
    const pageContainer = document.getElementById('jogo-brasas-container');
    const canvas = document.getElementById('tela-brasas');
    const textoAlvo = document.getElementById('texto-alvo');
    const instrucao = document.getElementById('instrucao-texto');
    const botoes = document.getElementById('botoes-finais');

    if (!pageContainer || !canvas || !textoAlvo) return;

    const ctx = canvas.getContext('2d');
    let particulas = [];

    let calor = 0; // Vai de 0 a 100
    let jogoGanho = false;
    let ultimoX = 0;
    let ultimoY = 0;

    function redimensionar() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    redimensionar();
    window.addEventListener('resize', redimensionar);

    // Motor de Partículas (Faíscas e Zzzs)
    class Brasa {
        constructor(x, y, velocidadeExtra = 0, eSilencioso = false) {
            this.x = x;
            this.y = y;
            this.vida = 1;

            if (eSilencioso) {
                // Os Zzz sobem muito suavemente
                this.velocidadeX = (Math.random() - 0.5) * 0.5;
                this.velocidadeY = (Math.random() * -1) - 0.5;
                this.tipo = 'zzz';
            } else {
                // Faíscas caóticas
                this.velocidadeX = (Math.random() - 0.5) * (2 + velocidadeExtra);
                this.velocidadeY = (Math.random() * -2) - 0.5 - (velocidadeExtra * 0.5);
                this.tipo = 'brasa';
            }

            if (this.tipo === 'brasa') {
                this.tamanho = Math.random() * 5 + 2;
                const cores = ['#ff4500', '#ff8c00', '#ffd700'];
                this.cor = cores[Math.floor(Math.random() * cores.length)];
            } else {
                this.texto = 'Zzz';
                this.tamanho = Math.random() * 15 + 20;
                this.cor = '#ffd700';
            }
        }

        atualizar() {
            this.x += this.velocidadeX;
            this.y += this.velocidadeY;
            this.vida -= 0.012;
            if (this.tipo === 'brasa') this.tamanho *= 0.96;
        }

        desenhar() {
            ctx.globalAlpha = Math.max(this.vida, 0);
            ctx.fillStyle = this.cor;
            ctx.shadowBlur = this.tipo === 'brasa' ? 10 : 15;
            ctx.shadowColor = this.cor;

            if (this.tipo === 'brasa') {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.tamanho, 0, Math.PI * 2);
                ctx.fill();
            } else {
                ctx.font = `bold ${this.tamanho}px 'Baloo 2', sans-serif`;
                ctx.fillText(this.texto, this.x, this.y);
            }
        }
    }

    function interagir(clientX, clientY) {
        let velocidadeMovimento = Math.abs(clientX - ultimoX) + Math.abs(clientY - ultimoY);
        ultimoX = clientX;
        ultimoY = clientY;

        let velLimitada = Math.min(velocidadeMovimento, 100);

        // Geração de partículas de fogo
        const qtd = jogoGanho ? 1 : Math.ceil(velLimitada / 15);
        for (let i = 0; i < qtd; i++) {
            particulas.push(new Brasa(clientX, clientY, velLimitada / 10, false));
        }

        if (!jogoGanho) {
            calor += (velLimitada * 0.04);
            if (calor > 100) calor = 100;
        }
    }

    pageContainer.onmousemove = (e) => interagir(e.clientX, e.clientY);
    pageContainer.ontouchmove = (e) => {
        interagir(e.touches[0].clientX, e.touches[0].clientY);
        e.preventDefault();
    };

    function loopJogo() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        for (let i = 0; i < particulas.length; i++) {
            particulas[i].atualizar();
            particulas[i].desenhar();
            if (particulas[i].vida <= 0 || (particulas[i].tipo === 'brasa' && particulas[i].tamanho <= 0.3)) {
                particulas.splice(i, 1);
                i--;
            }
        }

        if (!jogoGanho) {
            // Condição de Vitória
            if (calor >= 100) {
                jogoGanho = true;

                // Tranca as letras no estado incandescente
                textoAlvo.classList.add('incandescente');
                instrucao.style.display = 'none'; // Some com as instruções
                botoes.classList.remove('escondido'); // Mostra os botões

                // Explosão de fogo comemorativa
                for (let i = 0; i < 40; i++) {
                    const px = (window.innerWidth * 0.3) + (Math.random() * window.innerWidth * 0.4);
                    const py = (window.innerHeight * 0.4) + (Math.random() * window.innerHeight * 0.2);
                    particulas.push(new Brasa(px, py, 6, false));
                }
            } else {
                // Arrefecimento contínuo
                calor -= 0.2;
                if (calor < 0) calor = 0;

                // INJETA O CALOR DIRETAMENTE NO CSS (Escala 0.0 a 1.0)
                pageContainer.style.setProperty('--calor', calor / 100);
            }
        } else {
            // Quando ganha, liberta "Zzz" aleatórios do fundo para simular a sesta
            if (Math.random() > 0.95) {
                particulas.push(new Brasa(Math.random() * canvas.width, canvas.height + 20, 0, true));
            }
            // Pequenas brasas residuais
            if (Math.random() > 0.8) {
                particulas.push(new Brasa(Math.random() * canvas.width, canvas.height + 20, 0, false));
            }
        }

        requestAnimationFrame(loopJogo);
    }

    loopJogo();
}

if (document.readyState === 'complete') iniciarJogoBrasas();
else window.addEventListener('load', iniciarJogoBrasas);

const obsBrasas = new MutationObserver(() => {
    if (document.getElementById('tela-brasas')) {
        iniciarJogoBrasas();
        obsBrasas.disconnect();
    }
});
obsBrasas.observe(document.body, { childList: true, subtree: true });