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
    },

    AGENDAMENTO: {
      TIPO_DE_SERVICO_OBRIGATORIO: "O tipo de serviço é obrigatório",
      TERAPEUTA_OBRIGATORIO: "O terapeuta é obrigatório",
      UNIDADE_OBRIGATORIA: "A unidade é obrigatória",
      SALA_OBRIGATORIA: "A sala é obrigatória",
      NOME_DO_CLIENTE_OBRIGATORIO: "O nome do cliente é obrigatório",
      EMAIL_DO_CLIENTE_OBRIGATORIO: "O email do cliente é obrigatório",
      TELEFONE_DO_CLIENTE_OBRIGATORIO: "O telefone do cliente é obrigatório",
      CPF_DO_CLIENTE_OBRIGATORIO: "O CPF do cliente é obrigatório",
      DATA_DE_INICIO_OBRIGATORIA: "A data e hora de inicio do agendamento são obrigatórias",
      DATA_DE_FIM_OBRIGATORIA: "A data e hora de fim do agendamento são obrigatórias"
    }
  }
}

module.exports = Object.freeze(RESPONSE_MESSAGES)
