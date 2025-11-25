document.addEventListener("DOMContentLoaded", function () {
  const select = document.getElementById("horario-select");

  // ===== MODAL MÊS =====
  const modalMes = document.getElementById("modal-mes");
  const btnCancelarMes = document.getElementById("btn-cancelar-mes");
  const btnConfirmarMes = document.getElementById("btn-confirmar-mes");
  const inputMes = document.getElementById("mes-estatistica");

  // ===== MODAL DIA =====
  const modalDia = document.getElementById("modal-dia");
  const btnCancelarDia = document.getElementById("btn-cancelar-dia");
  const btnConfirmarDia = document.getElementById("btn-confirmar-dia");
  const inputDia = document.getElementById("dia-estatistica");

  // Quando mudar o select
  select.addEventListener("change", function () {
    const valor = select.value;

    if (
      valor === "terapeuta com mais massagens no mês" ||
      valor === "dia do mês com mais massagens"
    ) {
      abrirModal(modalMes);
    }

    if (valor === "terapeuta com mais massagens em dia específico") {
      abrirModal(modalDia);
    }
  });

  function abrirModal(modal) {
    modal.classList.add("active");
  }

  function fecharModal(modal) {
    modal.classList.remove("active");
  }

  // ===== BOTÕES MÊS =====
  btnCancelarMes.addEventListener("click", () => fecharModal(modalMes));

  btnConfirmarMes.addEventListener("click", function () {
    const mes = inputMes.value;

    if (!mes) {
      alert("Selecione um mês.");
      return;
    }

    console.log("Mês selecionado:", mes);
    fecharModal(modalMes);
  });

  // ===== BOTÕES DIA =====
  btnCancelarDia.addEventListener("click", () => fecharModal(modalDia));

  btnConfirmarDia.addEventListener("click", function () {
    const dia = inputDia.value;

    if (!dia) {
      alert("Selecione um dia.");
      return;
    }

    console.log("Dia selecionado:", dia);
    fecharModal(modalDia);
  });
});
