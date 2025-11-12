import {SERVICOS} from "../constants.js"

export function handlesCardSelection()
{
  // Pega todos os cards de seleção dos serviços
  const servicoItems = document.querySelectorAll('.servico-item');

  if(servicoItems.length === 0)
    console.error("Erro: Nenhum elemento com a classe '.servico-item' foi encontrado.");
  else
  {
    servicoItems.forEach(item => {
      item.addEventListener('click', () => {
        // Remove 'selected' de todos
        servicoItems.forEach(i => {
          i.classList.remove('selected');
        });
        // Adiciona 'selected' ao clicado
        item.classList.add('selected');
      });
    });
  }
}

export function handlesEnablingButton()
{
  const servicoItems = document.querySelectorAll('.servico-item');
  const botaoContinuar = document.getElementById('botao-continuar');

  servicoItems.forEach(item => {
    item.addEventListener('click', () => {botaoContinuar.disabled = false});
  });
}

export function handlesButtonClick()
{
  const botaoContinuar = document.getElementById('botao-continuar');

  botaoContinuar.addEventListener("click", () => {
    const cardSelecionado = document.querySelector('.servico-item.selected');  // Pega o item que tem a classe do card e tem a clase selected
    const codigoDoServico = cardSelecionado.dataset.servico
    const servico = SERVICOS[codigoDoServico]

    const servicoSelecionado = {
      servico: servico
    }

    // Tenta pegar dados que já existam
    // Se não tiver nada, cria um objeto vazio
    const dadosAtuais = JSON.parse(sessionStorage.getItem('dadosAgendamento')) || {};

    // Junta os dados antigos com os novos desse passo
    const dadosAtualizados = { ...dadosAtuais, ...servicoSelecionado };

    // Salvar no sessionStorage
    // O sessionStorage só aceita STRING, por isso usamos JSON.stringify
    sessionStorage.setItem('dadosAgendamento', JSON.stringify(dadosAtualizados));

    // Navegar para a próxima tela
    window.location.href = '/html/calendario.html';
  })
}
