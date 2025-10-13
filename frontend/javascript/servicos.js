<script>
  document.addEventListener('DOMContentLoaded', function() {
        // Usa const, que é a forma moderna para variáveis que não mudam
        const servicoItems = document.querySelectorAll('.servico-item');

  // Verifica se algum item foi encontrado. Se não, para aqui.
  if (servicoItems.length === 0) {
    console.error("Erro: Nenhum elemento com a classe '.servico-item' foi encontrado.");
  return;
        }

        servicoItems.forEach(item => {
    // Usa 'this' para se referir ao elemento clicado (que é o 'item')
    item.addEventListener('click', function () {

      // Remove a classe 'selected' de todos os itens
      servicoItems.forEach(i => {
        i.classList.remove('selected');
      });

      // Adiciona a classe 'selected' apenas no item clicado (this)
      this.classList.add('selected');
    });
        });

  console.log("Script de seleção de serviço carregado com sucesso.");
    });
</script>