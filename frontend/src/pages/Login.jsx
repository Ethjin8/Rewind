import "./Login.css";

function Login() {
  return (
    <div className="login-page">
      <div className="login-card">
        <h1>Login</h1>
        <input type="email" placeholder="Email" />
        <input type="password" placeholder="Password" />
        <button>Log In</button>
      </div>
    </div>
  );
}

export default Login;