// src/Login.js
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";

const CLIENT_ID = "1000.NWRY2C51S8GH236LC9T9F7EJL3D1ZD";
const REDIRECT_URI =
  "https://<seu-subdomínio-ngrok>.ngrok-free.app/callback"; // Certifique-se de que esta URL inclui /callback

const Login = () => {
  const [searchParams] = useSearchParams();
  const [accessToken, setAccessToken] = useState("");
  const [refreshToken, setRefreshToken] = useState("");
  const [expiresIn, setExpiresIn] = useState("");

  useEffect(() => {
    const access_token = searchParams.get("access_token");
    const refresh_token = searchParams.get("refresh_token");

    if (access_token && refresh_token) {
      setAccessToken(access_token);
      setRefreshToken(refresh_token);
      // Opcional: Armazene os tokens no localStorage ou cookies para persistência
      localStorage.setItem("access_token", access_token);
      localStorage.setItem("refresh_token", refresh_token);
    }
  }, [searchParams]);

  const handleLogin = () => {
    const zohoAuthUrl = `https://accounts.zoho.com/oauth/v2/auth?response_type=code&client_id=${CLIENT_ID}&scope=ZohoBigin.modules.ALL&access_type=offline&redirect_uri=${encodeURIComponent(
      REDIRECT_URI
    )}`;
    window.location.href = zohoAuthUrl;
  };

  const refreshTokenHandler = async () => {
    try {
      const response = await axios.post(
        "https://<seu-subdomínio-ngrok>.ngrok-free.app/refresh-token",
        {
          refresh_token: refreshToken,
        }
      );
      const { access_token, expires_in } = response.data;

      setAccessToken(access_token);
      setExpiresIn(expires_in);

      console.log("Novo Access Token:", access_token);
      console.log("Expires In:", expires_in);

      // Atualize o localStorage, se estiver usando
      localStorage.setItem("access_token", access_token);
    } catch (error: any) {
      console.error("Erro ao renovar o token:", error.response?.data);
    }
  };

  return (
    <div>
      <h1>Integração OAuth 2.0 com Bigin</h1>
      <button onClick={handleLogin}>Login com Bigin</button>
      
      {accessToken ? (
        <div>
          <p>
            <strong>Access Token:</strong> {accessToken}
          </p>
          <p>
            <strong>Refresh Token:</strong> {refreshToken}
          </p>
          <p>
            <strong>Expira em:</strong> {expiresIn} segundos
          </p>
          <button onClick={refreshTokenHandler}>Renovar Access Token</button>
        </div>
      ) : (
        <p>Faça login para obter os tokens.</p>
      )}
    </div>
  );
};

export default Login;
