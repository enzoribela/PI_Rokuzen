require('dotenv').config()
const express = require("express")
const cors = require("cors")
const mongoose = require("mongoose")
const uniqueValidator = require("mongoose-unique-validator")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const app = express()
const PORT = process.env.PORT

app.use(express.json())
app.use(cors())

const usuarioSchema = mongoose.Schema({
  username: {type: String, required: true, unique: true},
  password: {type: String, required: true}
})

usuarioSchema.plugin(uniqueValidator)
const Usuario = mongoose.model("Usuario", usuarioSchema)

async function conectarAoMongoDB()
{
  await mongoose.connect(process.env.MONGO_URI)
}

app.post("/signup", async (req, res) => {
  try
  {
    const username = req.body.username
    const password = req.body.password
    const senhaCriptografada = await bcrypt.hash(password, 10)
    const usuario = new Usuario({username: username, password: senhaCriptografada})
    const respostaDoMongo = await usuario.save()
    console.log(respostaDoMongo)
    res.status(201).end()  // Status 201: Recurso criado
  }
  catch(error)
  {
    console.log(error)
    res.status(409).end()  // Status 409: Conflito
  }
})

app.post("/login", async (req, res) => {
  const username = req.body.username
  const password = req.body.password
  const usuario = await Usuario.findOne({username: username})

  if(!usuario)
  {
    return res.status(401).json({mensagem: "credenciais inválidas"})  // Status 401: Sem autorização
  }
  
  const senhaEstaCerta = await bcrypt.compare(password, usuario.password)
  if(!senhaEstaCerta)
  {
    return res.status(401).json({mensagem: "credenciais inválidas"})  // Status 401: Sem autorização
  }

  const payload = {
    sub: usuario._id,   // sub significa subject ou sujeito, esse campo representa de qual usuario é esse token, guardando o id dele
    username: username  // no futuro podemos adicionar o campo role, que indica a papel/posição do usuario (recepcionista, gerente, admin/sócio)
  }
  const token = jwt.sign(
    payload,
    process.env.JWT_SECRET,
    {expiresIn: "1h"}
  )

  res.status(200).json({token: token})
})

app.listen(PORT, () => {
  try
  {
    conectarAoMongoDB()
    console.log(`Server up and running na porta ${PORT}`)
  }
  catch (error)
  {
    console.log("Erro", e)
  }
})
