document.addEventListener('DOMContentLoaded', () => {
  // ---------------------------------------------------------------------
  // 1. VARIÁVEIS DE CONTROLE
  // ---------------------------------------------------------------------
  const btnContinuar = document.querySelector('.btn-continuar');
  const proximaURL = 'telaServico.html';

  // Variável de controle para a data selecionada (null = nada selecionado)
  let selectedDate = null;

  // ---------------------------------------------------------------------
  // 2. INICIALIZAÇÃO E CONFIGURAÇÃO DO FLATPICKR (Movida para cá)
  // ---------------------------------------------------------------------

  // Verifica se a função flatpickr existe (garante que a biblioteca foi carregada)
  if (typeof flatpickr === 'undefined') {
    console.error("ERRO: A biblioteca Flatpickr não foi carregada.");
    return;
  }

  flatpickr("#calendario-inline", {
    "locale": "pt",
    inline: true,
    dateFormat: "d/m/Y",
    defaultDate: "today",

    minDate: "today",

    // Captura a data selecionada no evento onChange
    onChange: function (selectedDates, dateStr, instance) {
      selectedDate = dateStr;

      // Habilita o botão ao selecionar uma data
      if (btnContinuar) {
        btnContinuar.disabled = false;
        // Opcional: Adiciona classe para mudar a cor/estilo do botão
        btnContinuar.classList.add('active');
      }
    }
  });

  // ---------------------------------------------------------------------
  // 3. LÓGICA DO BOTÃO CONTINUAR
  // ---------------------------------------------------------------------

  if (!btnContinuar) {
    console.error("Erro: Botão com a classe '.btn-continuar' não encontrado.");
    return;
  }

  // Inicializa o botão como desativado
  btnContinuar.disabled = true;
  btnContinuar.classList.remove('active');

  btnContinuar.addEventListener('click', (event) => {

    // Impede o comportamento padrão (como recarregar a página)
    event.preventDefault();

    // Verifica se selectedDate tem um valor
    if (selectedDate && selectedDate.length > 0) {
      // REDIRECIONAMENTO
      window.location.href = proximaURL;
    } else {
      // Se a variável for null, impede o avanço
      alert('Por favor, selecione uma data no calendário antes de continuar.');
    }
  });
});