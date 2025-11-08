const express = require("express")
const router = express.Router()

const usuarioController = require("../controllers/usuario.controller")
const authMiddleware = require("../../middlewares/auth.middleware")
const checkRole = require("../../middlewares/checkRole.middleware")

const PERMISSIONS = require("../../constants/permission.constants")

// Rotas públicas

// Rotas protegidas

// Rotas proibidas
router.get(
  "/:id",
  authMiddleware,
  checkRole(PERMISSIONS.USUARIO.LER),
  usuarioController.getUsuarioById
)

router.get(
  "/",
  authMiddleware,
  checkRole(PERMISSIONS.USUARIO.LER),
  usuarioController.getTodosUsuarios
)

router.put(
  "/:id",
  authMiddleware,
  checkRole(PERMISSIONS.USUARIO.ATUALIZAR),
  usuarioController.updateUsuarioById
)

router.delete(
  "/:id",
  authMiddleware,
  checkRole(PERMISSIONS.USUARIO.DELETAR),
  usuarioController.deleteUsuarioById
)

module.exports = router
