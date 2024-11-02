const CLIENT_ID = '1000.MTXU3XP2J5QT75FW2JF1743YCBBGAK';
const REDIRECT_URI = 'https://projetoadvweb.vercel.app/callback';

const Login = () => {
  const handleLogin = () => {
    const authUrl = `https://accounts.zoho.com/oauth/v2/auth?response_type=code&client_id=${CLIENT_ID}&scope=ZohoBigin.modules.ALL&access_type=offline&redirect_uri=${REDIRECT_URI}`;
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
