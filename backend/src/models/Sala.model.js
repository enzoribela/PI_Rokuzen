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
    unique: true,
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

const Sala = mongoose.model("Sala", salaSchema)

module.exports = Sala
