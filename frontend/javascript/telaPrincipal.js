document.addEventListener("DOMContentLoaded", function () {
  const modal = document.getElementById("modal-termos");
  const botaoAceitar = document.getElementById("aceitar-termos");

  if (modal) {
    window.addEventListener("load", function () {
      modal.style.display = "flex";
    });
  }

  if (botaoAceitar) {
    botaoAceitar.addEventListener("click", function () {
      modal.style.display = "none";
    });
  }
});
