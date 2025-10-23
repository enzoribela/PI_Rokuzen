const mongoose = require("mongoose")

const {
  VALIDACAO
} = require("../constants/responseMessages.constants")

const {
  SERVICOS,
  UNIDADES
} = require("../constants/validation.constants")

const agendamentoSchema = mongoose.Schema({
  tipoDeServico: {
    type: String,
    required: [true, VALIDACAO.AGENDAMENTO.TIPO_DE_SERVICO_OBRIGATORIO],
    enum: Object.values(SERVICOS)
  },
  inicio: {
    type: Date,
    required: [true, VALIDACAO.AGENDAMENTO.DATA_DE_INICIO_OBRIGATORIA]
  },
  fim: {
    type: Date,
    required: [true, VALIDACAO.AGENDAMENTO.DATA_DE_FIM_OBRIGATORIA]
  },
  terapeuta: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Usuario",
    required: [true, VALIDACAO.AGENDAMENTO.TERAPEUTA_OBRIGATORIO]
  },
  unidade: {
    type: String,
    required: [true, VALIDACAO.AGENDAMENTO.UNIDADE_OBRIGATORIA],
    enum: Object.values(UNIDADES)
  },
  sala: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Sala",
    required: [true, VALIDACAO.AGENDAMENTO.SALA_OBRIGATORIA]
  },
  nomeDoCliente: {
    type: String,
    required: [true, VALIDACAO.AGENDAMENTO.NOME_DO_CLIENTE_OBRIGATORIO],
    trim: true
  },
  emailDoCliente: {
    type: String,
    required: [true, VALIDACAO.AGENDAMENTO.EMAIL_DO_CLIENTE_OBRIGATORIO],
    trim: true
  },
  telefone: {
    type: String,
    required: [true, VALIDACAO.AGENDAMENTO.TELEFONE_DO_CLIENTE_OBRIGATORIO],
    trim: true
  },
  cpf: {
    type: String,
    required: [true, VALIDACAO.AGENDAMENTO.CPF_DO_CLIENTE_OBRIGATORIO],
    trim: true
  }
})

// Validação para garantir que a data de fim seja após a de início
agendamentoSchema.pre('save', function(next) {
  if(this.fim <= this.inicio)
  {
    next(new Error("A data/hora de término deve ser posterior à data/hora de início"))
  }
  else
  {
    next()
  }
})

const Agendamento = mongoose.model("Agendamento", agendamentoSchema)

module.exports = Agendamento
