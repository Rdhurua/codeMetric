'use client';
import { useState } from 'react';

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await fetch("/api/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await res.json();
    if (data.success) {
      setMessage("✅ Login successful! Reloading...");
      window.location.reload();
    } else {
      setMessage(`❌ ${data.message}`);
    }
  };

  return (
    <form onSubmit={handleLogin} className="mt-8 p-4 border text-black rounded bg-white shadow-md max-w-md mx-auto">
      <h2 className="text-xl font-semibold mb-4 text-center ">Log In</h2>

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        className="w-full p-2 mb-4 border rounded text-black"
      />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        className="w-full p-2 mb-4 border rounded"
      />

      <button
        type="submit"
        className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
      >
        Log In
      </button>

      {message && <p className="mt-4 text-sm text-center text-gray-700">{message}</p>}
    </form>
  );
};

export default LoginForm;
