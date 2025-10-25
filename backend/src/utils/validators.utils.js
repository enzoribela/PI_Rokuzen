const {
  TAMANHO_MINIMO_SENHA,
  REGEX_EMAIL
} = require("../constants/validation.constants")

const validaEmail = (email) => {
  if(!email) return false

  return REGEX_EMAIL.test(email)
}

const validaSenha = (senha) => {
  if(!senha) return false

  return senha.length >= TAMANHO_MINIMO_SENHA
}

function validaCPF(cpf) {
  // 1. Remove caracteres não numéricos (pontos, traços, etc.)
  const cpfLimpo = String(cpf).replace(/[^\d]/g, '');

  // 2. Verifica se o CPF tem 11 dígitos
  if (cpfLimpo.length !== 11) {
    return false;
  }

  // 3. Verifica se todos os dígitos são iguais (ex: "11111111111")
  // A regex /^(\d)\1{10}$/ checa se o primeiro dígito (\d) se repete \1 mais 10 vezes {10}
  if (/^(\d)\1{10}$/.test(cpfLimpo)) {
    return false;
  }

  // --- Cálculo do 1º Dígito Verificador ---

  let soma = 0;
  // Multiplica os 9 primeiros dígitos pela sequência decrescente de 10 a 2
  for (let i = 0; i < 9; i++) {
    soma += parseInt(cpfLimpo.charAt(i)) * (10 - i);
  }

  // Calcula o resto da divisão da soma por 11
  let resto = (soma * 10) % 11;

  // Se o resto for 10 ou 11, o dígito verificador é 0
  if (resto === 10 || resto === 11) {
    resto = 0;
  }

  // 4. Verifica se o 1º dígito verificador está correto
  if (resto !== parseInt(cpfLimpo.charAt(9))) {
    return false;
  }

  // --- Cálculo do 2º Dígito Verificador ---

  soma = 0;
  // Multiplica os 10 primeiros dígitos (incluindo o 1º dígito verificador) pela sequência de 11 a 2
  for (let i = 0; i < 10; i++) {
    soma += parseInt(cpfLimpo.charAt(i)) * (11 - i);
  }

  resto = (soma * 10) % 11;

  if (resto === 10 || resto === 11) {
    resto = 0;
  }

  // 5. Verifica se o 2º dígito verificador está correto
  if (resto !== parseInt(cpfLimpo.charAt(10))) {
    return false;
  }

  // Se passou por todas as verificações, o CPF é válido
  return true;
}
