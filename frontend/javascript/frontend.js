const protocolo = "http://"
const baseURL = `localhost:8080`

async function login(event)
{
  event.preventDefault(); // Evita o recarregamento da página
  const usernameInput = document.getElementById("usuario")
  const passwordInput = document.getElementById("senha")

  const username = usernameInput.value
  const password = passwordInput.value

  const URLCompleta = `${protocolo}${baseURL}/login`

  if(!username || !password)
  {
    alert("Preencha todos os campos")
  }
  else
  {
    try
    {
      const response = await axios.post(URLCompleta, {username: username, password: password})
      const token = response.data.token
      localStorage.setItem('jwt', token);

      window.location.href = "../html/telaInicial.html"
    }
    catch (error)
    {
      alert("Credenciais inválidas")
    }
  }
}
