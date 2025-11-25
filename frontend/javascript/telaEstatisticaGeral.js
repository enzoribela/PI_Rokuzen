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

  // ===== MODAL RESULTADO =====
  const btnConsultar = document.querySelector(".btn-continuar");
  const modalResultado = document.getElementById("modal-resultado");
  const btnFecharResultado = document.getElementById("btn-fechar-resultado");
  const resultadoTexto = document.getElementById("resultado-texto");

  // ===== ABRIR MODAIS =====
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

  // ===== BOTÕES MODAL MÊS =====
  btnCancelarMes.addEventListener("click", () => fecharModal(modalMes));

  btnConfirmarMes.addEventListener("click", function () {
    if (!inputMes.value) {
      alert("Selecione um mês.");
      return;
    }
    fecharModal(modalMes);
  });

  // ===== BOTÕES MODAL DIA =====
  btnCancelarDia.addEventListener("click", () => fecharModal(modalDia));

  btnConfirmarDia.addEventListener("click", function () {
    if (!inputDia.value) {
      alert("Selecione um dia.");
      return;
    }
    fecharModal(modalDia);
  });

  // ===== BOTÃO CONSULTAR (RESULTADO FAKE) =====
  btnConsultar.addEventListener("click", function () {
    const tipo = select.value;

    if (!tipo) {
      alert("Selecione uma estatística antes de consultar.");
      return;
    }

    let mensagem = "";

    if (tipo === "terapeuta com mais massagens no mês") {
      mensagem = "Resultado: João Silva realizou 115 massagens neste mês.";
    } 
    else if (tipo === "terapeuta com mais massagens em dia específico") {
      mensagem = "Resultado: João Silva realizou 9 massagens no dia selecionado.";
    } 
    else if (tipo === "dia do mês com mais massagens") {
      mensagem = "Resultado: O dia 15 foi o dia com mais atendimentos, com 29 massagens.";
    }

    resultadoTexto.textContent = mensagem;
    abrirModal(modalResultado);
  });

  // ===== FECHAR RESULTADO =====
  btnFecharResultado.addEventListener("click", function () {
    fecharModal(modalResultado);
  });
});

