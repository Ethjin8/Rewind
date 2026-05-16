import { useState } from 'react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  function handleSubmit(e) {
    e.preventDefault();
    //implement
  }

  return (
    <div className="flex flex-col items-center mt-16">
      <h1>Log In</h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="flex items-center">
          <label className="w-36 text-right mr-4">Email</label>
          <input
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="p-2 border"
          />
        </div>

        <div className="flex items-center">
          <label className="w-36 text-right mr-4">Password</label>
          <input
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="p-2 border"
          />
        </div>

        <button className="bg-blue-400 text-white p-2 mt-2">Log In</button>
      </form>

      <p>
        Don't have an account? <a href="/register" className="text-blue-400 underline">Sign up</a>
      </p>
    </div>
  );
}
