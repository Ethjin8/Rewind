import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Auth.css';

export default function Landing() {
  const [view, setView] = useState(null); // 'login' | 'register'
  const [message, setRegistrationMessage] = useState(null); // display message for registration

  return (
    <div className="login-split">
      <section className="left-side">
        {!view && (
          <>
            <div className="auth-null"> 
            <h1>REWIND</h1>
            <p>Press play on the past</p>

            <div className='auth-options'>
              <button onClick={() => setView('login')} className="bg-blue-400 text-white p-2">Log In</button>
              <button onClick={() => setView('register')} className="bg-green-400 text-white p-2">Sign Up</button>
            </div>
            </div>
          </>
        )}

      {view && (
        <button onClick={() => setView(null)} className="back-button flex-col items-center mt-4">
          Back
        </button>
      )}

      {view === 'login' && (
        <LoginView onSwitch={() => setView('register')} registrationMsg={message} />
      )}

      {view === 'register' && (
        <RegisterView onSwitch={(msg) => {
          setView('login');
          setRegistrationMessage(msg);
        }} />
       )}
      </section>
      <section className="auth-image">
          <img src="/login-image.png" alt="Login"/>
      </section>
    </div>
  );
}

function LoginView({ onSwitch, registrationMsg }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();


  async function handleSubmit(e) {
    // Prevents browser from reloading the entire page
    e.preventDefault();
    setError(null);

    // Request to backend API
    const response = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      // Sent information as a JSON string, Express will turn it back into a JSON object
      body: JSON.stringify({ username: username, password: password })
    });

    // Error handling if response is wrong
    if (!response.ok) {
      const message = await response.text();
      setError(message || 'Login failed. Please try again.');
      return;
    }

    // Successfully obtained tokens, convert the JSON string back into a JSON object
    const data = await response.json();

    // Place in browser that we can store stuff so tokens survive refresh
    localStorage.setItem('accessToken', data.accessToken);
    localStorage.setItem('refreshToken', data.refreshToken);
    navigate('/home', { state: { message: 'Successfully logged in!' } });
  }

  return (
      <section className="auth-page flex flex-col items-start mt-16">
        {registrationMsg && <p className="success-message">{registrationMsg}</p>}
        {error && <p className="error-message" key={error}>{error}</p>}
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
              type="password"
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
          Don't have an account? <a href="/register" onClick={(e) => { e.preventDefault(); onSwitch(); }} className="link underline">Sign up</a>
        </p>
      </section>
  );
}

function RegisterView({ onSwitch }) {
  const [username, setUsername]               = useState('');
  const [password, setPassword]               = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);

    // Verify that passwords are the same
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    const response = await fetch('/api/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: username, password: password })
    });

    if (!response.ok) {
      const data = await response.json().catch(() => null);
      setError(data?.error || 'Account creation failed. Please try again.');
      return;
    }

    onSwitch('Account created! You may now log in.');
  }

  return (
    <div className="auth-page flex-col items-start mt-16">
      {error && <p className="error-message" key={error}>{error}</p>}
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
