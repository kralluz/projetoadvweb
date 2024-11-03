// src/Dashboard.js

import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";

const Dashboard = () => {
  const location = useLocation();
  const [accessToken, setAccessToken] = useState("");
  const [refreshToken, setRefreshToken] = useState("");
  const [expiresIn, setExpiresIn] = useState("");
  const [users, setUsers] = useState<any>([]);
  const [error, setError] = useState("");

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
      setAccessToken(access_token);
      setRefreshToken(refresh_token);
      setExpiresIn(expires_in);

      // Opcional: Armazene os tokens no localStorage para persistência
      localStorage.setItem("access_token", access_token);
      localStorage.setItem("refresh_token", refresh_token);
      localStorage.setItem("expires_in", expires_in);
    }
  }, [location.search]);

  const fetchDeactiveUsers = async () => {
    if (!accessToken) {
      setError("Access Token não disponível.");
      return;
    }

    try {
      const response = await axios.get(
        "https://www.zohoapis.com/bigin/v2/users?page=1&per_page=5&type=DeactiveUsers",
        {
          headers: {
            Authorization: `Zoho-oauthtoken ${accessToken}`,
          },
        }
      );

      setUsers(response.data.data); // Ajuste conforme a estrutura da resposta da API
    } catch (err: any) {
      console.error("Erro ao buscar usuários deativos:", err.response?.data);
      setError("Falha ao buscar usuários deativos.");
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
          <button onClick={fetchDeactiveUsers}>Buscar Usuários Deativos</button>

          {error && <p style={{ color: "red" }}>{error}</p>}

          {users.length > 0 && (
            <div>
              <h3>Usuários Deativos:</h3>
              <ul>
                {users.map((user: any) => (
                  <li key={user.id}>{user.name}</li> // Ajuste conforme a estrutura do usuário
                ))}
              </ul>
            </div>
          )}
        </div>
      ) : (
        <p>Faça login para obter os tokens.</p>
      )}
    </div>
  );
};

export default Dashboard;
