const mongoose = require("mongoose")

const Usuario = require("../../models/Usuario.model")

const {
  MONGO_DUPLICATE_KEY,
  MONGOOSE_VALIDATION_ERROR,
  NOME_DE_ERRO_GENERICO
} = require("../../constants/error.constants")

const {
  ERRO,
  USUARIO,
  VALIDACAO,
  AUTH
} = require("../../constants/responseMessages.constants")

const {
  ROLES
} = require("../../constants/validation.constants")

exports.getUsuarioById = async (req, res) => {
  try
  {
    const {id} = req.params

    if(!id)
      return res.status(400).json({message: USUARIO.ID_NAO_FORNECIDO})

    if(!mongoose.Types.ObjectId.isValid(id))
      return res.status(400).json({message: USUARIO.ID_FORNECIDO_INVALIDO})

    const usuario = await Usuario.findById(id).select("-__v")

    if(!usuario)
      return res.status(400).json({message: USUARIO.USUARIO_NAO_ENCONTRADO})

    res.status(200).json({
      message: USUARIO.USUARIO_ENCONTRADO,
      user: usuario
    })
  }
  catch(error)
  {
    return res.status(500).json({message: ERRO.ERRO_INTERNO_NO_SERVIDOR}) // código 500, internal server error
  }
}

exports.getTodosUsuarios = async (req, res) => {
  try
  {
    const usuarios = await Usuario.find({}).select("-__v")

    res.status(200).json({
      message: USUARIO.TODOS_USUARIOS_ENCONTRADOS,
      users: usuarios
    })
  }
  catch(error)
  {
    return res.status(500).json({message: ERRO.ERRO_INTERNO_NO_SERVIDOR}) // código 500, internal server error
  }
}

exports.updateUsuarioById = async (req, res) => {
  try
  {
    const {id} = req.params

    if(!id)
      return res.status(400).json({message: USUARIO.ID_NAO_FORNECIDO})

    if(!mongoose.Types.ObjectId.isValid(id))
      return res.status(400).json({message: USUARIO.ID_FORNECIDO_INVALIDO})

    const{username, password, nome, role} = req.body

    // 1. Find
    const usuario = await Usuario.findById(id).select("-__v")

    if(!usuario)
      return res.status(400).json({message: USUARIO.USUARIO_NAO_ENCONTRADO})

    // 2. Modify
    if(username) usuario.username = username
    if(password) usuario.password = password
    if(nome) usuario.nome = nome
    if(role) usuario.role = role

    // 3. Save
    await usuario.save()

    usuario.password = undefined

    res.status(200).json({
      message: USUARIO.USUARIO_ATUALIZADO,
      user: usuario
    })  
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

exports.deleteUsuarioById = async (req, res) => {
  try
  {
    const {id} = req.params

    if(!id)
      return res.status(400).json({message: USUARIO.ID_NAO_FORNECIDO})

    if(!mongoose.Types.ObjectId.isValid(id))
      return res.status(400).json({message: USUARIO.ID_FORNECIDO_INVALIDO})

    const usuario = await Usuario.findByIdAndDelete(id).select("-__v")

    if(!usuario)
      return res.status(400).json({message: USUARIO.USUARIO_NAO_ENCONTRADO})

    res.status(200).json({
      message: USUARIO.USUARIO_DELETADO,
      user: usuario
    })
  }
  catch(error)
  {
    return res.status(500).json({message: ERRO.ERRO_INTERNO_NO_SERVIDOR}) // código 500, internal server error
  }
}

exports.getTodosTerapeutas = async (req, res) => {
  try
  {
    const terapeutas = await Usuario.find({role: ROLES.TERAPEUTA}).select("-__v -username -role")

    res.status(200).json({
      message: USUARIO.TODOS_TERAPEUTAS_ENCONTRADOS,
      terapeutas: terapeutas
    })
  }
  catch(error)
  {
    return res.status(500).json({message: ERRO.ERRO_INTERNO_NO_SERVIDOR}) // código 500, internal server error
  }
}
