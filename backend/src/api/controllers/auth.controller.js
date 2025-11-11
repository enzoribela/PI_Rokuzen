const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")

const Usuario = require("../../models/Usuario.model")

const {
  MONGO_DUPLICATE_KEY,
  MONGOOSE_VALIDATION_ERROR,
  NOME_DE_ERRO_GENERICO
} = require("../../constants/error.constants")

const {
  AUTH,
  ERRO,
  VALIDACAO
} = require("../../constants/responseMessages.constants")

exports.register = async (req, res) => {
  try
  {
    const usuario = new Usuario(req.body)

    await usuario.save()

    res.status(201).json({message: AUTH.USUARIO_CRIADO})
  }
  catch(error)
  {
    // Conflito de unicidade
    if(error.code == MONGO_DUPLICATE_KEY)
    {
      if(error.keyValue.username)
        return res.status(409).json({message: AUTH.USERNAME_EM_USO})

      return res.status(409).json({message: ERRO.UNICIDADE})
    }

    // Problema de validação em geral
    if(error.name == MONGOOSE_VALIDATION_ERROR)
    {
      const errorMessages = Object.values(error.errors).map(err => err.message)

      return res.status(400).json({
        message: ERRO.VALIDACAO,
        erros: errorMessages
      })
    }

    // Senha inválida
    if(error.name == NOME_DE_ERRO_GENERICO && error.message == VALIDACAO.GERAL.SENHA_INVALIDA)
    {
      return res.status(400).json({
        message: ERRO.VALIDACAO,
        erros: [VALIDACAO.GERAL.SENHA_INVALIDA]
      })
    }

    return res.status(500).json({message: ERRO.ERRO_INTERNO_NO_SERVIDOR}) // código 500, internal server error
  }
}

exports.login = async (req, res) => {
  const username = req.body.username
  const password = req.body.password

  // Testa se o campo username ou o campo password estão vazios
  if(!username || !password)
    return res.status(400).json({message: AUTH.CREDENCIAIS_INVALIDAS})  // Status 400: Bad Request

  const usuario = await Usuario.findOne({username: username}).select("+password")

  // Verifica se o usuário existe
  if(!usuario)
    return res.status(401).json({message: AUTH.CREDENCIAIS_INVALIDAS})  // Status 401: Sem autorização

  // Verifica se a senha está correta
  const senhaEstaCerta = await bcrypt.compare(password, usuario.password)
  if(!senhaEstaCerta)
    return res.status(401).json({message: AUTH.CREDENCIAIS_INVALIDAS})  // Status 401: Sem autorização

  // Cria o payload do token
  const payload = {
    sub: usuario._id,   // sub significa subject ou sujeito, esse campo representa de qual usuario é esse token, guardando o id dele
    nome: usuario.nome,
    role: usuario.role
  }

  // Cria o token
  const token = jwt.sign(
    payload,
    process.env.JWT_SECRET,
    {expiresIn: "1h"}
  )

  res.cookie('token', token, {
    httpOnly: true,  // Não pode ser acessado por JS no frontend
    secure: false,   // Em dev, use false. Em produção (HTTPS), use true.
    sameSite: 'Lax', // 'Lax' é necessário para dev cross-portas
    maxAge: 3600000  // 1 hora (em milissegundos)
  });

  res.status(200).json({
    message: AUTH.LOGIN_FEITO,
    user: {
      nome: usuario.nome,
      role: usuario.role
    }
  })
}
