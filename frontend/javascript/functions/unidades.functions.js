import {UNIDADES} from "../constants.js"

export function handlesCardSelection()
{
  // Pega todos os cards de seleção das unidades
  const unidadeItems = document.querySelectorAll('.unidade-item');

  if(unidadeItems.length === 0)
    console.error("Erro: Nenhum elemento com a classe '.unidade-item' foi encontrado.");
  else
  {
    unidadeItems.forEach(item => {
      item.addEventListener('click', () => {
        // Remove 'selected' de todos
        unidadeItems.forEach(i => {
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
  const unidadeItems = document.querySelectorAll('.unidade-item');
  const botaoContinuar = document.getElementById('botao-continuar');

  unidadeItems.forEach(item => {
    item.addEventListener('click', () => {botaoContinuar.disabled = false});
  });
}

export function handlesButtonClick()
{
  const botaoContinuar = document.getElementById('botao-continuar');

  botaoContinuar.addEventListener("click", () => {
    const cardSelecionado = document.querySelector('.unidade-item.selected');  // Pega o item que tem a classe do card e tem a clase selected
    const codigoDaUnidade = cardSelecionado.dataset.unidade
    const unidade = UNIDADES[codigoDaUnidade]

    const unidadeSelecionada = {
      unidade: unidade
    }

    // Tenta pegar dados que já existam
    // Se não tiver nada, cria um objeto vazio
    const dadosAtuais = JSON.parse(sessionStorage.getItem('dadosAgendamento')) || {};

    // Junta os dados antigos com os novos desse passo
    const dadosAtualizados = { ...dadosAtuais, ...unidadeSelecionada };

    // Salvar no sessionStorage
    // O sessionStorage só aceita STRING, por isso usamos JSON.stringify
    sessionStorage.setItem('dadosAgendamento', JSON.stringify(dadosAtualizados));

    // Navegar para a próxima tela
    window.location.href = '/html/telaServico.html';
  })
}
