const express = require("express")
const router = express.Router()

const authController = require("../controllers/auth.controller")
const authMiddleware = require("../../middlewares/auth.middleware")
const checkRole = require("../../middlewares/checkRole.middleware")

const {
  PERMISSION_CONSTANTS
} = require("../../constants/permission.constants")

// Rotas públicas

// Rotas protegidas

// Rotas restritas
router.post(
  "/register",
  // authMiddleware,
  // checkRole(PERMISSION_CONSTANTS.PERMISSAO_PARA_CADASTRO),
  authController.register
)

module.exports = router
