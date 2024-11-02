const CLIENT_ID = "1000.NWRY2C51S8GH236LC9T9F7EJL3D1ZD";
const REDIRECT_URI =
  "https://3bf7-2804-2ee8-82-c8c6-414f-cf2f-f426-961e.ngrok-free.app/callback"; // Redireciona para o backend

const Login = () => {
  const handleLogin = () => {
    const authUrl = `https://accounts.zoho.com/oauth/v2/auth?response_type=code&client_id=${CLIENT_ID}&scope=ZohoBigin.modules.ALL&access_type=offline&redirect_uri=${encodeURIComponent(
      REDIRECT_URI
    )}`;
    window.location.href = authUrl;
  };

  return (
    <div>
      <h1>Integração OAuth 2.0 com Bigin</h1>
      <button onClick={handleLogin}>Login com Bigin</button>
      <TokenComponent />
    </div>
  );
};

import { useState } from "react";
import axios from "axios";

const TokenComponent = () => {
  const [accessToken, setAccessToken] = useState("");
  const [refreshToken, setRefreshToken] = useState("");
  const [expiresIn, setExpiresIn] = useState("");

  const getTokens = async () => {
    try {
      console.log("Obtendo tokens...");
      const response = await axios.post("https://3bf7-2804-2ee8-82-c8c6-414f-cf2f-f426-961e.ngrok-free.app/get-tokens");
      const { access_token, refresh_token, expires_in } = response.data;

      setAccessToken(access_token);
      setRefreshToken(refresh_token);
      setExpiresIn(expires_in);

      console.log("Access Token:", access_token);
      console.log("Refresh Token:", refresh_token);
      console.log("Expires In:", expires_in);
    } catch (error: any) {
      console.error("Erro ao obter tokens:", error.response.data);
    }
  };

  const refreshTokenHandler = async () => {
    console.log("Renovando o token...");
    try {
      const response = await axios.post("https://3bf7-2804-2ee8-82-c8c6-414f-cf2f-f426-961e.ngrok-free.app/refresh-token", {
        refresh_token: refreshToken,
      });
      const { access_token, expires_in } = response.data;

      setAccessToken(access_token);
      setExpiresIn(expires_in);

      console.log("Novo Access Token:", access_token);
      console.log("Expires In:", expires_in);
    } catch (error: any) {
      console.error("Erro ao renovar o token:", error.response.data);
    }
  };

  return (
    <div>
      <button onClick={getTokens}>Obter Tokens</button>
      <button onClick={refreshTokenHandler}>Renovar Access Token</button>

      {accessToken && (
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
        </div>
      )}
    </div>
  );
};

export default Login;
