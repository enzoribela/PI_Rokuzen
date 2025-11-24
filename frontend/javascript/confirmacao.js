import {
  loadAndPopulateData,
  handlesDropdownChanges,
  handlesConfirmClick
} from './functions/confirmacao.functions.js';

document.addEventListener('DOMContentLoaded', () => {
  // 1. Carrega os dados da API e preenche o formulário
  loadAndPopulateData();

  // 2. Ativa o "escutador" de mudança no dropdown de profissional
  handlesDropdownChanges();

  // 3. Ativa a lógica original de envio de dados (Backend/Axios)
  handlesConfirmClick();

  // --- NOVA IMPLEMENTAÇÃO: Lógica Visual do Alerta Bootstrap ---
  const btnConfirmar = document.getElementById('btnConfirmar');
  const liveAlert = document.getElementById('liveAlert');

  if (btnConfirmar && liveAlert) {
    btnConfirmar.addEventListener('click', (event) => {
      // Remove a classe 'd-none' para mostrar o alerta verde
      liveAlert.classList.remove('d-none');

      // Rola a página suavemente para o topo para o usuário ver o alerta
      window.scrollTo({ top: 0, behavior: 'smooth' });

      // (Opcional) Se você quiser que o alerta suma depois de 5 segundos:
      /*
      setTimeout(() => {
          liveAlert.classList.add('d-none');
      }, 5000);
      */
    });
  }
});