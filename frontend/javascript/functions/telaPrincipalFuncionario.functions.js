import { api } from "../api.js"

import {
  MAX_DATE_AGENDAMENTO_EM_MESES,
  TIMEZONE_PARA_O_CALENDARIO
} from "../constants.js"

function injetarCSSFlatpickr() {
  const estilo = document.createElement('style');
  estilo.innerHTML = `
      /* Remove a borda cinza do dia incorreto (UTC) */
      span.flatpickr-day.today {
          border-color: transparent !important;
      }
      /* Mantém o efeito visual quando passa o mouse */
      span.flatpickr-day.today:hover {
          border-color: #959ea9 !important;
          background: #e6e6e6;
      }
  `;
  document.head.appendChild(estilo);
}

export async function iniciaTabela()
{
  const tbody = document.getElementById("lista-agendamentos");
  tbody.innerHTML = '<tr><td colspan="2">Carregando...</td></tr>';

  try
  {
    // 1. Busca os dados no backend usando a data escolhida
    // (Supondo que seu backend tenha essa rota)
    const response = await api.get(`/agendamentos/meus/2025-11-25`);

    const agendamentos = response.data.agendamentos;

    // 2. Limpa a tabela
    tbody.innerHTML = '';

    if (agendamentos.length === 0) {
      tbody.innerHTML = '<tr><td colspan="2">Nenhum agendamento para este dia.</td></tr>';
      return;
    }

    // 3. Preenche com os novos dados
    agendamentos.forEach(item => {
      const linha = document.createElement('tr');
      linha.innerHTML = `
              <td>${item.inicio.slice(11, 16)}</td>
              <td>${item.sala.nome}</td> 
              <td>${item.nomeDoCliente}</td> `
      tbody.appendChild(linha);
    });
  }
  catch(error)
  {
    console.error("Erro ao buscar dados:", error);
    tbody.innerHTML = '<tr><td colspan="2">Erro ao carregar dados.</td></tr>';
  }
}

async function atualizarTabela(dataSelecionada) {
  const tbody = document.getElementById("lista-agendamentos");
  tbody.innerHTML = '<tr><td colspan="2">Carregando...</td></tr>';

  try
  {
    // 1. Busca os dados no backend usando a data escolhida
    // (Supondo que seu backend tenha essa rota)
    const response = await api.get(`/agendamentos/meus/${dataSelecionada.replaceAll("/", "-")}`);

    const agendamentos = response.data.agendamentos;

    // 2. Limpa a tabela
    tbody.innerHTML = '';

    if (agendamentos.length === 0) {
      tbody.innerHTML = '<tr><td colspan="2">Nenhum agendamento para este dia.</td></tr>';
      return;
    }

    // 3. Preenche com os novos dados
    agendamentos.forEach(item => {
      const linha = document.createElement('tr');
      linha.innerHTML = `
              <td>${item.inicio.slice(11, 16)}</td>
              <td>${item.sala.nome}</td> 
              <td>${item.nomeDoCliente}</td> `
      tbody.appendChild(linha);
    });
  }
  catch(error)
  {
    console.error("Erro ao buscar dados:", error);
    tbody.innerHTML = '<tr><td colspan="2">Erro ao carregar dados.</td></tr>';
  }
}

export function handlesCalendarSetup() {
  injetarCSSFlatpickr()  // Pra tentar arrumar a borda que aparece no dia de amanhã quando ja passou das 21h horário de Brasília

  const dataStringHoje = new Date().toLocaleString("en-CA", {
    timeZone: TIMEZONE_PARA_O_CALENDARIO,
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  });

  const maxDate = new Date();
  maxDate.setMonth(maxDate.getMonth() + MAX_DATE_AGENDAMENTO_EM_MESES);

  const calendario = flatpickr("#calendario-inline", {
    "locale": "pt",
    inline: true,
    dateFormat: "Y/m/d",
    defaultDate: dataStringHoje,
    minDate: dataStringHoje,
    maxDate: maxDate,
    onChange: function (selectedDates, dateStr, instance) {
      atualizarTabela(dateStr);
    }
  })
}

export function preencheNomeDoFuncionario() {
  const nomeDoFuncionario = document.getElementById('nome-do-funcionario');

  const dadosDoUsuarioString = localStorage.getItem("user")
  const dadosDoUsuario = JSON.parse(dadosDoUsuarioString) || {}

  nomeDoFuncionario.innerText = dadosDoUsuario.nome
}
