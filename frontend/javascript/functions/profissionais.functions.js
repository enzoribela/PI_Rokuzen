import { api } from "../api.js"

let listaDeTerapeutas = [];
let currentSlide = 0;

function updateHorariosDropdown() {
  const selectMenu = document.getElementById('horario-select');
  const btnContinuar = document.querySelector('.btn-continuar-profissionais');

  // Pega o terapeuta certo usando o 'currentSlide'
  const terapeutaAtual = listaDeTerapeutas[currentSlide];

  // Limpa os horários antigos
  selectMenu.innerHTML = '';

  // Adiciona a opção padrão
  const defaultOption = document.createElement('option');
  defaultOption.value = "";
  defaultOption.textContent = "Selecione um horário";
  defaultOption.disabled = true;
  defaultOption.selected = true;
  selectMenu.appendChild(defaultOption);

  // Verifica se o terapeuta tem horários
  if (terapeutaAtual && terapeutaAtual.horarios && terapeutaAtual.horarios.length > 0) {
    terapeutaAtual.horarios.forEach(horario => {
      const option = document.createElement('option');
      option.value = horario; // Ex: "09:00"
      option.textContent = horario; // Ex: "09:00"
      selectMenu.appendChild(option);
    });
    selectMenu.disabled = false;
  } else {
    defaultOption.textContent = "Nenhum horário disponível";
    selectMenu.disabled = true;
  }

  // Desabilita o botão "Continuar" sempre que o terapeuta mudar
  btnContinuar.disabled = true;
}

function renderizaTerapeutas() {
  const container = document.querySelector('.carrossel-slides');
  if (!container) return;
  container.innerHTML = ''; // Limpa os cards estáticos

  listaDeTerapeutas.forEach(terapeuta => {
    // Usa dados reais ou genéricos (fallback)
    const imagem = terapeuta.imagemUrl || "../arquivos/terapeuta-falso.png";
    const descricao = terapeuta.descricao || "Um grande terapeuta, muito qualificado";

    const cardHtml = `
    <div class="card-profissional">
      <h2 class="profissional-nome">${terapeuta.nome}</h2>
      <div class="card-image-content">
        <button class="carrossel-button prev">&lt;</button>
        <div class="card-imagem-wrapper">
          <img src="${imagem}" alt="Foto de ${terapeuta.nome}" />
        </div>
        <button class="carrossel-button next">&gt;</button>
      </div>
      <div class="card-descricao">
        <p>${descricao}</p>
      </div>
    </div>
  `;
    container.innerHTML += cardHtml;
  });
}

function inicializaCarrossel() {
  // Seletores do Carrossel (só rodam DEPOIS que renderizarTerapeutas foi chamado)
  const carrosselSlides = document.querySelector('.carrossel-slides');
  const slides = document.querySelectorAll('.card-profissional');

  // Se não houver terapeutas, não faz nada
  if (slides.length === 0) {
    console.warn("Nenhum terapeuta para exibir.");
    return;
  }

  const prevButtons = document.querySelectorAll('.carrossel-button.prev');
  const nextButtons = document.querySelectorAll('.carrossel-button.next');


  // Sua função principal para mover o carrossel
  function updateCarrossel() {
    const slideWidth = slides[0].offsetWidth;
    const offset = slideWidth * currentSlide;
    carrosselSlides.style.transform = `translateX(-${offset}px)`;

    prevButtons.forEach(button => {
      button.disabled = currentSlide === 0;
    });

    nextButtons.forEach(button => {
      button.disabled = currentSlide === slides.length - 1;
    });

    updateHorariosDropdown();
  }

  // Adiciona evento aos botões "Próximo"
  nextButtons.forEach(button => {
    button.addEventListener('click', (e) => {
      e.stopPropagation();
      if (currentSlide < slides.length - 1) {
        currentSlide++;
        updateCarrossel();
      }
    });
  });

  // Adiciona evento aos botões "Anterior"
  prevButtons.forEach(button => {
    button.addEventListener('click', (e) => {
      e.stopPropagation();
      if (currentSlide > 0) {
        currentSlide--;
        updateCarrossel();
      }
    });
  });

  // Recalcula a posição em caso de redimensionamento da janela
  window.addEventListener('resize', updateCarrossel);

  // Inicializa o carrossel na posição 0
  updateCarrossel();
}

export async function handlesShowingTerapeutas() {
  try {
    const dia = JSON.parse(sessionStorage.getItem('dadosAgendamento')).dia;

    const response = await api.get("/agendamentos/horarios-disponiveis", {
      params: {dia: dia} 
    });

    const terapeutasComHorarios = response.data;

    if (terapeutasComHorarios.length == 0)
      alert('Estamos sem terapeutas disponíveis no momentos. Sentimos muito');
    else {
      listaDeTerapeutas = terapeutasComHorarios;
      renderizaTerapeutas()
      inicializaCarrossel()
    }
  }
  catch (error) {
    if (error.response) {
      // Mostra a mensagem de erro que veio do backend
      alert(error.response.data.message);
    }
    else {
      alert('Não foi possível conectar ao servidor.');
    }
  }
}

export function handlesButtonClick() {
  const btnContinuar = document.querySelector('.btn-continuar-profissionais');
  const selectHorario = document.getElementById('horario-select');
  const proximaURL = '/html/confirmacao.html';

  // 1. Habilita o botão "Continuar" QUANDO um horário é selecionado
  if(selectHorario)
  {
    selectHorario.addEventListener('change', () => {
      // Se o valor selecionado não for vazio, habilita o botão
      if(selectHorario.value)
      {
        btnContinuar.disabled = false;
      }
      else
      {
        btnContinuar.disabled = true;
      }
    });
  }

  // 2. Lógica do clique do botão "Continuar"
  if (btnContinuar)
  {
    btnContinuar.addEventListener('click', () => {
      // Pega o terapeuta e o horário selecionados
      const terapeutaSelecionado = listaDeTerapeutas[currentSlide];
      const horarioSelecionado = selectHorario.value;

      // Salva os dados no sessionStorage
      const dadosAtuais = JSON.parse(sessionStorage.getItem('dadosAgendamento')) || {};
      const novosDados = {
        ...dadosAtuais,
        terapeutaId: terapeutaSelecionado.id,
        terapeutaNome: terapeutaSelecionado.nome,
        horario: horarioSelecionado
      };
      sessionStorage.setItem('dadosAgendamento', JSON.stringify(novosDados));

      // Redireciona
      window.location.href = proximaURL;
    });
  }
}
