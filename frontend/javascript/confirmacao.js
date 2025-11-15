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

  // 3. Ativa o "escutador" de clique no botão de confirmar
  handlesConfirmClick();
})
