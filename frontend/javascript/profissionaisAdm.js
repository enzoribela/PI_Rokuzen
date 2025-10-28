document.addEventListener('DOMContentLoaded', () => {
    // Seletores do Carrossel
    const carrosselSlides = document.querySelector('.carrossel-slides');
    // Seleciona todos os cards, independente de estarem visíveis
    const slides = document.querySelectorAll('.card-profissional');
    // Seleciona todos os botões "próximo" e "anterior"
    const prevButtons = document.querySelectorAll('.carrossel-button.prev');
    const nextButtons = document.querySelectorAll('.carrossel-button.next');
    
    // Selecionador do botão Continuar
    //const btnContinuar = document.querySelector('.btn-continuar');
    // URL de destino
    //const proximaURL = 'confirmacao.html';

    let currentSlide = 0;

    // Função principal para mover o carrossel
    function updateCarrossel() {
        // Pega a largura do primeiro slide para calcular o deslocamento
        const slideWidth = slides[0].offsetWidth;
        const offset = slideWidth * currentSlide;

        // Move o contêiner de slides
        carrosselSlides.style.transform = `translateX(-${offset}px)`;

        // Atualiza o estado dos botões (habilitado/desabilitado)
        // Como temos vários botões (um em cada slide), precisamos iterar sobre eles
        prevButtons.forEach(button => {
            button.disabled = currentSlide === 0;
        });

        nextButtons.forEach(button => {
            button.disabled = currentSlide === slides.length - 1;
        });
    }

    // Adiciona evento aos botões "Próximo"
    nextButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            // Previne que o clique dispare eventos indesejados no elemento pai
            e.stopPropagation();
            if (currentSlide < slides.length - 1) {
                currentSlide++;
                updateCarrossel();
            }
        });
    });

    // Adiciona evento aos botões "Anterior"
    prevButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.stopPropagation();
            if (currentSlide > 0) {
                currentSlide--;
                updateCarrossel();
            }
        });
    });

    // ***********************************************
    // CÓDIGO PARA O BOTÃO CONTINUAR
    // ***********************************************
    if (btnContinuar) {
        btnContinuar.addEventListener('click', () => {
            // Redireciona o usuário para a URL definida (confirmacao.html)
            window.location.href = proximaURL;
        });
    }
    // ***********************************************

    // Recalcula a posição em caso de redimensionamento da janela
    window.addEventListener('resize', updateCarrossel);

    // Inicializa o carrossel na posição 0
    updateCarrossel();
});