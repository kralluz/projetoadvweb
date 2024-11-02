const CLIENT_ID = "1000.03QPZ4FQUNZJOD4KR88F5NRAZV9I1E";
const REDIRECT_URI = 'https://3bf7-2804-2ee8-82-c8c6-414f-cf2f-f426-961e.ngrok-free.app/callback'; // Redireciona para o backend

const Login = () => {
  const handleLogin = () => {
    const authUrl = `https://accounts.zoho.com/oauth/v2/auth?response_type=code&client_id=${CLIENT_ID}&scope=ZohoBigin.modules.ALL&access_type=offline&redirect_uri=${encodeURIComponent(REDIRECT_URI)}`;
    window.location.href = authUrl;
  };

  return (
    <div>
      <h1>Integração OAuth 2.0 com Bigin</h1>
      <button onClick={handleLogin}>Login com Bigin</button>
    </div>
  );
};

export default Login;
