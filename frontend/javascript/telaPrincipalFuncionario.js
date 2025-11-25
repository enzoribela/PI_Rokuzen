import {
  handlesCalendarSetup,
  preencheNomeDoFuncionario
} from "./functions/telaPrincipalFuncionario.functions.js"

document.addEventListener('DOMContentLoaded', () => {
  handlesCalendarSetup()
  preencheNomeDoFuncionario()
  //handlesButtonClick()
});