const express = require("express")
const router = express.Router()

const authController = require("../controllers/auth.controller")
const authMiddleware = require("../../middlewares/auth.middleware")
const checkRole = require("../../middlewares/checkRole.middleware")

const {
  PERMISSAO_PARA_CADASTRO
} = require("../../constants/permission.constants")

// Rotas públicas
router.post(
  "/login",
  authController.login
)

// Rotas protegidas

// Rotas restritas
router.post(
  "/register",
  authMiddleware,
  checkRole(PERMISSAO_PARA_CADASTRO),
  authController.register
)

module.exports = router
