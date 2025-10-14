document.addEventListener('DOMContentLoaded', function () {
    // Seleciona todos os cards de unidade usando a classe CSS
    const unidadeItems = document.querySelectorAll('.unidade-item');

    // Verifica se algum card de unidade foi encontrado no HTML
    if (unidadeItems.length === 0) {
        console.error("Erro: Nenhum card de unidade encontrado com a classe '.unidade-item'.");
        return;
    }

    // Adiciona o evento de clique a cada card
    unidadeItems.forEach(item => {
        item.addEventListener('click', function () {

            // Remove a classe 'selected' de TODOS os cards primeiro
            unidadeItems.forEach(i => {
                i.classList.remove('selected');
            });

            // Adiciona a classe 'selected' APENAS no card que foi clicado (usando 'this')
            this.classList.add('selected');
        });
    });

    // Opcional: Para debugar e confirmar que o script carregou
    // console.log("Script de seleção de unidade carregado com sucesso.");
});