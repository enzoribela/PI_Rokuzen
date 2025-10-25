const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")

const Usuario = require("../../models/Usuario.model")

const {
  MONGO_DUPLICATE_KEY,
  MONGOOSE_VALIDATION_ERROR,
  NOME_DE_ERRO_GENERICO
} = require("../../constants/error.constants")

const {
  AUTH,
  ERRO,
  VALIDACAO
} = require("../../constants/responseMessages.constants")

exports.register = async (req, res) => {
  try
  {
    const usuario = new Usuario(req.body)

    await usuario.save()

    res.status(201).json({message: AUTH.USUARIO_CRIADO})
  }
  catch(error)
  {
    // Conflito de unicidade
    if(error.code == MONGO_DUPLICATE_KEY)
    {
      if(error.keyValue.username)
        return res.status(409).json({message: AUTH.USERNAME_EM_USO})

      return res.status(409).json({message: ERRO.UNICIDADE})
    }

    // Problema de validação em geral
    if(error.name == MONGOOSE_VALIDATION_ERROR)
    {
      const errorMessages = Object.values(error.errors).map(err => err.message)

      return res.status(400).json({
        message: ERRO.VALIDACAO,
        erros: errorMessages
      })
    }

    // Senha inválida
    if(error.name == NOME_DE_ERRO_GENERICO && error.message == VALIDACAO.GERAL.SENHA_INVALIDA)
    {
      return res.status(400).json({
        message: ERRO.VALIDACAO,
        erros: [VALIDACAO.GERAL.SENHA_INVALIDA]
      })
    }

    return res.status(500).json({message: ERRO.ERRO_INTERNO_NO_SERVIDOR}) // código 500, internal server error
  }
}

exports.login = async (req, res) => {
  
}
