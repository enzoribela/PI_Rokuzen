const express = require("express")
const router = express.Router()

const agendamentoController = require("../controllers/agendamento.controller")
const authMiddleware = require("../../middlewares/auth.middleware")

// Rotas públicas

// Rotas protegidas
router.post(
  "/",
  authMiddleware,
  agendamentoController.criaAgendamento
)

// Rotas restritas

module.exports = router
