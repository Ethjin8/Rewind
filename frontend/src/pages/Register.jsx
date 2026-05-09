import { useState } from 'react';

export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  function handleSubmit(e) {
    e.preventDefault();
    //implement
  }

  return (
    <div className="flex flex-col items-center mt-16">
      <h1>Create Account</h1>

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

        <div className="flex items-center">
          <label className="w-36 text-right mr-4">Confirm Password</label>
          <input
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            className="p-2 border"
          />
        </div>

        <button className="bg-blue-400 text-white p-2 mt-2">Create Account</button>
      </form>

      <p>
        Already have an account? <a href="/login" className="text-blue-400 underline">Log in</a>
      </p>
    </div>
  );
}
