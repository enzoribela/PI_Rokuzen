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
  },

  // Definição do tempo de intervalo entre cada sessão em uma sala e com um terapeuta específico
  INTERVALO_TERAPEUTA_MINUTOS: 15,
  INTERVALO_SALA_MINUTOS: 10,

  // Definição dos horários de trabalho dos terapeutas
  HORA_INICIO_TRABALHO: 9,
  HORA_FIM_TRABALHO: 18,

  // Constantes de Senha
  TAMANHO_MINIMO_SENHA: 8,

  // Constantes de Email
  REGEX_EMAIL: /^\S+@\S+\.\S+$/
}

// Congela o objeto para torná-lo imutável
module.exports = Object.freeze(VALIDATION_CONSTANTS)
