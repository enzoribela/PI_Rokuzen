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
