const mongoose = require("mongoose")

const {
  VALIDACAO
} = require("../constants/responseMessages.constants")

const {
  SERVICOS
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
  }
})

const Sala = mongoose.model("Sala", salaSchema)

module.exports = Sala
