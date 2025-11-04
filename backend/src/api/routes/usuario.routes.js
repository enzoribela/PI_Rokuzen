const express = require("express")
const router = express.Router()

const usuarioController = require("../controllers/usuario.controller")
const authMiddleware = require("../../middlewares/auth.middleware")
const checkRole = require("../../middlewares/checkRole.middleware")

const {
  PERMISSAO_PARA_VER_OS_DADOS_DOS_USUARIOS
} = require("../../constants/permission.constants")

// Rotas públicas

// Rotas protegidas

// Rotas proibidas
router.get(
  "/:id",
  authMiddleware,
  checkRole(PERMISSAO_PARA_VER_OS_DADOS_DOS_USUARIOS),
  usuarioController.getUsuarioById
)

router.get(
  "/",
  authMiddleware,
  checkRole(PERMISSAO_PARA_VER_OS_DADOS_DOS_USUARIOS),
  usuarioController.getTodosUsuarios
)

module.exports = router
