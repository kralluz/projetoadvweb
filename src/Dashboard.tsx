// src/Dashboard.js

import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";

const Dashboard = () => {
  const location = useLocation();
  const [accessToken, setAccessToken] = useState("");
  const [refreshToken, setRefreshToken] = useState("");
  const [expiresIn, setExpiresIn] = useState("");
  const [users, setUsers] = useState([]);
  const [tokenInfo, setTokenInfo] = useState<any>(null); // Novo estado para informações do token
  const [error, setError] = useState("");
  const [loadingFetch, setLoadingFetch] = useState(false); // Estado para mostrar carregamento ao buscar usuários
  const [loadingVerify, setLoadingVerify] = useState(false); // Estado para mostrar carregamento ao verificar token
  const [verifySuccess, setVerifySuccess] = useState(""); // Mensagem de sucesso ao verificar token

  useEffect(() => {
    // Função para extrair os parâmetros da URL
    const getQueryParams = () => {
      const params = new URLSearchParams(location.search);
      return {
        access_token: params.get("access_token"),
        refresh_token: params.get("refresh_token"),
        expires_in: params.get("expires_in"),
      };
    };

    const { access_token, refresh_token, expires_in }: any = getQueryParams();

    if (access_token && refresh_token) {
      console.log("Tokens recebidos:", {
        access_token,
        refresh_token,
        expires_in,
      });
      setAccessToken(access_token);
      setRefreshToken(refresh_token);
      setExpiresIn(expires_in);

      // Armazene os tokens no localStorage para persistência
      localStorage.setItem("access_token", access_token);
      localStorage.setItem("refresh_token", refresh_token);
      localStorage.setItem("expires_in", expires_in);
    } else {
      console.warn("Access token ou refresh token não recebidos.");
    }
  }, [location.search]);

  const fetchDeactiveUsers = async () => {
    if (!accessToken) {
      setError("Access Token não disponível.");
      return;
    }

    setLoadingFetch(true);
    setError("");
    setVerifySuccess("");

    try {
      const response = await axios.get(
        "https://3bf7-2804-2ee8-82-c8c6-414f-cf2f-f426-961e.ngrok-free.app/api/deactive-users",
        {
          headers: {
            Authorization: `Zoho-oauthtoken ${accessToken}`,
          },
        }
      );

      setUsers(response.data.data); // Ajuste conforme a estrutura da resposta da API
    } catch (err: any) {
      console.error("Erro ao buscar usuários deativos:", err.response?.data);
      setError("Falha ao buscar usuários de ativos.");
    } finally {
      setLoadingFetch(false);
    }
  };

  // Nova função para verificar o token
  const verifyToken = async () => {
    if (!accessToken) {
      setError("Access Token não disponível.");
      return;
    }

    setLoadingVerify(true);
    setError("");
    setVerifySuccess("");
    setTokenInfo(null);

    try {
      const response = await axios.get(
        "https://3bf7-2804-2ee8-82-c8c6-414f-cf2f-f426-961e.ngrok-free.app/api/verify-token",
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      console.log("Informações do Token:", response.data);
      setTokenInfo(response.data);
      setVerifySuccess("Token verificado com sucesso!");
    } catch (err: any) {
      console.error("Erro ao verificar o token:", err.response?.data);
      setError("Falha ao verificar o token.");
    } finally {
      setLoadingVerify(false);
    }
  };

  return (
    <div>
      <h2>Dashboard</h2>
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

          <button onClick={fetchDeactiveUsers} disabled={loadingFetch}>
            {loadingFetch ? "Buscando..." : "Buscar Usuários Deativos"}
          </button>

          {/* Botão para verificar o token */}
          <button
            onClick={verifyToken}
            disabled={loadingVerify}
            style={{ marginLeft: "10px" }}
          >
            {loadingVerify ? "Verificando..." : "Verificar Token"}
          </button>

          {error && <p style={{ color: "red" }}>{error}</p>}
          {verifySuccess && <p style={{ color: "green" }}>{verifySuccess}</p>}

          {/* Exibir informações do token */}
          {tokenInfo && (
            <div>
              <h3>Informações do Token:</h3>
              <p>
                <strong>Client ID:</strong> {tokenInfo.client_id}
              </p>
              <p>
                <strong>Expires In:</strong> {tokenInfo.expires_in} segundos
              </p>
              <p>
                <strong>Scopes:</strong> {tokenInfo.scope}
              </p>
              <p>
                <strong>Usuário:</strong> {tokenInfo.user?.name} (
                {tokenInfo.user?.email})
              </p>
            </div>
          )}

          {/* Se quiser manter a listagem de usuários deativos */}
          {users.length > 0 ? (
            <div>
              <h3>Usuários Deativos:</h3>
              <ul>
                {users.map((user: any) => (
                  <li key={user.id}>{user.name}</li> // Ajuste conforme a estrutura do usuário
                ))}
              </ul>
            </div>
          ) : (
            <p>Nenhum usuário deativo encontrado.</p>
          )}
        </div>
      ) : (
        <p>Faça login para obter os tokens.</p>
      )}
    </div>
  );
};

export default Dashboard;
