import { useEffect } from "react";
import axios from "axios";

const CLIENT_ID = "1000.03QPZ4FQUNZJOD4KR88F5NRAZV9I1E";
const CLIENT_SECRET = "41985732bdc954f2f0d510392898166e36bced2717";
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

  return <div>Processasndo...</div>;
};

export default Callback;
