const jwt = require("jsonwebtoken")

const {
  JWT_EXPIRED_ERROR,
  JWT_INVALID_ERROR,
  API
} = require("../constants/error.constants")

const {
  AUTH,
  ERRO
} = require("../constants/responseMessages.constants")

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization

  // Checa se o token foi enviado
  if(!authHeader)
    return res.status(401).json({message: AUTH.TOKEN_NAO_FORNECIDO});

  // Checa se o token está formatado corretamente
  const parts = authHeader.split(" ");
  if(parts.length != 2 || parts[0].toLowerCase() != "bearer")
    return res.status(401).json({message: AUTH.TOKEN_MAL_FORMATADO});

  const token = parts[1];

  // Tenta fazer o decode do token para obter as informações que estão no payload
  try
  {
    const decodedPayload = jwt.verify(token, process.env.JWT_SECRET)
    req.user = decodedPayload

    return next()
  }
  catch(error)
  {
    // O token está expirado
    if(error.name == JWT_EXPIRED_ERROR) {
      return res.status(401).json({
        code: API.TOKEN_EXPIRADO,
        message: AUTH.TOKEN_EXPIROU
      })
    }

    // O token é inválido
    if(error.name == JWT_INVALID_ERROR) {
      return res.status(401).json({
        code: API.TOKEN_INVALIDO,
        message: AUTH.TOKEN_INVALIDO
      })
    }

    // Algum outro erro inesperado
    return res.status(500).json({message: ERRO.ERRO_INTERNO_NO_SERVIDOR})
  }
}

module.exports = authMiddleware
