const mongoose = require("mongoose")
const bcrypt = require("bcrypt")
const {validaSenha} = require("../utils/validators.utils")

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

usuarioSchema.pre("save", async function(next) {
  const usuario = this

  if (!usuario.isModified("password"))
    return next();

  // 1. Valida a senha
  if(!validaSenha(usuario.password))
    return next(new Error(VALIDACAO.GERAL.SENHA_INVALIDA))

  // 2. Faz o hashing
  try
  {
    const senhaHasheada = await bcrypt.hash(usuario.password, 10)
    usuario.password = senhaHasheada
    next()
  }
  catch(error)
  {
    next(error);
  }
})

const Usuario = mongoose.model("Usuario", usuarioSchema)

module.exports = Usuario
