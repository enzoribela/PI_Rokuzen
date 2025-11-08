const express = require("express")
const router = express.Router()

const salaController = require("../controllers/sala.controller")
const authMiddleware = require("../../middlewares/auth.middleware")
const checkRole = require("../../middlewares/checkRole.middleware")

const PERMISSIONS = require("../../constants/permission.constants")

// Rotas públicas

// Rotas protegidas
router.get(
  "/:id",
  authMiddleware,
  salaController.getSalaById
)

router.get(
  "/",
  authMiddleware,
  salaController.getTodasSalas
)

// Rotas restritas
router.post(
  "/",
  authMiddleware,
  checkRole(PERMISSIONS.SALA.CRIAR),
  salaController.criaSala
)

router.put(
  "/:id",
  authMiddleware,
  checkRole(PERMISSIONS.SALA.ATUALIZAR),
  salaController.updateSalaById
)

router.delete(
  "/:id",
  authMiddleware,
  checkRole(PERMISSIONS.SALA.DELETAR),
  salaController.deleteSalaById
)

module.exports = router
