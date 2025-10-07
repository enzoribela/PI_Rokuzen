const protocolo = "http://"
const baseURL = "localhost:8080"

async function login()
{
  const usernameInput = document.getElementById("username")
  const passwordInput = document.getElementById("password")

  const username = usernameInput.value
  const password = passwordInput.value

  const URLCompleta = `${protocolo}${baseURL}/login`

  try
  {
    await axios.post(URLCompleta, {username: username, password: password})
    
    document.getElementById("p1").textContent = "OK, login deu certo"
  }
  catch (error)
  {
    document.getElementById("p1").textContent = error.response.data.erro
  }
}
