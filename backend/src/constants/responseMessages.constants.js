const RESPONSE_MESSAGES = {
  AUTH: {
    USUARIO_CRIADO: "Usuário criado com sucesso",
    USERNAME_EM_USO: "Esse username já está em uso",
    CREDENCIAIS_INVALIDAS: "Credenciais inválidas",
    LOGIN_FEITO: "Login realizado com sucesso",
    TOKEN_NAO_FORNECIDO: "Acesso negado. O token de autenticação não foi fornecido",
    TOKEN_MAL_FORMATADO: "Erro no formato do token. O formato esperado é \"Bearer <token>\"",
    TOKEN_EXPIROU: "Sua sessão expirou. Por favor, faça login novamente",
    TOKEN_INVALIDO: "Token de autenticação inválido",
    TOKEN_NAO_ENCONTRADO: "Acesso negado. O token não foi encontrado no corpo da requisição",
    NAO_TEM_PERMISSAO: "Acesso proibido. Você não tem a permissão necessária para acessar esse recurso"
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
      SENHA_INVALIDA: "A senha está inválida",
      EMAIL_INVALIDO: "Email inválido",
      CPF_INVALIDO: "CPF inválido",
      INTERVALO_DE_TEMPO_INVALIDO: "O período de tempo do agendamento está inválido. A data/hora de término deve ser posterior à data/hora de início"
    },

    USUARIO: {
      NOME_OBRIGATORIO: "O nome do usuário é obrigatório"
    },
    
    SALA: {
      NOME_OBRIGATORIO: "O nome (ou número) da sala é obrigatório",
      UNIDADE_OBRIGATORIA: "A unidade da sala é obrigatória",
      NOME_EM_USO_NA_UNIDADE: "Já existe uma sala com esse nome nessa unidade"
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
      DATA_DE_FIM_OBRIGATORIA: "A data e hora de fim do agendamento são obrigatórias",
      TERAPEUTA_OCUPADO: "Não foi possível registrar esse agendamento pois o terapeuta em questão está ocupado ou em intervalo, nesse horário",
      SALA_OCUPADA: "Não foi possível registrar esse agendamento pois a sala em questão está ocupada ou em limpeza, nesse horário"
    }
  },

  AGENDAMENTO: {
    CRIADO_COM_SUCESSO: "Agendamento registrado com sucesso"
  },

  SALA: {
    CRIADA_COM_SUCESSO: "Sala criada com sucesso"
  },

  USUARIO: {
    ID_NAO_FORNECIDO: "O id do usuário não foi fornecido",
    ID_FORNECIDO_INVALIDO: "O id fornecido é inválido",
    USUARIO_NAO_ENCONTRADO: "Usuário não encontrado",
    USUARIO_ENCONTRADO: "Usuario encontrado com sucesso",
    TODOS_USUARIOS_ENCONTRADOS: "Todos os usuários foram encontrados com sucesso"
  }
}

module.exports = Object.freeze(RESPONSE_MESSAGES)
