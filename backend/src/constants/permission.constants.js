const {
  ROLES
} = require("../constants/validation.constants")

const PERMISSION_CONSTANTS = {
  PERMISSAO_PARA_CADASTRO: [
    ROLES.GERENTE,
    ROLES.MASTER
  ]
}

module.exports = Object.freeze(PERMISSION_CONSTANTS)
