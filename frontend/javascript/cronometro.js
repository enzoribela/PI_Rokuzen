var t = 0;
var per = 0;
var timerInterval = null;

/**
 * INICIAR / APLICAR MUDANÇAS
 * Sempre lê os valores do formulário, para qualquer timer existente
 * e inicia uma NOVA contagem.
 */
function iniciarTimer() {
    // 1. Para qualquer timer que esteja rodando ou pausado.
    clearInterval(timerInterval);
    timerInterval = null;

    // 2. Lê os valores ATUAIS do formulário.
    var x = document.getElementById("frm1");
    var hr = Number(x.elements[0].value) || 0;
    var min = Number(x.elements[1].value) || 0;
    var sec = Number(x.elements[2].value) || 0;

    // 3. Define o tempo com os novos valores.
    t = (hr * 3600) + (min * 60) + sec;
    per = t; // Atualiza o tempo inicial para a função de reset

    // 4. Inicia a contagem se o tempo for maior que zero.
    if (t > 0) {
        timer();
    } else {
        // Se o tempo for zero, limpa a tela.
        document.getElementById("demo").innerHTML = "0h : 00m : 00s";
    }
    
}

/**
 * CONTINUAR (RESUME)
 * Continua a contagem de onde parou, sem ler o formulário.
 */
function continuarTimer() {
    // Só faz algo se houver tempo no contador e se não estiver rodando.
    if (t > 0 && !timerInterval) {
        timer();
    }
}

/**
 * PAUSAR
 * Para a execução do timer.
 */
function pause() {
    clearInterval(timerInterval);
    timerInterval = null;
}

function cancelarTimer() {
    clearInterval(timerInterval);
    timerInterval = null;
    t = 0;
    document.getElementById("demo").innerHTML = "0h : 00m : 00s";
}


/**
 * Função principal do timer, chamada a cada segundo.
 */
function timer() {
    if (t < 0) {
        document.getElementById("demo").innerHTML = "TEMPO ESGOTADO";
        pause();
        t = 0;
        return;
    }

    var temp = t;
    t = t - 1;

    var h = Math.floor(temp / 3600);
    var m = Math.floor((temp % 3600) / 60);
    var s = temp % 60;

    m = checkTime(m);
    s = checkTime(s);

    document.getElementById("demo").innerHTML = h + "h : " + m + "m : " +s;
    timerInterval = setTimeout(timer, 1000);
}

function checkTime(i) {
    if (i < 10) { i = "0" + i; }
    return i;
}