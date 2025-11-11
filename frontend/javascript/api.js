export const api = axios.create({
  baseURL: 'http://localhost:8080',
  withCredentials: true 
});

const CODIGO_TOKEN_EXPIRADO = "TOKEN_EXPIRADO"
const PATH_TELA_DE_LOGIN = "/frontend/html/telaLogin.html"

// 2. Adicione o Interceptor global de erro 401 (Sessão Expirada)
api.interceptors.response.use(
  
  // Se a resposta for sucesso, apenas a retorne
  (response) => response, 
  
  // Se a resposta for erro
  (error) => {
    if(error.response)
    {
      const status = error.response.status;
      const responseData = error.response.data; 

      if(status === 401 && responseData.code === CODIGO_TOKEN_EXPIRADO)
      {
        console.warn('Sessão expirada. Redirecionando para o login...');
        
        localStorage.removeItem('user');
        
        if (window.location.pathname !== PATH_TELA_DE_LOGIN)
          window.location.href = PATH_TELA_DE_LOGIN;
      }
    }
    
    // Retorna o erro para o 'catch' local da função original
    return Promise.reject(error);
  }
);