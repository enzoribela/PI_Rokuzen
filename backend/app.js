require('dotenv').config()

const express = require("express")

const conectaAoBancoDeDados = require("./src/config/database")
const configuraExpress = require("./src/config/express")

// Importação das rotas
const authRoutes = require("./src/api/routes/auth.routes")

const app = express()

configuraExpress(app)

// Direcionamento das rotas
app.use("/auth", authRoutes)

// Exporta o app para uso dos testes (caso façamos)
module.exports = app

// Só executa essa parte do código caso esse seja o arquivo principal em execução
// ou seja, só vai executar esse código quando o servidor for ligado de fato e não durante os testes
// Isso é necessário pois os testes não funcionam sem isso
if(require.main === module)
{
  const PORT = process.env.PORT
  
  conectaAoBancoDeDados()
  
  app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`)
  })
}
