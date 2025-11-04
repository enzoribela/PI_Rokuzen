const express = require("express")
const router = express.Router()

const usuarioController = require("../controllers/usuario.controller")
const authMiddleware = require("../../middlewares/auth.middleware")
const checkRole = require("../../middlewares/checkRole.middleware")

// Rotas públicas

// Rotas protegidas

// Rotas proibidas

module.exports = router
