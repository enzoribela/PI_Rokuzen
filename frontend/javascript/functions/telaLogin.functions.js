import {api} from "../api.js"

export function handlesTogglePassword()
{
  const toggleButton = document.getElementById('toggle-password');
  
  if(toggleButton)
  {
    toggleButton.addEventListener('click', () => {
      const passwordInput = document.getElementById('password-field');
      const toggleIcon = document.getElementById('toggleIcon');

      if(passwordInput.type === 'password')
      {
        passwordInput.type = 'text';
        toggleIcon.classList.remove('fa-eye-slash');
        toggleIcon.classList.add('fa-eye');
      }
      else
      {
        passwordInput.type = 'password';
        toggleIcon.classList.remove('fa-eye');
        toggleIcon.classList.add('fa-eye-slash');
      }
    });
  }
}

export function handlesLogin()
{
  const loginForm = document.getElementById('login-form');

  loginForm.addEventListener('submit', async (event) => {
    // Impede que a página recarregue
    event.preventDefault(); 

    const username = document.getElementById('username-field').value;
    const password = document.getElementById('password-field').value;

    try
    {
      const response = await api.post('/auth/login', {
        username: username,
        password: password
      });

      localStorage.setItem('user', JSON.stringify(response.data.user));
      
      window.location.href = '/html/telaPrincipalFuncionario.html';

    }
    catch(error)  // Lida com casos de erro (status code do tipo 4XX e 5XX)
    {
      if (error.response)
      {
        // Mostra a mensagem de erro que veio do backend
        alert(error.response.data.message); 
      }
      else
      {
        alert('Não foi possível conectar ao servidor.');
      }
    }
  });
}
