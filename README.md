# PI - Rokuzen

## O projeto
### Introdução
Esse software é um projeto desenvolvido por alunos do Instituto Mauá de Tecnologia (IMT) para a disciplina de Projeto Integrador Interdisciplinar voltado para o nosso parceiro, o Rokuzen.
### Funcionalidades
Esse projeto consiste de duas partes principais: um sistema de agendamento de atendimentos voltado para os clientes do Rokuzen e um sistema para uso interno dos funcionários do local. As principais funcionalidades do programa são:
- Clientes:

  Agendamento de um atendimento de maneira autônoma por meio de totens que se encontrariam nas unidades do próprio Rokuzen.

- Funcionários:

  Visualização dos horários de atendimento dos terapeutas.

  Gestão dos terapeutas e das salas disponíveis.

  Controle de agendamentos já marcados

## Tecnologias Utilizadas
- **Frontend**: HTML + CSS + Javascript + [Bootstrap](https://getbootstrap.com/)
- **Backend**: [Node.js](https://nodejs.org/) com o pacote [Express](https://expressjs.com/)
- **Banco de Dados**: [MongoDB](https://www.mongodb.com/)

## Como utilizar o projeto
### Pré-requisitos
1. Ter o [Node.js](https://nodejs.org/) instalado
2. Ter o [MongoDB](https://www.mongodb.com/) instalado e rodando (caso for usar o MongoDB localmente)

### 1. Clonagem do repositório
- Inicialmente clone o repositório usando o seguinte comando:

```bash
git clone https://github.com/enzoribela/PI_Rokuzen
```

### 2. Backend
1. Com um terminal já aberto na pasta do projeto navegue para a pasta do backend usando o seguinte comando:

```bash
cd backend
```

2. Instale as dependências do backend usando o seguinte comando:

```bash
npm install
```

3. Execute um dos seguintes comandos (baseado no seu sistema operacional) para criar o arquivo ``` .env ``` baseado no ``` .env.example ``` e então troque os valores das variáveis de ambiente no arquivo ``` .env ``` para os valores que serão usados no projeto

```bash
# No Windows
copy .env.example .env

# No macOS / Linux
cp .env.example .env
```

4. Inicie a aplicação do backend executando um dos seguintes comandos:
```bash
# Para ambiente de desenvolvimento
npm run dev

# Para ambiente de produção
npm start
```

5. Para acessar o site visite a seguinte URL, trocando 'PORTA' pela porta em que o backend está rodando. Ela foi definida no arquivo ``` .env ```
```
http://localhost:PORTA/html/telaPrincipal.html
```
