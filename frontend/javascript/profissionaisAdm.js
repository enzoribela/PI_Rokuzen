// O listener 'DOMContentLoaded' garante que o script roda assim que o HTML é totalmente carregado
document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. Seleção de Elementos usando as classes do seu HTML ---
    const slides = document.querySelectorAll('.profissional-slide-adm');
    
    // Seleciona todos os botões de navegação, usando as classes que estão no seu HTML
    const allPrevButtons = document.querySelectorAll('.carrossel-button-adm.prev');
    const allNextButtons = document.querySelectorAll('.carrossel-button-adm.next');
    
    const agendaBody = document.getElementById('lista-agendamentos');
    const tituloAgenda = document.getElementById('titulo-agenda');
    
    // --- Verificações de Debug (CRUCIAIS) ---
    if (slides.length < 2) {
        console.error("ERRO [ADM-JS]: Apenas 1 ou 0 slides de profissional encontrados. Carrossel inoperante.");
        return;
    }
    if (allPrevButtons.length === 0 || allNextButtons.length === 0) {
        console.error("ERRO [ADM-JS]: Botões de navegação não encontrados. Verifique a classe 'carrossel-button-adm'.");
        return;
    }
    console.log("SUCESSO [ADM-JS]: Script carregado. Slides encontrados:", slides.length);
    // ------------------------------------------

    let currentSlideIndex = 0; 

    // --- Lógica de Agenda (Simulação) ---
    const dadosAgenda = {
        'joao': [
            { horario: "08:00 - 09:00", sala: "Sala 1", paciente: "Ana Ferreira", livre: false },
            // ... (restante dos dados)
        ],
        'maria': [
            { horario: "09:00 - 10:00", sala: "Sala 5", paciente: "**LIVRE**", livre: true },
            // ... (restante dos dados)
        ]
    };
    
    function updateAgenda(profissionalId) {
        // ... (lógica de atualização da agenda) ...
        const agenda = dadosAgenda[profissionalId] || [];
        let novaAgendaHTML = '';
        const nomeProfissional = slides[currentSlideIndex].querySelector('.profissional-nome-adm').textContent;
        const dataExibida = tituloAgenda ? tituloAgenda.textContent.split(' ').slice(-1)[0] : '11/11/2025';

        if (tituloAgenda) {
            tituloAgenda.textContent = `Agenda de ${nomeProfissional} para ${dataExibida}`;
        }
        
        agenda.forEach(item => {
            const classeLivre = item.livre ? 'horario-livre' : ''; 
            novaAgendaHTML += `<tr class="${classeLivre}"><td>${item.horario}</td><td>${item.sala}</td><td>${item.paciente}</td></tr>`;
        });
        
        if (agendaBody) {
             agendaBody.innerHTML = novaAgendaHTML || `<tr><td colspan="3">Nenhum agendamento para ${nomeProfissional}.</td></tr>`;
        }
    }


    // --- 4. Função de Controle do Carrossel (Visibilidade) ---
    function updateCarousel() {
        slides.forEach((slide, index) => {
            if (index === currentSlideIndex) {
                slide.style.display = 'block'; 
                slide.classList.add('active');
                
                const profissionalId = slide.getAttribute('data-id');
                updateAgenda(profissionalId); 
            } else {
                slide.style.display = 'none'; 
                slide.classList.remove('active');
            }
        });
    }

    // --- 5. Event Listeners ---
    
    // Adiciona evento a TODOS os botões "Próximo"
    allNextButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation(); 
            
            // Troca para o próximo slide, ou volta para o 0
            currentSlideIndex = (currentSlideIndex < slides.length - 1) ? currentSlideIndex + 1 : 0;
            updateCarousel();
        });
    });

    // Adiciona evento a TODOS os botões "Anterior"
    allPrevButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation(); 
            
            // Troca para o slide anterior, ou vai para o último
            currentSlideIndex = (currentSlideIndex > 0) ? currentSlideIndex - 1 : slides.length - 1;
            updateCarousel();
        });
    });

    // --- 6. Inicialização ---
    // Encontra o slide inicial (que tem 'active' no HTML)
    const initialActiveSlide = document.querySelector('.profissional-slide-adm.active');
    if (initialActiveSlide) {
        currentSlideIndex = Array.from(slides).indexOf(initialActiveSlide);
    }
    
    updateCarousel();

});