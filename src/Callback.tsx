import { useEffect } from "react";
import axios from "axios";

const CLIENT_ID = "1000.MTXU3XP2J5QT75FW2JF1743YCBBGAK";
const CLIENT_SECRET = "692bc700e7487e6e920e4bc089ba2cffe322c98dad";
const REDIRECT_URI = "https://projetoadvweb.vercel.app/callback";

const Callback = () => {
  useEffect(() => {
    const fetchTokens = async () => {
      const params = new URLSearchParams(window.location.search);
      const code = params.get("code");

      if (code) {
        try {
          const response = await axios.post(
            "https://accounts.zoho.com/oauth/v2/token",
            null,
            {
              params: {
                client_id: CLIENT_ID,
                client_secret: CLIENT_SECRET,
                grant_type: "authorization_code",
                code: code,
                redirect_uri: REDIRECT_URI,
              },
              headers: {
                "Content-Type": "application/x-www-form-urlencoded",
              },
            }
          );

          const { access_token, refresh_token } = response.data;

          // Armazenar tokens no localStorage
          localStorage.setItem("access_token", access_token);
          localStorage.setItem("refresh_token", refresh_token);

          // Redirecionar para o dashboard
          window.location.href = "/dashboard";
        } catch (error) {
          console.error("Erro ao trocar o código por tokens:", error);
          alert("Falha na autenticação.");
        }
      } else {
        alert("Código de autorização não encontrado.");
      }
    };

    fetchTokens();
  }, []);

  return <div>Processando...</div>;
};

export default Callback;
