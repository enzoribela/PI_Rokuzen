const mongoose = require("mongoose")
const Agendamento = require("../../models/Agendamento.model")
const Usuario = require("../../models/Usuario.model")

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
  ROLES
} = require("../../constants/validation.constants")

exports.criaAgendamento = async (req, res) => {
  try {
    const agendamento = new Agendamento(req.body)

    const conflito = await checaDisponibilidade(agendamento.inicio, agendamento.fim, agendamento.terapeuta, agendamento.sala);

    if(conflito)
    {
      let mensagem = conflito.terapeuta.equals(agendamento.terapeuta) ? VALIDACAO.AGENDAMENTO.TERAPEUTA_OCUPADO : VALIDACAO.AGENDAMENTO.SALA_OCUPADA

      return res.status(409).json({message: mensagem})
    }

    await agendamento.save()

    res.status(201).json({ message: AGENDAMENTO.CRIADO_COM_SUCESSO })
  }
  catch (error) {
    // Problema de validação em geral
    if (error.name == MONGOOSE_VALIDATION_ERROR) {
      const errorMessages = Object.values(error.errors).map(err => err.message)

      return res.status(400).json({
        message: ERRO.VALIDACAO,
        erros: errorMessages
      })
    }

    // Intervalo de tempo do agendamento está inválido (o início ocorre depois do fim)
    if (error.name == NOME_DE_ERRO_GENERICO && error.message == VALIDACAO.GERAL.INTERVALO_DE_TEMPO_INVALIDO) {
      return res.status(400).json({
        message: ERRO.VALIDACAO,
        erros: [VALIDACAO.GERAL.INTERVALO_DE_TEMPO_INVALIDO]
      })
    }

    return res.status(500).json({ message: ERRO.ERRO_INTERNO_NO_SERVIDOR }) // código 500, internal server error
  }
}

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
