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
