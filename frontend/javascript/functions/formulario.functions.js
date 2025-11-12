function checarCampos(botao, inputs)
{
  let todosPreenchidos = true;

  inputs.forEach(input => {
    if(!input.value.trim())
      todosPreenchidos = false;
  });

  botao.disabled = !todosPreenchidos;
}

export function handlesEnablingButton()
{
  const costumerInfoForm = document.getElementById('costumer-info-form');
  const botaoContinuar= document.getElementById('botao-continuar');

  const inputs = costumerInfoForm.querySelectorAll('input');

  inputs.forEach(input => {
    input.addEventListener('input', () => {checarCampos(botaoContinuar, inputs)});
    input.addEventListener('change', () => {checarCampos(botaoContinuar, inputs)});
  });
}

export function handlesCostumerInformation()
{
  const costumerInfoForm = document.getElementById('costumer-info-form');

  costumerInfoForm.addEventListener("submit", (event) => {
    // Impede que a página recarregue
    event.preventDefault(); 

    const customerInformation = {
      nome: document.getElementById('nome').value,
      email: document.getElementById('email').value,
      telefone: document.getElementById('telefone').value,
      cpf: document.getElementById('cpf').value,
    }

    // Tenta pegar dados que já existam (caso o usuário tenha voltado da tela 2)
    // Se não tiver nada, cria um objeto vazio
    const dadosAtuais = JSON.parse(sessionStorage.getItem('dadosAgendamento')) || {};

    // Junta os dados antigos com os novos desse passo
    const dadosAtualizados = { ...dadosAtuais, ...customerInformation };

    // 3. Salvar no sessionStorage
    // O sessionStorage só aceita STRING, por isso usamos JSON.stringify
    sessionStorage.setItem('dadosAgendamento', JSON.stringify(dadosAtualizados));

    // Navegar para a próxima tela
    window.location.href = '/html/unidades.html';
  })
}
