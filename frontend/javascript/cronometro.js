// Variáveis globais para controlar o estado do cronômetro
let timer; // Variável para armazenar o ID do setInterval
let segundosRestantes = 0; // Armazena o tempo total em segundos

// Variável para acessar o novo elemento de visor (Certifique-se que o ID no HTML é 'visorCronometroFunc')
const visor = document.getElementById('visorCronometroFunc');

// Variável para acessar o formulário (Certifique-se que o ID no HTML é 'minutagemFunc')
const formElement = document.getElementById('minutagemFunc');


// 1. Converte Horas, Minutos e Segundos para Segundos Totais
function calcularSegundos() {
    // Busca os valores dos campos de input pelo atributo 'name' ('hr', 'min', 'sec')
    const horas = parseInt(formElement.elements['hr'].value) || 0;
    const minutos = parseInt(formElement.elements['min'].value) || 0;
    const segundos = parseInt(formElement.elements['sec'].value) || 0;

    // Calcula o total em segundos
    return (horas * 3600) + (minutos * 60) + segundos;
}

// 2. Formata o tempo e EXIBE NO VISOR (#visorCronometroFunc)
function atualizarDisplay(totalSegundos) {
    const horas = Math.floor(totalSegundos / 3600);
    const minutos = Math.floor((totalSegundos % 3600) / 60);
    const segundos = totalSegundos % 60;

    // Formata para 2 dígitos (00:00:00)
    const displayHoras = horas.toString().padStart(2, '0');
    const displayMinutos = minutos.toString().padStart(2, '0');
    const displaySegundos = segundos.toString().padStart(2, '0');

    // Exibe o tempo no formato HH:MM:SS no visor
    if (visor) {
        visor.textContent = `${displayHoras}:${displayMinutos}:${displaySegundos}`;
    }
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

// --- Funções Chamadas pelos Botões ---

/**
 * Funções que alteram o estado do cronômetro
 * O botão "Iniciar" agora serve como "Iniciar" ou "Continuar".
 * Ele nunca reinicia o cronômetro se ele já estiver ativo.
 */

// Iniciar/Continuar (onclick="iniciarTimer()")
function iniciarTimer() {
    // 1. Se o timer já estiver rodando, IGNORA o clique. (Impede o reinício)
    if (timer) {
        return; 
    }

    // 2. Se o timer estiver parado e houver tempo restante, CONTINUA.
    if (!timer && segundosRestantes > 0) {
        continuarTimer(); // Usa a lógica auxiliar para continuar
        return;
    }

    // 3. Se o timer estiver parado E zerado (segundosRestantes === 0), INICIA.
    if (!timer && segundosRestantes === 0) {
        
        const novoTempo = calcularSegundos();

        if (novoTempo > 0) {
            segundosRestantes = novoTempo;

            // Inicializa o visor com o tempo configurado
            atualizarDisplay(segundosRestantes); 

            // Inicia o timer
            timer = setInterval(contagemRegressiva, 1000);
            
            // Desabilita os campos de input (assumindo que todos têm a classe 'cronometro')
            document.querySelectorAll('.cronometro').forEach(input => {
                input.disabled = true;
            });
        } else {
            alert("Por favor, configure um tempo maior que zero para iniciar.");
        }
    }
}

// Pausar (onclick="pause()")
function pause() {
    if (timer) {
        clearInterval(timer); 
        timer = null; // Indica que o timer parou, mas há tempo restante
        
        // Reabilita os campos de input
        document.querySelectorAll('.cronometro').forEach(input => {
            input.disabled = false;
        });
    }
}

// Continuar (Função auxiliar, usada internamente por iniciarTimer)
function continuarTimer() {
    // Só continua se estiver pausado (timer é null) e houver tempo
    if (!timer && segundosRestantes > 0) {
        timer = setInterval(contagemRegressiva, 1000);
        
        // Desabilita os campos de input
        document.querySelectorAll('.cronometro').forEach(input => {
            input.disabled = true;
        });
    }
}

// Cancelar/Zerar (onclick="cancelarTimer()")
function cancelarTimer() {
    pause(); // Garante que o setInterval seja parado, e reabilita os inputs
    segundosRestantes = 0; 
    
    // Zera o visor
    atualizarDisplay(0); 

    // Limpa os inputs 
    if(formElement) {
        formElement.elements['hr'].value = '';
        formElement.elements['min'].value = '';
        formElement.elements['sec'].value = '';
    }
    
    // Reabilita os campos de input (necessário novamente, caso pause() não tenha sido chamado antes)
    document.querySelectorAll('.cronometro').forEach(input => {
        input.disabled = false;
    });
}

// Inicialização: Garante que o visor e os inputs sejam limpos ao carregar a página
document.addEventListener('DOMContentLoaded', () => {
    cancelarTimer(); 
});