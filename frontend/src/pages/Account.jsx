import { useState } from 'react';
import './Login.css';

export default function Account() {
  const [view, setView] = useState(null); // 'login' | 'register'

  return (
    <div className="login-split">
        {!view && (
          <>
            <div className="auth-null"> 
            <h1>REWIND</h1>
            <p>Keep track of your backlong</p>

            <div className='auth-options'>
              <button onClick={() => setView('login')} className="bg-blue-400 text-white p-2">Log In</button>
              <button onClick={() => setView('register')} className="bg-green-400 text-white p-2">Sign Up</button>
            </div>
            </div>
          </>
        )}

      {view === 'login' && (
        <LoginView onSwitch={() => setView('register')} />
      )}

      {view === 'register' && (
        <RegisterView onSwitch={() => setView('login')} />
       )}

      {view && (
        <button onClick={() => setView(null)} className="auth-page absolute top-4 right-4 text-sm underline">Back</button>
      )}

      <section className="auth-image">
          <img src="/login-image.png" alt="Login"/>
      </section>
    </div>
  );
}

function LoginView({ onSwitch }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  function handleSubmit(e) {
    e.preventDefault();
    //implement
  }

  return (
      <section className="auth-page flex flex-col items-start mt-16">
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
      </section>
  );
}

function RegisterView({ onSwitch }) {
  const [username, setUsername]               = useState('');
  const [password, setPassword]               = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    //implement
  }

  return (
    <div className="auth-page flex-col items-start mt-16">
      <h1>CREATE ACCOUNT</h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="flex flex-col items-start">
          <label>Username</label>
          <input
            id="username"
            placeholder="Enter your username"
            name="username"
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
            type="password"
            placeholder="Enter your password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="p-2 border"
          />
        </div>

        <div className="flex flex-col items-start">
          <label>Confirm Password</label>
          <input
            id="confirmPassword"
            type="password"
            placeholder="Re-enter your password"
            name="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            className="p-2 border"
          />
        </div>

        <button className="bg-blue-400 text-white p-2 mt-2">Sign Up</button>
      </form>

      <p>
        Already have an account?{' '}
        <a href="/login" onClick={(e) => { e.preventDefault(); onSwitch(); }} className="link underline">Log in</a>
      </p>
    </div>
  );
}
