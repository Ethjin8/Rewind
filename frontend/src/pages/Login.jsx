import { useState } from 'react';
import './Login.css';
//import './App.css';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  function handleSubmit(e) {
    e.preventDefault();
    //implement
  }

  return (
    <div className="auth-page flex-col items-start mt-16">
      <h1>LOG IN</h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="flex flex-col items-start">
          <label>Username</label>
          <input
            id="username"
            placeholder="Enter your username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className="p-2 border"
          />
        </div>

        <div className="flex flex-col items-start">
          <label>Password</label>
          <input
            id="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="p-2 border"
          />
        </div>

        <button className="text-white">Log In</button>
      </form>

      <p>
        Don't have an account? <a href="/register" className="link underline">Sign up</a>
      </p>
    </div>
  );
}
