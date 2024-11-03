import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";

const Dashboard = () => {
  const location = useLocation();
  const [accessToken, setAccessToken] = useState("");
  const [refreshToken, setRefreshToken] = useState("");
  const [expiresIn, setExpiresIn] = useState("");
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false); // Estado para mostrar carregamento

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
      console.log("Tokens recebidos:", { access_token, refresh_token, expires_in });
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
      console.error("Access Token não disponível.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      console.log("Buscando usuários deativos com o token:", accessToken);
      const response = await axios.get(
        "https://3bf7-2804-2ee8-82-c8c6-414f-cf2f-f426-961e.ngrok-free.app/deactive-users",
        {
          headers: {
            Authorization: `Zoho-oauthtoken ${accessToken}`,
          },
        }
      );

      console.log("Resposta da API:", response.data);
      if (response.data && response.data.data) {
        setUsers(response.data.data); // Ajuste conforme a estrutura da resposta da API
      } else {
        console.warn("Estrutura de resposta inesperada:", response.data);
        setError("Resposta da API não contém dados de usuários.");
      }
    } catch (err: any) {
      console.error("Erro ao buscar usuários deativos:", err);
      if (err.response) {
        console.error("Detalhes do erro da API:", err.response.data);
        setError("Falha ao buscar usuários de ativos: " + (err.response.data.message || "Erro desconhecido"));
      } else {
        setError("Erro de rede ou servidor: " + (err.message || "Erro desconhecido"));
      }
    } finally {
      setLoading(false);
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
          <button onClick={fetchDeactiveUsers} disabled={loading}>
            {loading ? "Carregando..." : "Buscar Usuários Deativos"}
          </button>

          {error && <p style={{ color: "red" }}>{error}</p>}

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
