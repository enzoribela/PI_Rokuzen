// Variáveis globais para controlar o estado do cronômetro
let timer; // Variável para armazenar o ID do setInterval
let segundosRestantes = 0; // Armazena o tempo total em segundos

// Variável para acessar o novo elemento de visor
const visor = document.getElementById('visorCronometroFunc');

// Variável para acessar o formulário
const formElement = document.getElementById('minutagemFunc');


// 1. Converte Horas, Minutos e Segundos para Segundos Totais
function calcularSegundos() {
    // Busca os valores dos campos de input pelo atributo 'name'
    const horas = parseInt(formElement.elements['hr'].value) || 0;
    const minutos = parseInt(formElement.elements['min'].value) || 0;
    const segundos = parseInt(formElement.elements['sec'].value) || 0;

    // Calcula o total em segundos
    return (horas * 3600) + (minutos * 60) + segundos;
}

// 2. Formata o tempo e EXIBE NO VISOR (#visorCronometro)
// 2. Formata o tempo e EXIBE NO VISOR (#visorCronometro)
function atualizarDisplay(totalSegundos) {
    const horas = Math.floor(totalSegundos / 3600);
    const minutos = Math.floor((totalSegundos % 3600) / 60);
    const segundos = totalSegundos % 60;

    // Formata para 2 dígitos (00:00:00)
    const displayHoras = horas.toString().padStart(2, '0');
    const displayMinutos = minutos.toString().padStart(2, '0');
    const displaySegundos = segundos.toString().padStart(2, '0');

    // Exibe o tempo no formato HH:MM:SS no novo visor
    if (visor) {
        visor.textContent = `${displayHoras}:${displayMinutos}:${displaySegundos}`;
    }
    
    // REMOVIDO: A parte que atualizava os inputs (formElement.elements['hr'].value = ...)
    // Os inputs AGORA SÓ SERÃO MANIPULADOS nas funções iniciarTimer e cancelarTimer.
}

// 3. Função principal do contador (chamada a cada segundo)
function contagemRegressiva() {
    if (segundosRestantes <= 0) {
        cancelarTimer();
        alert("O tempo do cronômetro acabou!");
        return;
    }

    segundosRestantes--;
    atualizarDisplay(segundosRestantes); 
}

// --- Funções Chamadas pelos Botões (do seu HTML) ---

// Iniciar/Reiniciar (onclick="iniciarTimer()")
function iniciarTimer() {
    if (timer) {
        clearInterval(timer);
    }

    // Pega o tempo digitado nos inputs
    segundosRestantes = calcularSegundos();

    if (segundosRestantes > 0) {
        // Inicializa o visor com o tempo configurado
        atualizarDisplay(segundosRestantes); 

        // Inicia o timer
        timer = setInterval(contagemRegressiva, 1000);
        
        // Desabilita os campos de input
        document.querySelectorAll('.cronometro').forEach(input => {
            input.disabled = true;
        });
    } else {
        alert("Por favor, configure um tempo maior que zero.");
    }
}

// Pausar (onclick="pause()")
function pause() {
    if (timer) {
        clearInterval(timer); 
        timer = null; 
        
        // Reabilita os campos de input para permitir ajuste
        document.querySelectorAll('.cronometro').forEach(input => {
            input.disabled = false;
        });
    }
}

// Continuar (onclick="continuarTimer()")
function continuarTimer() {
    if (!timer && segundosRestantes > 0) {
        // Continua a contagem a partir do tempo pausado
        timer = setInterval(contagemRegressiva, 1000);
        
        // Desabilita os campos de input
        document.querySelectorAll('.cronometro').forEach(input => {
            input.disabled = true;
        });
    } else if (!timer && segundosRestantes === 0) {
        // Se estava cancelado/zerado, inicia do zero (lê os inputs)
        iniciarTimer();
    }
}

// Cancelar/Zerar (onclick="cancelarTimer()")
function cancelarTimer() {
    pause(); 
    segundosRestantes = 0; 
    
    // Zera o visor e limpa os inputs
    atualizarDisplay(0); 

    // Limpa os inputs (deixa-os vazios)
    formElement.elements['hr'].value = '';
    formElement.elements['min'].value = '';
    formElement.elements['sec'].value = '';
    
    // Reabilita os campos de input
    document.querySelectorAll('.cronometro').forEach(input => {
        input.disabled = false;
    });
}

// Inicialização: Garante que o visor e os inputs sejam limpos ao carregar
document.addEventListener('DOMContentLoaded', () => {
    // Uma inicialização mais limpa (chama o cancelar que já limpa tudo)
    cancelarTimer(); 
});