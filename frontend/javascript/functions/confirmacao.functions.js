import { api } from "../api.js";

let terapeutasDisponiveis = [];

const TRADUTOR_UNIDADE = {
  "Grand Plaza": "plaza",
  "Golden Square": "golden",
  "Mooca": "mooca",
  "West Plaza": "West"
};

const TRADUTOR_SERVICO = {
  "Maca": "maca",
  "Quick massage": "quick",
  "Reflexologia Podal": "podal",
  "Auriculoterapia": "auriculoterapia"
};

function getSelectedText(selectId) {
  const select = document.getElementById(selectId);
  if (select.selectedIndex === -1) { // -1 significa que nada foi selecionado
    return "";
  }
  return select.options[select.selectedIndex].text;
}

export async function loadAndPopulateData() {
  try {
    const dadosSessao = JSON.parse(sessionStorage.getItem('dadosAgendamento')) || {};

    if (!dadosSessao.dia) {
      alert("O dia não foi selecionado. Voltando para o calendário...");
      window.location.href = '/html/calendario.html';
      return;
    }

    // --- BUSCA NA API (Profissionais e Horários Dinâmicos) ---
    const response = await api.get("/agendamentos/horarios-disponiveis", {
      params: { dia: dadosSessao.dia }
    });
    terapeutasDisponiveis = response.data;

    // Popula o dropdown de profissionais DINAMICAMENTE
    populateProfissionaisDropdown(terapeutasDisponiveis);

    // --- PRÉ-SELEÇÃO COM TRADUÇÃO ---

    // 1. Pré-seleciona a Unidade (Usando o tradutor)
    if (dadosSessao.unidade) {
      const valorUnidade = TRADUTOR_UNIDADE[dadosSessao.unidade];
      if (valorUnidade) document.getElementById('unidade').value = valorUnidade;
    }

    // 2. Pré-seleciona o Serviço (Usando o tradutor)
    if (dadosSessao.servico) {
      const valorServico = TRADUTOR_SERVICO[dadosSessao.servico];
      if (valorServico) document.getElementById('servico').value = valorServico;
    }

    // 3. Pré-seleciona o Terapeuta (Dinâmico)
    // (Aqui usamos o terapeutaNome para ACHAR o terapeutaId)
    if (dadosSessao.terapeutaNome) {
      const terapeutaEncontrado = terapeutasDisponiveis.find(t => t.nome === dadosSessao.terapeutaNome);
      if (terapeutaEncontrado) {
        document.getElementById('profissional').value = terapeutaEncontrado.terapeutaId;
      }
    }

    // 4. ATUALIZA OS HORÁRIOS (Dinâmico)
    // (Pega o ID do terapeuta que acabamos de pré-selecionar)
    const terapeutaIdInicial = document.getElementById('profissional').value;
    updateHorariosDropdown(terapeutaIdInicial);

    // 5. PRÉ-SELECIONA O HORÁRIO (Dinâmico)
    // O dropdown foi preenchido com "13:00", então o valor do storage vai bater.
    if (dadosSessao.horario) {
      document.getElementById('horario').value = dadosSessao.horario;
    }

  } catch (error) {
    console.error("Erro ao carregar dados de confirmação:", error);
    alert("Erro ao buscar dados. Tente novamente.");
  }
}

function populateProfissionaisDropdown(terapeutas) {
  const select = document.getElementById('profissional');
  select.innerHTML = '<option value="" disabled selected>Escolha um profissional</option>'; // Limpa

  terapeutas.forEach(terapeuta => {
    const option = document.createElement('option');
    option.value = terapeuta.terapeutaId;
    option.textContent = terapeuta.nome;
    select.appendChild(option);
  });
}

function updateHorariosDropdown(terapeutaId) {
  const selectHorario = document.getElementById('horario');
  selectHorario.innerHTML = '<option value="" disabled selected>Escolha um horário</option>'; // Limpa

  // Encontra o terapeuta na nossa lista de estado
  const terapeuta = terapeutasDisponiveis.find(t => t.terapeutaId === terapeutaId);

  if (terapeuta && terapeuta.horarios && terapeuta.horarios.length > 0) {
    terapeuta.horarios.forEach(horario => {
      const option = document.createElement('option');
      option.value = horario;
      option.textContent = horario;
      selectHorario.appendChild(option);
    });
    selectHorario.disabled = false;
  } else {
    selectHorario.innerHTML = '<option value="" disabled selected>Sem horários</option>';
    selectHorario.disabled = true;
  }
}

export function handlesDropdownChanges() {
  const selectProfissional = document.getElementById('profissional');

  selectProfissional.addEventListener('change', (event) => {
    const novoTerapeutaId = event.target.value;
    // Atualiza a lista de horários
    updateHorariosDropdown(novoTerapeutaId);
  });
}

export function handlesConfirmClick() {
  const btnContinuar = document.querySelector('.btn-continuar');

  btnContinuar.addEventListener('click', async () => {

    // Pega os dados salvos (nome, cpf, dia, etc.)
    const dadosAtuais = JSON.parse(sessionStorage.getItem('dadosAgendamento')) || {};

    // Pega os valores FINAIS do formulário
    const dadosFinais = {
      ...dadosAtuais,
      unidade: getSelectedText('unidade'),
      servico: getSelectedText('servico'),
      profissionalNome: getSelectedText('profissional'), // Texto (ex: "Ana Souza")
      horario: getSelectedText('horario'),            // Texto (ex: "13:00")
      terapeutaId: document.getElementById('profissional').value // ID (ex: "65...")
    };

    // Validação de frontend
    if (!dadosFinais.unidade || !dadosFinais.servico || !dadosFinais.terapeutaId || !dadosFinais.horario) {
      alert("Por favor, preencha todos os campos.");
      return;
    }

    // --- TRADUÇÃO PARA A API ---
    // (Baseado no seu schema)

    const { dia, horario, terapeutaId, servico, unidade, nome, email, telefone, cpf } = dadosFinais;

    // 1. Constrói as datas ISO
    const dataInicio = new Date(`${dia}T${horario}:00`);
    const DURACAO_PADRAO_MS = 60 * 60 * 1000; // 60 minutos
    const dataFim = new Date(dataInicio.getTime() + DURACAO_PADRAO_MS);

    // 2. Monta o objeto final para o backend
    // (Note a AUSÊNCIA do campo 'sala')
    const objetoParaApi = {
      tipoDeServico: servico,
      unidade: unidade,
      inicio: dataInicio.toISOString(),
      fim: dataFim.toISOString(),
      terapeuta: terapeutaId,
      nomeDoCliente: nome,
      emailDoCliente: email,
      telefone: telefone,
      cpf: cpf
    };

    // --- CHAMADA DA API E TRATAMENTO DE RESPOSTA ---
    try {
      // Desabilita o botão para evitar clique duplo
      btnContinuar.disabled = true;
      btnContinuar.textContent = "Confirmando...";

      // 3. Faz a chamada
      const response = await api.post('/agendamentos', objetoParaApi);

      // 4. Sucesso!
      sessionStorage.clear(); // Limpa a sessão
      alert(response.data.message); // "Agendamento criado com sucesso"
      window.location.href = '/html/telaPrincipal.html'; // Ou sua tela de sucesso

    } catch (error) {
      console.error("Erro ao confirmar agendamento:", error);

      // O interceptor de 401 (token expirado) já deve ter atuado

      if (error.response) {
        // Erros de Validação (400), Conflito (409), ou Não Encontrado (404)
        // Mostra a mensagem de erro específica vinda do backend
        alert(error.response.data.message);
      } else {
        // Erro de rede ou servidor totalmente offline
        alert("Erro de conexão. Não foi possível salvar o agendamento.");
      }

      // Reabilita o botão em caso de erro
      btnContinuar.disabled = false;
      btnContinuar.textContent = "Confirmar atendimento";
    }
  });
}
