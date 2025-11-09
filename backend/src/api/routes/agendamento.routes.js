const express = require("express")
const router = express.Router()

const agendamentoController = require("../controllers/agendamento.controller")
const authMiddleware = require("../../middlewares/auth.middleware")
const checkRole = require("../../middlewares/checkRole.middleware")

const PERMISSIONS = require("../../constants/permission.constants")

// Rotas públicas

// Rotas protegidas
router.post(
  "/",
  authMiddleware,
  agendamentoController.criaAgendamento
)

router.get(
  "/:id",
  authMiddleware,
  agendamentoController.getAgendamentoById
)

router.get(
  "/",
  authMiddleware,
  agendamentoController.getTodosAgendamentos
)

// Rotas restritas
router.put(
  "/:id",
  authMiddleware,
  checkRole(PERMISSIONS.AGENDAMENTO.ATUALIZAR),
  agendamentoController.updateAgendamentoById
)

router.delete(
  "/:id",
  authMiddleware,
  checkRole(PERMISSIONS.AGENDAMENTO.DELETAR),
  agendamentoController.deleteAgendamentoById
)

module.exports = router
