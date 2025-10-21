const RESPONSE_MESSAGES = {
  AUTH: {
    
  },

  // Mensagens de erro genéricas
  ERRO: {
    UNICIDADE: "Um campo único já existe",
    VALIDACAO: "Dados inválidos. Por favor, verifique os campos obrigatórios e formatos",
    ERRO_INTERNO_NO_SERVIDOR: "Ocorreu um erro no servidor, tente novamente mais tarde"
  },

  // Mensagens de validação, usadas nos models
  VALIDACAO: {
    GERAL: {
      USERNAME_OBRIGATORIO: "O username é obrigatório",
      SENHA_OBRIGATORIA: "A senha é obrigatória",
      ROLE_OBRIGATORIA: "O cargo é obrigatório",
      SENHA_INVALIDA: "A senha está inválida"
    },

    USUARIO: {
      NOME_OBRIGATORIO: "O nome do usuário é obrigatório"
    },
    
    SALA: {
      NOME_OBRIGATORIO: "O nome (ou número) da sala é obrigatório"
    }
  }
}

module.exports = Object.freeze(RESPONSE_MESSAGES)
