const mongoose = require("mongoose")

const {
  VALIDACAO
} = require("../constants/responseMessages.constants")

const {
  SERVICOS,
  UNIDADES
} = require("../constants/validation.constants")

const salaSchema = mongoose.Schema({
  nome: {
    type: String,
    required: [true, VALIDACAO.SALA.NOME_OBRIGATORIO],
    trim: true
  },
  servicos: {
    type: [String],
    enum: Object.values(SERVICOS),
    default: []
  },
  unidade: {
    type: String,
    required: [true, VALIDACAO.SALA.UNIDADE_OBRIGATORIA],
    enum: Object.values(UNIDADES)
  }
})

salaSchema.index({nome: 1, unidade: 1}, {unique: true})

const Sala = mongoose.model("Sala", salaSchema)

module.exports = Sala
