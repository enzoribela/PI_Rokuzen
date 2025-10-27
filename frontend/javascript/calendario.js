document.addEventListener('DOMContentLoaded', () => {
  // ---------------------------------------------------------------------
  // 1. VARIÁVEIS DE CONTROLE
  // ---------------------------------------------------------------------
  const btnContinuar = document.querySelector('.btn-continuar');
  const proximaURL = 'telaProfissionais.html';

  // --- SOLUÇÃO ---

  // Função auxiliar para formatar a data de hoje no formato "d/m/Y"
  function getTodayFormatted() {
    const today = new Date();
    // O 'pt-BR' garante o formato dia/mês/ano
    return today.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  }

  // Inicializa a variável 'selectedDate' JÁ COM A DATA DE HOJE.
  let selectedDate = getTodayFormatted();

  // --- FIM DA SOLUÇÃO ---


  // ---------------------------------------------------------------------
  // 2. INICIALIZAÇÃO E CONFIGURAÇÃO DO FLATPICKR
  // ---------------------------------------------------------------------

  // Verifica se a função flatpickr existe
  if (typeof flatpickr === 'undefined') {
    console.error("ERRO: A biblioteca Flatpickr não foi carregada.");
    return;
  }

  flatpickr("#calendario-inline", {
    "locale": "pt",
    inline: true,
    dateFormat: "d/m/Y",
    defaultDate: "today", // Continua mostrando "hoje" visualmente
    minDate: "today",

    // 'onChange' agora só ATUALIZA a variável se o usuário mudar
    onChange: function (selectedDates, dateStr, instance) {
      selectedDate = dateStr;
    }
    // Não precisamos mais do 'onReady'
  });

  // ---------------------------------------------------------------------
  // 3. LÓGICA DO BOTÃO CONTINUAR
  // ---------------------------------------------------------------------

  if (!btnContinuar) {
    console.error("Erro: Botão com a classe '.btn-continuar' não encontrado.");
    return;
  }

  // --- MUDANÇA NA LÓGICA ---
  // O botão agora começa HABILITADO, pois 'selectedDate' já tem um valor.
  btnContinuar.disabled = false;
  btnContinuar.classList.add('active');
  // --- FIM DA MUDANÇA ---


  btnContinuar.addEventListener('click', (event) => {
    // Impede o comportamento padrão (como recarregar a página)
    event.preventDefault();

    // Esta verificação agora funciona imediatamente,
    // pois 'selectedDate' já contém a data de hoje.
    if (selectedDate && selectedDate.length > 0) {
      // REDIRECIONAMENTO
      window.location.href = proximaURL;
    } else {
      // Se a variável for null, impede o avanço
      alert('Por favor, selecione uma data no calendário antes de continuar.');
    }
  });
});