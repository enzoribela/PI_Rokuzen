const VALIDATION_CONSTANTS = {
  // Constantes de Cargos (Roles)
  ROLES: {
    RECEPCIONISTA: "recepcionista",
    TERAPEUTA: "terapeuta",
    GERENTE: "gerente",
    MASTER: "master"
  },

  // Constantes de serviços disponíveis
  SERVICOS: {
    QUICK_MASSAGE: "Quick Massage",
    MACA: "Maca",
    REFLEXOLOGIA_PODAL: "Reflexologia Podal",
    AURICULOTERAPIA: "Auriculoterapia"
  },

  // Constantes das unidades do Rokuzen
  UNIDADES: {
    GRAND_PLAZA: "Grand Plaza",
    GOLDEN_SQUARE: "Golden Square",
    MOOCA_PLAZA: "Mooca Plaza",
    WEST_PLAZA: "West Plaza"
  }
}

// Congela o objeto para torná-lo imutável
module.exports = Object.freeze(VALIDATION_CONSTANTS)
