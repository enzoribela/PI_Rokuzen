document.addEventListener('DOMContentLoaded', () => {
  // VARIÁVEIS PARA SELEÇÃO DOS CARDS
  const unidadeItems = document.querySelectorAll('.unidade-item');

  // VARIÁVEIS PARA O BOTÃO
  const btnContinuar = document.querySelector('.btn-continuar');
  const proximaURL = 'telaServico.html';

  // ----------------------------------------------------
  // LÓGICA DE SELEÇÃO DOS CARDS (CLIQUE)
  // ----------------------------------------------------
  if (unidadeItems.length === 0) {
    console.error("Erro: Nenhum elemento com a classe '.unidade-item' foi encontrado.");
  } else {
    unidadeItems.forEach(item => {
      item.addEventListener('click', function () {
        // Remove 'selected' de todos
        unidadeItems.forEach(i => {
          i.classList.remove('selected');
        });
        // Adiciona 'selected' ao clicado
        this.classList.add('selected');
      });
    });
  }

  // ----------------------------------------------------
  // LÓGICA DO BOTÃO CONTINUAR (REDIRECIONAMENTO)
  // ----------------------------------------------------
  if (!btnContinuar) {
    console.error("Erro: Botão com a classe '.btn-continuar' não encontrado.");
    return;
  }

  btnContinuar.addEventListener('click', () => {
    let isUnidadeSelected = false;

    // Verifica se algum card possui a classe 'selected'
    unidadeItems.forEach(card => {
      if (card.classList.contains('selected')) {
        isUnidadeSelected = true;
      }
    });

    if (isUnidadeSelected) {
      // REDIRECIONAMENTO
      window.location.href = proximaURL;
    } else {
      // Se nenhuma unidade foi selecionada, avisa o usuário
      alert('Por favor, selecione uma Unidade antes de continuar.');
    }
  });
});