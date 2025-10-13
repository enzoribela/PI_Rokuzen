// Variáveis globais para controlar o estado do cronômetro
let tempoRestante = 0; // Armazena o tempo total em segundos
let intervalId = null; // Armazena o ID do setInterval para podermos pausar/cancelar

// Seleciona os elementos da página que vamos manipular
const displayElement = document.getElementById('demo');
const formElement = document.getElementById('cronometro');

/**
 * Função principal que inicia uma nova contagem.
 * Lê os valores do formulário, calcula o total de segundos e dispara o contador.
 */
function iniciarTimer() {
    // Para qualquer cronômetro que já esteja em execução
    clearInterval(intervalId);

    // Pega os valores dos inputs, tratando campos vazios como 0
    const horas = parseInt(formElement.elements['hr'].value) || 0;
    const minutos = parseInt(formElement.elements['min'].value) || 0;
    const segundos = parseInt(formElement.elements['sec'].value) || 0;

    // Calcula o tempo total em segundos
    tempoRestante = (horas * 3600) + (minutos * 60) + segundos;

    // Inicia o contador apenas se o tempo for maior que zero
    if (tempoRestante > 0) {
        atualizarVisor(); // Mostra o tempo inicial imediatamente
        intervalId = setInterval(tick, 1000); // A cada 1 segundo, chama a função tick
    } else {
        // Se o tempo for 0, apenas mostra 00:00:00
        tempoRestante = 0;
        atualizarVisor();
    }
}

/**
 * Pausa a contagem do tempo.
 */
function pause() {
    clearInterval(intervalId);
    intervalId = null; // Define como nulo para sabermos que está pausado
}

/**
 * Continua uma contagem que foi pausada.
 */
function continuarTimer() {
    // Só continua se houver tempo restante E se o timer não estiver rodando
    if (tempoRestante > 0 && !intervalId) {
        intervalId = setInterval(tick, 1000);
    }
}

/**
 * Cancela a contagem, zerando o tempo e o visor.
 */
function cancelarTimer() {
    clearInterval(intervalId);
    intervalId = null;
    tempoRestante = 0;
    formElement.reset(); // Limpa os campos do formulário (horas, minutos, segundos)
    displayElement.textContent = "Configure o tempo e inicie."; // Restaura a mensagem inicial
}

/**
 * Função executada a cada segundo pelo setInterval.
 * Ela decrementa o tempo e atualiza o visor.
 */
function tick() {
    if (tempoRestante > 0) {
        tempoRestante--;
        atualizarVisor();
    } else {
        // Quando o tempo chega a zero
        clearInterval(intervalId);
        intervalId = null;
        displayElement.textContent = "Tempo Esgotado!";
    }
}

/**
 * Formata os números e atualiza o H1 com o tempo restante.
 */
function atualizarVisor() {
    // Garante que o tempo nunca seja negativo
    const tempoAtual = Math.max(0, tempoRestante);
    
    // Calcula horas, minutos e segundos a partir do total de segundos
    const horas = Math.floor(tempoAtual / 3600);
    const minutos = Math.floor((tempoAtual % 3600) / 60);
    const segundos = tempoAtual % 60;

    // Formata os números para sempre terem dois dígitos (ex: 07, 12)
    const horasFormatadas = String(horas).padStart(2, '0');
    const minutosFormatados = String(minutos).padStart(2, '0');
    const segundosFormatados = String(segundos).padStart(2, '0');
    
    // Atualiza o texto na tela
    displayElement.textContent = `${horasFormatadas}:${minutosFormatados}:${segundosFormatados}`;
}