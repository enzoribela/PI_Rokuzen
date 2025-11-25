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

const btnConsultar = document.querySelector(".btn-continuar");
const modalResultado = document.getElementById("modal-resultado");
const btnFecharResultado = document.getElementById("btn-fechar-resultado");
const resultadoTexto = document.getElementById("resultado-texto");
const selectEstatistica = document.getElementById("horario-select");

btnConsultar.addEventListener("click", function () {
  const estatistica = selectEstatistica.value;

  if (!estatistica) {
    alert("Selecione uma estatística antes de consultar.");
    return;
  }

  let mensagem = "";

  if (estatistica === "média por dia") {
    mensagem = "Resultado: Média de 117 minutos por massagem neste dia.";
  } 
  else if (estatistica === "média por mês") {
    mensagem = "Resultado: Média de 5 massagens por dia neste mês.";
  } 
  else {
    mensagem = "Resultado: O dia com mais massagens foi o dia 13 e teve 7 atendimentos.";
  }

  resultadoTexto.textContent = mensagem;
  modalResultado.classList.add("active");
});

btnFecharResultado.addEventListener("click", function () {
  modalResultado.classList.remove("active");
});

