const mongoose = require("mongoose")
const Agendamento = require("../../models/Agendamento.model")

const {checaDisponibilidade} = require("../../services/agendamento.service")

const {
  MONGOOSE_VALIDATION_ERROR,
  NOME_DE_ERRO_GENERICO
} = require("../../constants/error.constants")

const {
  AGENDAMENTO,
  ERRO,
  VALIDACAO
} = require("../../constants/responseMessages.constants")

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
