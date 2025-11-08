const mongoose = require("mongoose")
const Sala = require("../../models/Sala.model")

const {
  MONGOOSE_VALIDATION_ERROR,
  MONGO_DUPLICATE_KEY
} = require("../../constants/error.constants")

const {
  SALA,
  ERRO,
  VALIDACAO
} = require("../../constants/responseMessages.constants")

exports.criaSala = async (req, res) => {
  try
  {
    const sala = new Sala(req.body)

    await sala.save()

    res.status(201).json({message: SALA.CRIADA_COM_SUCESSO})
  }
  catch(error)
  {
    // Conflito de unicidade
    if(error.code == MONGO_DUPLICATE_KEY)
    {
      return res.status(409).json({message: VALIDACAO.SALA.NOME_EM_USO_NA_UNIDADE})
    }

    // Problema de validação
    if(error.name == MONGOOSE_VALIDATION_ERROR)
    {
      const errorMessages = Object.values(error.errors).map(err => err.message)

      return res.status(400).json({
        message: ERRO.VALIDACAO,
        erros: errorMessages
      })
    }

    return res.status(500).json({message: ERRO.ERRO_INTERNO_NO_SERVIDOR}) // código 500, internal server error
  }
}

exports.getSalaById = async (req, res) => {
  try
  {
    const {id} = req.params

    if(!id)
      return res.status(400).json({message: SALA.ID_NAO_FORNECIDO})

    if(!mongoose.Types.ObjectId.isValid(id))
      return res.status(400).json({message: SALA.ID_FORNECIDO_INVALIDO})

    const sala = await Sala.findById(id).select("-__v")

    if(!sala)
      return res.status(400).json({message: SALA.SALA_NAO_ENCONTRADA})

    res.status(200).json({
      message: SALA.SALA_ENCONTRADA,
      sala: sala
    })
  }
  catch(error)
  {
    return res.status(500).json({message: ERRO.ERRO_INTERNO_NO_SERVIDOR}) // código 500, internal server error
  }
}

exports.getTodasSalas = async (req, res) => {
  try
  {
    const salas = await Sala.find({}).select("-__v")

    res.status(200).json({
      message: SALA.TODAS_AS_SALAS_ENCONTRADAS,
      salas: salas
    })
  }
  catch(error)
  {
    return res.status(500).json({message: ERRO.ERRO_INTERNO_NO_SERVIDOR}) // código 500, internal server error
  }
}

exports.updateSalaById = async (req, res) => {
  try
  {
    const {id} = req.params

    if(!id)
      return res.status(400).json({message: SALA.ID_NAO_FORNECIDO})

    if(!mongoose.Types.ObjectId.isValid(id))
      return res.status(400).json({message: SALA.ID_FORNECIDO_INVALIDO})

    const{nome, servicos, unidade} = req.body

    const sala = await Sala.findById(id).select("-__v")

    if(!sala)
      return res.status(400).json({message: SALA.SALA_NAO_ENCONTRADA})

    if(nome) sala.nome = nome
    if(servicos) sala.servicos = servicos
    if(unidade) sala.unidade = unidade

    await sala.save()

    res.status(200).json({
      message: SALA.SALA_ATUALIZADA,
      sala: sala
    })  
  }
  catch(error)
  {
    if(error.code == MONGO_DUPLICATE_KEY)
    {
      return res.status(409).json({message: VALIDACAO.SALA.NOME_EM_USO_NA_UNIDADE})
    }

    if(error.name == MONGOOSE_VALIDATION_ERROR)
    {
      const errorMessages = Object.values(error.errors).map(err => err.message)

      return res.status(400).json({
        message: ERRO.VALIDACAO,
        erros: errorMessages
      })
    }

    return res.status(500).json({message: ERRO.ERRO_INTERNO_NO_SERVIDOR})
  }
}

exports.deleteSalaById = async (req, res) => {
  try
  {
    const {id} = req.params

    if(!id)
      return res.status(400).json({message: SALA.ID_NAO_FORNECIDO})

    if(!mongoose.Types.ObjectId.isValid(id))
      return res.status(400).json({message: SALA.ID_FORNECIDO_INVALIDO})

    const sala = await Sala.findByIdAndDelete(id).select("-__v")

    if(!sala)
      return res.status(400).json({message: SALA.SALA_NAO_ENCONTRADA})

    res.status(200).json({
      message: SALA.SALA_DELETADA,
      sala: sala
    })
  }
  catch(error)
  {
    return res.status(500).json({message: ERRO.ERRO_INTERNO_NO_SERVIDOR})
  }
}
