import { useState } from 'react';

export default function Register() {
  const [username, setUsername] = useState('');
 // const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    //implement
    //possible code
    {/*
    const username = e.target.username.value;
    const password = e.target.password.value;
    const confirmPassword = e.target.confirmPassword.value;

    if (password !== confirmPassword) {
      alert("Passwords don't match!");
      return;
    }

    try {
    
    const response = await fetch("/api/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ username, password }),
    });

      const data = await response.json();

      if (data.error) {
        alert("Error: " + data.error);
      } else {
        alert("Account created successfully!");
        window.location.href = "/login";
      }
    } catch (err) {
      console.error("Registration failed:", err);
      alert("An error occurred during registration. Please try again.");
    }
  }
  */}
}

  return (
    <div className="auth-page flex flex-col items-start mt-16">
      <h1>Create Account</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="flex flex-col items-start">
          <label >Username</label>
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
            placeholder="Confirm your password"
            name="confirmPassword"
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