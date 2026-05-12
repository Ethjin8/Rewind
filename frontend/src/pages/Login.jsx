import "./Login.css";

function Login() {
  return (
    <div className="auth-page">
      <div className="auth-container">
        
        {/*Sign Up*/}
        <div className="sign-log sign-in-card">
          <h1>Sign Up</h1>
          <p>Create a new account</p>

          <input type="text" placeholder="Username" />
          <input type="email" placeholder="Email" />
          <input type="password" placeholder="Password" />

          <button>Sign Up</button>
        </div>

        {/*Log In*/}
        <div className="sign-log log-in-card">
          <h1>Log In</h1>
          <p>Welcome back!</p>

          <input type="email" placeholder="Email" />
          <input type="password" placeholder="Password" />

          <button>Log In</button>
        </div>

      </div>
    </div>
  );
}

export default Login;