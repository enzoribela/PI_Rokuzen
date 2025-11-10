document.addEventListener('DOMContentLoaded', function () {
    const salaItems = document.querySelectorAll('.sala-item');
    const btnContinuar = document.querySelector('.btn-continuar');
    const proximaURL = 'confirmacao.html'; 

    if (salaItems.length === 0) {
        console.error("Erro: Nenhum card de sala foi encontrado.");
        return;
    }

    // Lógica para selecionar a sala
    salaItems.forEach(item => {
        item.addEventListener('click', function () {
            
            // 🎯 VERIFICAÇÃO CHAVE: Só permite a lógica de seleção se a sala for 'disponivel'
            if (this.classList.contains('disponivel')) {
                
                // 1. Remove a classe 'selected' de todos os itens
                salaItems.forEach(i => {
                    i.classList.remove('selected');
                });
                
                // 2. Adiciona a classe 'selected' ao item clicado
                this.classList.add('selected');
                
                // 3. Ativa o botão continuar
                btnContinuar.disabled = false;
                
            } else {
                // Opcional: Avisar o cliente que a sala não pode ser agendada
                const status = this.querySelector('.status-sala').textContent;
                alert(`Desculpe, a Sala ${this.querySelector('h2').textContent} está atualmente ${status} e não pode ser agendada.`);
                
                // Garante que se a sala clicada não for disponível, o botão continue desativado
                btnContinuar.disabled = true;
            }
        });
    });

    // Lógica do Botão Continuar (mantida)
    if (!btnContinuar) {
        console.error("Erro: Botão com a classe '.btn-continuar' não encontrado.");
        return;
    }

    btnContinuar.addEventListener('click', () => {
        const salaSelecionada = document.querySelector('.sala-item.selected');
        
        if (salaSelecionada) {
            const salaId = salaSelecionada.getAttribute('data-sala-id');
            // REDIRECIONAMENTO
            window.location.href = `${proximaURL}?salaId=${salaId}`;
        } else {
            alert('Por favor, selecione uma Sala Disponível antes de continuar.'); 
        }
    });
});