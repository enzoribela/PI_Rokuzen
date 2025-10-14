document.addEventListener('DOMContentLoaded', () => {
  const selectServico = document.getElementById('servico');
  const selectUnidade = document.getElementById('unidade');
  const selectHorario = document.getElementById('horario');
  const selectProfissional = document.getElementById('profissional');
  const btnContinuar = document.querySelector('.btn-continuar');

  // ---------------------------------------------------------------------
  // 1. LÓGICA DE VALIDAÇÃO DO BOTÃO
  // O botão 'Continuar' só deve ficar ativo quando todos os campos tiverem sido preenchidos
  // ---------------------------------------------------------------------

  const checkFormCompletion = () => {
      // Verifica se o valor de cada <select> é diferente do valor do primeiro <option> (o padrão)
      // Nota: Certifique-se de que o primeiro <option> de cada <select> é o valor que indica "não selecionado"
      const isFormComplete = (
          selectUnidade.value !== "" && 
          selectServico.value !== "" && 
          selectHorario.value !== "" && 
          selectProfissional.value !== ""
      );

      if (isFormComplete) {
          btnContinuar.disabled = false;
          btnContinuar.classList.add('active'); // Adiciona classe para mudar cor/estilo
      } else {
          btnContinuar.disabled = true;
          btnContinuar.classList.remove('active');
      }
  };

  // Adiciona o listener para verificar ao mudar qualquer campo
  const formFields = [selectUnidade, selectServico, selectHorario, selectProfissional];
  formFields.forEach(field => {
      if (field) { // Verifica se o elemento existe no HTML
          field.addEventListener('change', checkFormCompletion);
      }
  });

  // Inicia o formulário como desativado
  btnContinuar.disabled = true;
  checkFormCompletion();

  // ---------------------------------------------------------------------
  // 2. (OPCIONAL) LÓGICA DE FILTRAGEM (Ex: Se escolher Maca, filtra horários)
  // Este é apenas um exemplo de como a interatividade pode ser feita.
  // ---------------------------------------------------------------------

  if (selectServico) {
      selectServico.addEventListener('change', () => {
          const servicoSelecionado = selectServico.value;
          
          // Lógica de filtragem: 
          // Se o serviço for 'quick', o profissional 'Clériton S.' está indisponível
          if (servicoSelecionado === 'quick') {
              selectProfissional.querySelectorAll('option').forEach(option => {
                  if (option.value === 'cleriton') {
                      option.disabled = true;
                  }
              });
          } else {
              // Reabilita as opções quando outro serviço é selecionado
              selectProfissional.querySelectorAll('option').forEach(option => {
                  option.disabled = false;
              });
          }
      });
  }

});