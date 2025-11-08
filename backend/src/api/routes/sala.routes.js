const express = require("express")
const router = express.Router()

const salaController = require("../controllers/sala.controller")
const authMiddleware = require("../../middlewares/auth.middleware")
const checkRole = require("../../middlewares/checkRole.middleware")

const PERMISSIONS = require("../../constants/permission.constants")

// Rotas públicas

// Rotas protegidas

// Rotas restritas
router.post(
  "/",
  authMiddleware,
  checkRole(PERMISSIONS.SALA.CRIAR),
  salaController.criaSala
)

module.exports = router
