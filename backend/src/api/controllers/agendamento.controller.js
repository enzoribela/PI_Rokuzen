const mongoose = require("mongoose")
const Agendamento = require("../../models/Agendamento.model")
const Usuario = require("../../models/Usuario.model")
const Sala = require("../../models/Sala.model")

const {checaDisponibilidade} = require("../../services/agendamento.service")

const {
  MONGOOSE_VALIDATION_ERROR,
  NOME_DE_ERRO_GENERICO
} = require("../../constants/error.constants")

const {
  AGENDAMENTO,
  ERRO,
  VALIDACAO,
  USUARIO
} = require("../../constants/responseMessages.constants")

const {
  ROLES,
  INTERVALO_TERAPEUTA_MINUTOS,
  INTERVALO_SALA_MINUTOS,
  HORA_INICIO_TRABALHO,
  HORA_FIM_TRABALHO
} = require("../../constants/validation.constants")

const minutosParaMs = (minutos) => minutos * 60 * 1000;

exports.criaAgendamento = async (req, res) => {
  const INTERVALO_MINUTOS_TERAPEUTA = INTERVALO_TERAPEUTA_MINUTOS
  const INTERVALO_MINUTOS_SALA = INTERVALO_SALA_MINUTOS

  try {
    // 1. Pega os dados brutos da requisição
    const { 
      inicio, 
      fim, 
      terapeuta, 
      unidade, 
      tipoDeServico,
      nomeDoCliente,
      emailDoCliente,
      telefone,
      cpf 
    } = req.body;

    const dia = inicio.substring(0, 10); // Ex: "2025-11-15"

    // Converte datas para objetos Date (pois vêm como string ISO)
    const dataInicio = new Date(inicio);
    const dataFim = new Date(fim);

    // --- 2. CHECAGEM DE CONFLITO DO TERAPEUTA (FAIL-FAST) ---
    // (Lógica de "bloco virtual" que usamos antes)
    const bufferTerapeutaMs = minutosParaMs(INTERVALO_MINUTOS_TERAPEUTA);
    const inicioVirtualTerapeuta = new Date(dataInicio.getTime() - bufferTerapeutaMs);
    const fimVirtualTerapeuta = new Date(dataFim.getTime() + bufferTerapeutaMs);

    const conflitoTerapeuta = await Agendamento.findOne({
      terapeuta: terapeuta,
      inicio: { $lt: fimVirtualTerapeuta }, // Começa antes do bloco virtual terminar
      fim: { $gt: inicioVirtualTerapeuta }    // Termina depois do bloco virtual começar
    });

    if (conflitoTerapeuta) {
      return res.status(409).json({ message: VALIDACAO.AGENDAMENTO.TERAPEUTA_OCUPADO });
    }

    // --- 3. ALOCAÇÃO AUTOMÁTICA DA SALA ---

    // a) Encontra todas as salas candidatas (mesma unidade, serviço compatível)
    const salasCandidatas = await Sala.find({
      unidade: unidade,
      servicos: tipoDeServico // Checa se 'tipoDeServico' está no array 'servicos'
    });

    if (salasCandidatas.length === 0) {
      return res.status(404).json({ message: AGENDAMENTO.SALA_NAO_ENCONTRADA_PARA_SERVICO });
    }

    // b) Busca todos os agendamentos que já usam QUALQUER uma dessas salas no dia
    const idsSalasCandidatas = salasCandidatas.map(s => s._id);
    const agendamentosNasSalas = await Agendamento.find({
      sala: { $in: idsSalasCandidatas },
      inicio: { $lt: new Date(dia + "T23:59:59") }, // Otimização: busca só no dia
      fim: { $gt: new Date(dia + "T00:00:00") }
    });

    // c) Encontra a primeira sala livre
    let salaIdSelecionada = null;
    const bufferSalaMs = minutosParaMs(INTERVALO_MINUTOS_SALA);

    for (const sala of salasCandidatas) {
      // Pega só os agendamentos desta sala específica
      const agendamentosDaSala = agendamentosNasSalas.filter(
        ag => ag.sala.equals(sala._id)
      );

      // Cria os blocos virtuais (com buffer de limpeza)
      const blocosOcupadosSala = agendamentosDaSala.map(ag => ({
        inicio: new Date(ag.inicio.getTime() - bufferSalaMs),
        fim: new Date(ag.fim.getTime() + bufferSalaMs)
      }));

      // Checa se o horário desejado (dataInicio/dataFim) conflita com os blocos
      let salaEstaOcupada = false;
      for (const bloco of blocosOcupadosSala) {
        if ((dataInicio < bloco.fim) && (dataFim > bloco.inicio)) {
          salaEstaOcupada = true;
          break; // Conflito encontrado, testar próxima sala
        }
      }

      // Se a sala NÃO está ocupada, encontramos!
      if (!salaEstaOcupada) {
        salaIdSelecionada = sala._id;
        break; // Para o loop 'for (const sala...)'
      }
    }

    // d) Se, após o loop, nenhuma sala foi encontrada
    if (!salaIdSelecionada) {
      return res.status(409).json({ message: VALIDACAO.AGENDAMENTO.SALA_OCUPADA });
    }

    // --- 4. SALVAR O AGENDAMENTO COMPLETO ---
    const agendamento = new Agendamento({
      ...req.body, // Pega todos os campos (nome, cpf, servico, unidade, etc.)
      sala: salaIdSelecionada // Adiciona a sala que encontramos
    });

    await agendamento.save();

    res.status(201).json({ message: AGENDAMENTO.CRIADO_COM_SUCESSO });

  } catch (error) {
    // (Seu tratamento de erro original, está ótimo)
    if (error.name == MONGOOSE_VALIDATION_ERROR) {
      const errorMessages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        message: ERRO.VALIDACAO,
        erros: errorMessages
      });
    }
    if (error.name == NOME_DE_ERRO_GENERICO && error.message == VALIDACAO.GERAL.INTERVALO_DE_TEMPO_INVALIDO) {
      return res.status(400).json({
        message: ERRO.VALIDACAO,
        erros: [VALIDACAO.GERAL.INTERVALO_DE_TEMPO_INVALIDO]
      });
    }
    console.error(error); // Log do erro
    return res.status(500).json({ message: ERRO.ERRO_INTERNO_NO_SERVIDOR });
  }
};

exports.getAgendamentoById = async (req, res) => {
  try
  {
    const {id} = req.params

    if(!id)
      return res.status(400).json({message: AGENDAMENTO.ID_NAO_FORNECIDO})

    if(!mongoose.Types.ObjectId.isValid(id))
      return res.status(400).json({message: AGENDAMENTO.ID_FORNECIDO_INVALIDO})

    const agendamento = await Agendamento.findById(id).select("-__v")

    if(!agendamento)
      return res.status(400).json({message: AGENDAMENTO.AGENDAMENTO_NAO_ENCONTRADO})

    res.status(200).json({
      message: AGENDAMENTO.AGENDAMENTO_ENCONTRADO,
      agendamento: agendamento
    })
  }
  catch(error)
  {
    return res.status(500).json({message: ERRO.ERRO_INTERNO_NO_SERVIDOR}) // código 500, internal server error
  }
}

exports.getTodosAgendamentos = async (req, res) => {
  try
  {
    const agendamentos = await Agendamento.find({}).select("-__v")

    res.status(200).json({
      message: AGENDAMENTO.TODOS_AGENDAMENTOS_ENCONTRADOS,
      agendamentos: agendamentos
    })
  }
  catch(error)
  {
    return res.status(500).json({message: ERRO.ERRO_INTERNO_NO_SERVIDOR}) // código 500, internal server error
  }
}

exports.updateAgendamentoById = async (req, res) => {
  try
  {
    const {id} = req.params

    if(!id)
      return res.status(400).json({message: AGENDAMENTO.ID_NAO_FORNECIDO})

    if(!mongoose.Types.ObjectId.isValid(id))
      return res.status(400).json({message: AGENDAMENTO.ID_FORNECIDO_INVALIDO})

    const agendamento = await Agendamento.findById(id).select("-__v")

    if(!agendamento)
      return res.status(400).json({message: AGENDAMENTO.AGENDAMENTO_NAO_ENCONTRADO})
      
    Object.assign(agendamento, req.body)

    const conflito = await checaDisponibilidade(agendamento.inicio, agendamento.fim, agendamento.terapeuta, agendamento.sala, agendamento._id);

    if(conflito)
    {
      let mensagem = conflito.terapeuta.equals(agendamento.terapeuta) ? VALIDACAO.AGENDAMENTO.TERAPEUTA_OCUPADO : VALIDACAO.AGENDAMENTO.SALA_OCUPADA

      return res.status(409).json({message: mensagem})
    }

    await agendamento.save()

    res.status(200).json({
      message: AGENDAMENTO.AGENDAMENTO_ATUALIZADO,
      agendamento: agendamento
    })  
  }
  catch(error)
  {
    if (error.name == MONGOOSE_VALIDATION_ERROR) {
      const errorMessages = Object.values(error.errors).map(err => err.message)

      return res.status(400).json({
        message: ERRO.VALIDACAO,
        erros: errorMessages
      })
    }

    if (error.name == NOME_DE_ERRO_GENERICO && error.message == VALIDACAO.GERAL.INTERVALO_DE_TEMPO_INVALIDO) {
      return res.status(400).json({
        message: ERRO.VALIDACAO,
        erros: [VALIDACAO.GERAL.INTERVALO_DE_TEMPO_INVALIDO]
      })
    }

    return res.status(500).json({message: ERRO.ERRO_INTERNO_NO_SERVIDOR})
  }
}

exports.deleteAgendamentoById = async (req, res) => {
  try
  {
    const {id} = req.params

    if(!id)
      return res.status(400).json({message: AGENDAMENTO.ID_NAO_FORNECIDO})

    if(!mongoose.Types.ObjectId.isValid(id))
      return res.status(400).json({message: AGENDAMENTO.ID_FORNECIDO_INVALIDO})

    const agendamento = await Agendamento.findByIdAndDelete(id).select("-__v")

    if(!agendamento)
      return res.status(400).json({message: AGENDAMENTO.AGENDAMENTO_NAO_ENCONTRADO})

    res.status(200).json({
      message: AGENDAMENTO.AGENDAMENTO_DELETADO,
      agendamento: agendamento
    })
  }
  catch(error)
  {
    return res.status(500).json({message: ERRO.ERRO_INTERNO_NO_SERVIDOR})
  }
}

exports.getAgendamentosPorTerapeuta = async (req, res) => {
  try
  {
    const {terapeutaId} = req.params

    if(!terapeutaId)
      return res.status(400).json({message: USUARIO.ID_NAO_FORNECIDO})

    if(!mongoose.Types.ObjectId.isValid(terapeutaId))
      return res.status(400).json({message: USUARIO.ID_FORNECIDO_INVALIDO})

    const usuario = await Usuario.findById(terapeutaId).select("-__v")

    if(!usuario)
      return res.status(400).json({message: USUARIO.USUARIO_NAO_ENCONTRADO})

    if(usuario.role != ROLES.TERAPEUTA)
      return res.status(400).json({message: USUARIO.USUARIO_NAO_EH_TERAPEUTA})

    const agendamentos = await Agendamento.find({ terapeuta: terapeutaId }).select("-__v")

    const mensagem = (agendamentos.length == 0) ? AGENDAMENTO.TERAPEUTA_SEM_AGENDAMENTOS : AGENDAMENTO.TODOS_AGENDAMENTOS_ENCONTRADOS

    res.status(200).json({
      message: mensagem,
      agendamentos: agendamentos
    })
  }
  catch(error)
  {
    return res.status(500).json({message: ERRO.ERRO_INTERNO_NO_SERVIDOR})
  }
}

exports.getAgendamentosPorDia = async (req, res) => {
  try
  {
    const {dia} = req.params // Ex: "2024-05-20"

    if(!dia)
      return res.status(400).json({message: AGENDAMENTO.DIA_NAO_FORNECIDO});

    const inicioDoDia = new Date(dia + "T00:00:00");
    const fimDoDia = new Date(dia + "T23:59:59.999");

    if(isNaN(inicioDoDia))
      return res.status(400).json({message: AGENDAMENTO.DIA_EM_FORMATO_INVALIDO});

    const agendamentos = await Agendamento.find({
      inicio: { $gte: inicioDoDia, $lte: fimDoDia }
    }).select("-__v");

    const mensagem = (agendamentos.length == 0) ? AGENDAMENTO.DIA_SEM_AGENDAMENTOS : AGENDAMENTO.TODOS_AGENDAMENTOS_ENCONTRADOS

    res.status(200).json({
      message: mensagem,
      agendamentos: agendamentos
    });
  }
  catch (error)
  {
    console.log(error)
    return res.status(500).json({ message: ERRO.ERRO_INTERNO_NO_SERVIDOR });
  }
}

exports.getMeusAgendamentos = async (req, res) => {
  try
  {
    const terapeutaId = req.user.sub

    if(req.user.role != ROLES.TERAPEUTA)
      return res.status(400).json({message: USUARIO.VOCE_NAO_EH_TERAPEUTA})

    const agendamentos = await Agendamento.find({terapeuta: terapeutaId}).select("-__v")

    const mensagem = (agendamentos.length == 0) ? AGENDAMENTO.VOCE_NAO_TEM_AGENDAMENTOS : AGENDAMENTO.TODOS_AGENDAMENTOS_ENCONTRADOS

    res.status(200).json({
      message: mensagem,
      agendamentos: agendamentos
    })
  }
  catch(error)
  {
    return res.status(500).json({message: ERRO.ERRO_INTERNO_NO_SERVIDOR})
  }
}

exports.getMeusAgendamentosPorDia = async (req, res) => {
  try
  {
    const terapeutaId = req.user.sub;
    const {dia} = req.params;

    if(!dia)
      return res.status(400).json({message: AGENDAMENTO.DIA_NAO_FORNECIDO});

    if(req.user.role != ROLES.TERAPEUTA)
      return res.status(400).json({message: USUARIO.VOCE_NAO_EH_TERAPEUTA})

    const inicioDoDia = new Date(dia + "T00:00:00");
    const fimDoDia = new Date(dia + "T23:59:59.999");

    if(isNaN(inicioDoDia))
      return res.status(400).json({message: AGENDAMENTO.DIA_EM_FORMATO_INVALIDO});

    const agendamentos = await Agendamento.find({
      terapeuta: terapeutaId,
      inicio: { $gte: inicioDoDia, $lte: fimDoDia }
    }).select("-__v");

    const mensagem = (agendamentos.length == 0) ? AGENDAMENTO.VOCE_NAO_TEM_AGENDAMENTOS_PARA_ESSE_DIA : AGENDAMENTO.TODOS_AGENDAMENTOS_ENCONTRADOS

    res.status(200).json({
      message: mensagem,
      agendamentos: agendamentos
    });
  }
  catch(error)
  {
    return res.status(500).json({ message: ERRO.ERRO_INTERNO_NO_SERVIDOR });
  }
}

exports.getDisponibilidadeGeral = async (req, res) => {
  const DURACAO_SLOT_MINUTOS = 60;
  const INTERVALO_MINUTOS = INTERVALO_TERAPEUTA_MINUTOS
  
  try {
      const { dia } = req.query;

      // --- 2. PREPARAÇÃO DAS DATAS ---
      const inicioDoDia = new Date(dia + "T00:00:00");
      const fimDoDia = new Date(dia + "T23:59:59");
      
      // --- 3. BUSCAS EFICIENTES (Duas chamadas ao DB) ---
      
      // a) Buscar TODOS os terapeutas
      const todosTerapeutas = await Usuario.find({ role: 'terapeuta' })
                                            .select('nome'); // Pegamos _id e nome

      // b) Buscar TODOS os agendamentos daquele dia
      const todosAgendamentosDoDia = await Agendamento.find({
          inicio: { $gte: inicioDoDia, $lte: fimDoDia }
      });

      // --- 4. MAPEAR AGENDAMENTOS (Para performance) ---
      // Cria um "dicionário" (Map) para agrupar os agendamentos por terapeuta
      const agendamentosPorTerapeuta = new Map();

      for (const agendamento of todosAgendamentosDoDia) {
          const terapeutaIdStr = agendamento.terapeuta.toString();
          
          if (!agendamentosPorTerapeuta.has(terapeutaIdStr)) {
              agendamentosPorTerapeuta.set(terapeutaIdStr, []);
          }
          agendamentosPorTerapeuta.get(terapeutaIdStr).push(agendamento);
      }

      // --- 5. PROCESSAR A DISPONIBILIDADE DE CADA UM ---
      const bufferMs = minutosParaMs(INTERVALO_MINUTOS);
      
      // O array final que será retornado
      const disponibilidadeGeral = [];

      // Loop principal: Para cada terapeuta que encontramos...
      for (const terapeuta of todosTerapeutas) {
          const terapeutaIdStr = terapeuta._id.toString();
          
          // a) Pega os agendamentos reais (do nosso Map) ou um array vazio
          const agendamentosReais = agendamentosPorTerapeuta.get(terapeutaIdStr) || [];

          // b) Cria os "blocos virtuais" (com buffer)
          const blocosOcupados = agendamentosReais.map(ag => {
              const inicioVirtual = new Date(ag.inicio.getTime() - bufferMs);
              const fimVirtual = new Date(ag.fim.getTime() + bufferMs);
              return { inicio: inicioVirtual, fim: fimVirtual };
          });

          // c) Testa os slots de 1h (Lógica idêntica à anterior)
          const horariosDisponiveis = [];
          for (let hora = HORA_INICIO_TRABALHO; hora < HORA_FIM_TRABALHO; hora++) {
              
              const slotInicio = new Date(inicioDoDia);
              slotInicio.setHours(hora, 0, 0, 0);
              const slotFim = new Date(slotInicio.getTime() + minutosParaMs(DURACAO_SLOT_MINUTOS));

              let slotEstaOcupado = false;
              for (const bloco of blocosOcupados) {
                  if ((slotInicio < bloco.fim) && (slotFim > bloco.inicio)) {
                      slotEstaOcupado = true;
                      break;
                  }
              }

              if (!slotEstaOcupado) {
                  horariosDisponiveis.push(String(hora).padStart(2, '0') + ':00');
              }
          }

          // d) Adiciona o resultado ao array final
          disponibilidadeGeral.push({
              terapeutaId: terapeuta._id,
              nome: terapeuta.nome,
              horarios: horariosDisponiveis
          });
      }

      // --- 6. Retornar a Lista Completa ---
      res.status(200).json(disponibilidadeGeral);

  } catch (error) {
      console.error("Erro ao buscar disponibilidade geral:", error);
      res.status(500).json({ message: "Erro interno do servidor." });
  }
}
