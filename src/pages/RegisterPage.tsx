import React, { useState } from 'react';
import { TextField } from '../components/textField';

export function RegisterPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    const response = await fetch('/api/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password, email }),
    });
    if (response.ok) {
      // Handle successful registration
    } else {
      // Handle registration error
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 w-full">
      <div className="bg-white p-6 rounded shadow-md w-80">
        <h2 className="text-2xl font-bold mb-4">Register</h2>
        <form onSubmit={handleRegister}>
          <div className="mb-4">
            <TextField
              placeholder="Username"
              containerStyle="mb-4"
              textFieldStyle="mb-4"
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <TextField
              placeholder="Password"
              containerStyle="mb-4"
              textFieldStyle="mb-4"
              onChange={(e) => setPassword(e.target.value)}
              type='password'
            />
          </div>
          <div className="mb-4">
            <TextField
              placeholder="Email"
              containerStyle="mb-4"
              textFieldStyle="mb-4"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
          >
            Register
          </button>
        </form>
      </div>
    </div>
  );
}