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

export function handlesCalendarSetup()
{
  const botaoContinuar = document.getElementById('botao-continuar');
  
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
    onChange: function(selectedDates, dateStr, instance){
      if (selectedDates.length > 0)
        botaoContinuar.disabled = false;
      else
        botaoContinuar.disabled = true;
    }
  })
}

export function handlesButtonClick()
{
  const botaoContinuar = document.getElementById('botao-continuar');

  botaoContinuar.addEventListener("click", () => {
    const divDoCalendario = document.getElementById("calendario-inline")
    const calendario = divDoCalendario._flatpickr

    if(!calendario)
    {
      console.error("Erro: O calendário não foi inicializado ainda.");
      return;
    }

    const dataSelecionada = calendario.selectedDates[0];

    if(dataSelecionada)
    {
      const dataFormatada = calendario.formatDate(dataSelecionada, "Y-m-d");

      const diaSelecionado = {
        dia: dataFormatada
      }
  
      // Tenta pegar dados que já existam
      // Se não tiver nada, cria um objeto vazio
      const dadosAtuais = JSON.parse(sessionStorage.getItem('dadosAgendamento')) || {};
  
      // Junta os dados antigos com os novos desse passo
      const dadosAtualizados = { ...dadosAtuais, ...diaSelecionado };
  
      // Salvar no sessionStorage
      // O sessionStorage só aceita STRING, por isso usamos JSON.stringify
      sessionStorage.setItem('dadosAgendamento', JSON.stringify(dadosAtualizados));
  
      // Navegar para a próxima tela
      window.location.href = '/html/telaProfissionais.html';
    }
  })
}
