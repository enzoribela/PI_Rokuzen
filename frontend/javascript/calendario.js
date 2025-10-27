document.addEventListener('DOMContentLoaded', () => {
  // ---------------------------------------------------------------------
  // 1. VARIÁVEIS DE CONTROLE
  // ---------------------------------------------------------------------
  const btnContinuar = document.querySelector('.btn-continuar');
  const proximaURL = 'telaProfissionais.html';

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


  // ---------------------------------------------------------------------
  // 2. INICIALIZAÇÃO E CONFIGURAÇÃO DO FLATPICKR
  // ---------------------------------------------------------------------

  // --- ADIÇÃO: CALCULAR A DATA MÁXIMA ---
  const today = new Date();
  const maxDate = new Date(today); // Cria uma nova instância baseada em 'hoje'
  
  // Adiciona 3 meses à data
  // O setMonth lida automaticamente com a virada do ano (ex: Outubro + 3 = Janeiro do ano seguinte)
  maxDate.setMonth(maxDate.getMonth() + 6);
  // --- FIM DA ADIÇÃO ---


  // Verifica se a função flatpickr existe
  if (typeof flatpickr === 'undefined') {
    console.error("ERRO: A biblioteca Flatpickr não foi carregada.");
    return;
  }

  flatpickr("#calendario-inline", {
    "locale": "pt",
    inline: true,
    dateFormat: "d/m/Y",
    defaultDate: "today",
    minDate: "today", // Não permite selecionar datas passadas

    // --- ADIÇÃO: DEFINE A DATA MÁXIMA NO CALENDÁRIO ---
    maxDate: maxDate,
    // --- FIM DA ADIÇÃO ---

    // 'onChange' agora só ATUALIZA a variável se o usuário mudar
    onChange: function (selectedDates, dateStr, instance) {
      selectedDate = dateStr;
    }
  });

  // ---------------------------------------------------------------------
  // 3. LÓGICA DO BOTÃO CONTINUAR
  // ---------------------------------------------------------------------

  if (!btnContinuar) {
    console.error("Erro: Botão com a classe '.btn-continuar' não encontrado.");
    return;
  }

  // O botão agora começa HABILITADO
  btnContinuar.disabled = false;
  btnContinuar.classList.add('active');


  btnContinuar.addEventListener('click', (event) => {
    event.preventDefault();

    if (selectedDate && selectedDate.length > 0) {
      // REDIRECIONAMENTO
      window.location.href = proximaURL;
    } else {
      alert('Por favor, selecione uma data no calendário antes de continuar.');
    }
  });
});