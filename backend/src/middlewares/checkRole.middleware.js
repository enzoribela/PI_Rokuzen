const {
  AUTH
} = require("../constants/responseMessages.constants")

const checkRole = (rolesPermitidos) => {
  return (req, res, next) => {
    // As informações do payload do token não estavam no corpo da requisição
    if (!req.user)
      return res.status(401).json({message: AUTH.TOKEN_NAO_ENCONTRADO});

    const userRole = req.user.role

    if(rolesPermitidos.includes(userRole))
      next()
    else
      res.status(403).json({message: AUTH.NAO_TEM_PERMISSAO});
  }
}

module.exports = checkRole
