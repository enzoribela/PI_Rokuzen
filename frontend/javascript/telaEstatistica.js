document.addEventListener("DOMContentLoaded", function () {
  const select = document.getElementById("horario-select");

  // MODAL DIA
  const modalDia = document.getElementById("modal-calendario");
  const btnCancelarDia = document.getElementById("btn-cancelar");
  const btnConfirmarDia = document.getElementById("btn-confirmar-data");
  const inputData = document.getElementById("data-estatistica");

  // MODAL MÊS
  const modalMes = document.getElementById("modal-mes");
  const btnCancelarMes = document.getElementById("btn-cancelar-mes");
  const btnConfirmarMes = document.getElementById("btn-confirmar-mes");
  const inputMes = document.getElementById("mes-estatistica");

  // Detecta mudança no select
  select.addEventListener("change", function () {
    if (select.value === "média por dia") {
      abrirModal(modalDia);
    }

    if (select.value === "média por mês") {
      abrirModal(modalMes);
    }
  });

  function abrirModal(modal) {
    modal.classList.add("active");
  }

  function fecharModal(modal) {
    modal.classList.remove("active");
  }

  // BOTÕES – MODAL DIA
  btnCancelarDia.addEventListener("click", () => fecharModal(modalDia));

  btnConfirmarDia.addEventListener("click", function () {
    const data = inputData.value;

    if (!data) {
      alert("Selecione uma data.");
      return;
    }

    console.log("Data escolhida:", data);
    fecharModal(modalDia);
  });

  // BOTÕES – MODAL MÊS
  btnCancelarMes.addEventListener("click", () => fecharModal(modalMes));

  btnConfirmarMes.addEventListener("click", function () {
    const mes = inputMes.value;

    if (!mes) {
      alert("Selecione um mês.");
      return;
    }

    console.log("Mês escolhido:", mes);
    fecharModal(modalMes);
  });
});
