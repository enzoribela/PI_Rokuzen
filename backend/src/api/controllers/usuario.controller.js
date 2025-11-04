const mongoose = require("mongoose")

const Usuario = require("../../models/Usuario.model")

const {
  ERRO,
  USUARIO
} = require("../../constants/responseMessages.constants")

exports.getUsuarioById = async (req, res) => {
  try
  {
    const {id} = req.params

    if(!id)
    {
      return res.status(400).json({message: USUARIO.ID_NAO_FORNECIDO})
    }

    if(!mongoose.Types.ObjectId.isValid(id))
    {
      return res.status(400).json({message: USUARIO.ID_FORNECIDO_INVALIDO})
    }

    const usuario = await Usuario.findById(id).select("-__v")

    if(!usuario)
    {
      return res.status(400).json({message: USUARIO.USUARIO_NAO_ENCONTRADO})
    }

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

}

exports.updateUsuarioById = async (req, res) => {

}

exports.deleteUsuarioById = async (req, res) => {

}
