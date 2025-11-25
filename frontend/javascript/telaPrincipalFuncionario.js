import {
  handlesCalendarSetup,
  preencheNomeDoFuncionario,
  iniciaTabela
} from "./functions/telaPrincipalFuncionario.functions.js"

document.addEventListener('DOMContentLoaded', () => {
  iniciaTabela()
  handlesCalendarSetup()
  preencheNomeDoFuncionario()
  //handlesButtonClick()
});