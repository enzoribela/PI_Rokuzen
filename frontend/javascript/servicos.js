document.addEventListener('DOMContentLoaded', function () {
  const servicoItems = document.querySelectorAll('.servico-item');
  const btnContinuar = document.querySelector('.btn-continuar');
  const proximaURL = 'calendario.html';

  if (servicoItems.length === 0) {
      console.error("Erro: Nenhum elemento com a classe '.servico-item' foi encontrado.");
      // Não é estritamente necessário um 'return' aqui, mas é uma boa prática
  }

  // Lógica para selecionar o item de serviço
  servicoItems.forEach(item => {
      item.addEventListener('click', function () {
          // Remove a classe 'selected' de todos os itens
          servicoItems.forEach(i => {
              i.classList.remove('selected');
          });
          // Adiciona a classe 'selected' ao item clicado
          this.classList.add('selected');
      });
  });

  // === Código do Botão Continuar MOVIDO PARA DENTRO ===

  if (!btnContinuar) {
      console.error("Erro: Botão com a classe '.btn-continuar' não encontrado.");
      return; // Sai da função DOMContentLoaded se o botão não for encontrado
  }

  btnContinuar.addEventListener('click', () => {
      let isItemSelected = false; // Mudei o nome para ser mais genérico/correto

      // Verifica se algum item (serviço) possui a classe 'selected'
      // *** MUDANÇA AQUI: 'unidadeItems' corrigido para 'servicoItems' ***
      servicoItems.forEach(card => { 
          if (card.classList.contains('selected')) {
              isItemSelected = true;
          }
      });

      if (isItemSelected) {
          // REDIRECIONAMENTO
          window.location.href = proximaURL;
      } else {
          // Se nenhum item foi selecionado, avisa o usuário
          // *** MUDANÇA AQUI: Alterei a mensagem para refletir 'Serviço' ***
          alert('Por favor, selecione um Serviço antes de continuar.'); 
      }
  });

  // O fechamento da função e do event listener está aqui
});
