document.addEventListener("DOMContentLoaded", () => {

    window.history.scrollRestoration = 'manual';
    const scrollContainer = document.getElementById('scroll-narrativa');
    if (scrollContainer) scrollContainer.scrollTo(0, 0);

    const root = document.documentElement;
    const btnEncher = document.getElementById('btn-encher');
    const divAgua = document.getElementById('agua');
    const feedbackOverlay = document.getElementById('feedback-overlay');
    const tituloFinal = document.getElementById('feedback-titulo');
    const textoFinal = document.getElementById('feedback-texto');

    const btnTentar = document.getElementById('btn-tentar-novamente');
    const containerVitoria = document.getElementById('botoes-vitoria');

    let nivelAgua = 0;
    let aEncher = false;
    let jogoTerminado = false;
    let frameId;

    // --- FÍSICA --- //
    const VELOCIDADE = 0.55;
    const ZONA_RESVES_MIN = 65;
    const ZONA_RESVES_MAX = 75;
    // -------------- //

    const textosTremor = document.querySelectorAll('.texto-tremor');

    scrollContainer.addEventListener('scroll', () => {
        const scrollTotal = scrollContainer.scrollHeight - scrollContainer.clientHeight;
        const progresso = scrollContainer.scrollTop / scrollTotal;

        const intensidade = Math.max(0, (progresso - 0.2) * 5);
        root.style.setProperty('--intensidade-tremor', `${intensidade}px`);

        textosTremor.forEach(texto => {
            if (progresso > 0.1) texto.classList.add('a-tremer');
            else texto.classList.remove('a-tremer');
        });
    });

    function iniciarJogo() {
        nivelAgua = 0;
        aEncher = false;
        jogoTerminado = false;

        // Reset Visual
        divAgua.style.height = '0%';
        document.body.classList.remove('inundou', 'shake', 'vitoria');
        feedbackOverlay.classList.add('escondido');

        btnTentar.classList.add('escondido');
        containerVitoria.classList.add('escondido');

        btnEncher.style.filter = "none";
        btnEncher.innerText = "PRESSIONA E MANTÉM";
    }

    function começarAEncher(e) {
        if (e.type === 'touchstart') e.preventDefault();
        if (jogoTerminado) return;

        aEncher = true;
        btnEncher.style.filter = "brightness(0.8)";

        if (!frameId) animarAgua();
    }

    function pararDeEncher(e) {
        if (!aEncher || jogoTerminado) return;

        aEncher = false;
        cancelAnimationFrame(frameId);
        frameId = null;

        avaliarResultado();
    }

    function animarAgua() {
        if (!aEncher) return;

        nivelAgua += VELOCIDADE;

        // Atualiza fisicamente a altura da barra da água
        divAgua.style.height = nivelAgua + '%';

        // Tensão Dinâmica
        if (nivelAgua > 30 && nivelAgua < (ZONA_RESVES_MIN - 10)) btnEncher.innerText = "O MAREMOTO SOBE...";
        if (nivelAgua >= (ZONA_RESVES_MIN - 10) && nivelAgua < ZONA_RESVES_MIN) btnEncher.innerText = "QUASE LÁ...";
        if (nivelAgua >= ZONA_RESVES_MIN) btnEncher.innerText = "CUIDADO!";

        // Se passar a linha tracejada = Derrota
        if (nivelAgua > ZONA_RESVES_MAX) {
            nivelAgua = 100;
            divAgua.style.height = '100%';
            aEncher = false;
            inundarCidade();
            return;
        }

        frameId = requestAnimationFrame(animarAgua);
    }

    function avaliarResultado() {
        jogoTerminado = true;
        btnEncher.innerText = "A ÁGUA PAROU";

        if (nivelAgua < ZONA_RESVES_MIN) {
            mostrarFeedback(
                "Longe do Limite",
                "Largaste muito cedo. A água nem chegou à margem. Foste demasiado prudente!",
                false
            );
        } else if (nivelAgua >= ZONA_RESVES_MIN && nivelAgua <= ZONA_RESVES_MAX) {
            document.body.classList.add('vitoria'); // Aciona a cor verde
            mostrarFeedback(
                "Resvés Campo de Ourique!",
                "Tensão brutal! O maremoto parou milímetros antes de engolir a cúpula.",
                true
            );
        }
    }

    function inundarCidade() {
        jogoTerminado = true;
        document.body.classList.add('inundou', 'shake');

        setTimeout(() => {
            mostrarFeedback(
                "O Edifício Foi Engolido!",
                "Seguraste demasiado tempo. O maremoto engoliu a cidade.",
                false
            );
            document.body.classList.remove('shake');
        }, 500);
    }

    function mostrarFeedback(titulo, texto, vitoria) {
        tituloFinal.innerText = titulo;
        textoFinal.innerText = texto;

        if (vitoria) {
            containerVitoria.classList.remove('escondido');
        } else {
            btnTentar.classList.remove('escondido');
        }

        setTimeout(() => {
            feedbackOverlay.classList.remove('escondido');
        }, 300);
    }

    // Eventos
    btnEncher.addEventListener('mousedown', começarAEncher);
    window.addEventListener('mouseup', pararDeEncher);
    btnEncher.addEventListener('touchstart', começarAEncher, { passive: false });
    window.addEventListener('touchend', pararDeEncher);
    btnTentar.addEventListener('click', iniciarJogo);
});

// ================================================================== 
// LÓGICA DA PÁGINA "SOBRE A EXPRESSÃO" (ACORDEÃO DE ÁGUA)
// ================================================================== 
document.addEventListener('DOMContentLoaded', () => {
    const accordions = document.querySelectorAll('.accordion-item');
    if (accordions.length === 0) return;

    accordions.forEach(acc => {
        const header = acc.querySelector('.accordion-header');
        
        header.addEventListener('click', (e) => {
            e.preventDefault();
            
            const isOpen = acc.classList.contains('active');

            // 1. Fecha todos os separadores
            accordions.forEach(other => {
                other.classList.remove('active');
            });

            // 2. Se clicaste num que estava fechado, abre-o e foca a câmara
            if (!isOpen) {
                acc.classList.add('active');

                // A MAGIA DO FOCO SUAVE:
                // Esperamos 400ms (o exato momento em que a onda do separador antigo 
                // acaba de subir e a caixa começa a encolher).
                setTimeout(() => {
                    // Calcula a posição exata da caixa e dá 100px de margem no topo 
                    // para o botão não ficar colado ao limite do monitor.
                    const posicaoCaixa = acc.getBoundingClientRect().top + window.scrollY;
                    
                    window.scrollTo({
                        top: posicaoCaixa - 100, 
                        behavior: 'smooth'
                    });
                }, 400);
            }
        });
    });
});