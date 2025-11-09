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
  "/meus/:dia",
  authMiddleware,
  agendamentoController.getMeusAgendamentosPorDia
);

router.get(
  "/meus",
  authMiddleware,
  agendamentoController.getMeusAgendamentos
);

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
router.get(
  "/terapeuta/:terapeutaId",
  authMiddleware,
  checkRole(PERMISSIONS.AGENDAMENTO.LER),
  agendamentoController.getAgendamentosPorTerapeuta
);

router.get(
  "/dia/:dia",
  authMiddleware,
  checkRole(PERMISSIONS.AGENDAMENTO.LER),
  agendamentoController.getAgendamentosPorDia
);

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
