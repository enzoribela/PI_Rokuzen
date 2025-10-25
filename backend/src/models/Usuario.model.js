const mongoose = require("mongoose")

const {
  VALIDACAO
} = require("../constants/responseMessages.constants")

const {
  ROLES
} = require("../constants/validation.constants")

const usuarioSchema = mongoose.Schema({
  username: {
    type: String,
    required: [true, VALIDACAO.GERAL.USERNAME_OBRIGATORIO],
    unique: true,
    trim: true
  },
  password: {
    type: String,
    required: [true, VALIDACAO.GERAL.SENHA_OBRIGATORIA],
    select: false
  },
  nome: {
    type: String,
    required: [true, VALIDACAO.USUARIO.NOME_OBRIGATORIO],
    trim: true
  },
  role: {
    type: String,
    required: [true, VALIDACAO.GERAL.ROLE_OBRIGATORIA],
    enum: Object.values(ROLES)
  }
})

const Usuario = mongoose.model("Usuario", usuarioSchema)

module.exports = Usuario
