import React, { useState } from "react";
import { TextField } from "../components/textField";
import { WhiteCard } from "../components/whiteCard";
import { validatePassword } from "../auth/validatePassword";
import { validateEmail } from "../auth/validateEmail";
import { useNavigate } from "react-router-dom";

export default function RegisterPage() {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateEmail(email)) {
      setError("Invalid email format.");
      return;
    }

    const passwordError = validatePassword(password);
    if (passwordError) {
      setError(passwordError);
      return;
    }

    setError(null);

    const response = await fetch("/api/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
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
    <WhiteCard>
      <h2 className="text-2xl font-bold pb-4 text-black">Register</h2>
      <form onSubmit={handleRegister}>
        <div className="py-4">
          <TextField
            placeholder="Email"
            containerStyle="mb-4"
            textFieldStyle="mb-4"
            onChange={(e) => setEmail(e.target.value)}
            type="email"
          />
        </div>
        <div className="py-4">
          <TextField
            placeholder="Username"
            containerStyle="mb-4"
            textFieldStyle="mb-4"
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div className={error ? "pt-4" : "py-4"}>
          <TextField
            placeholder="Password"
            containerStyle="mb-4"
            textFieldStyle="mb-4"
            onChange={(e) => setPassword(e.target.value)}
            type="password"
          />
          <div className="min-h-5 pb-4">
            {<p className="text-red-500 text-sm">{`${error ? error : ""}`}</p>}
          </div>
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 hover:cursor-pointer"
          onClick={handleRegister}
        >
          Register
        </button>
      </form>
      <div className="flex justify-center items-center pt-3">
        <div className="hover:cursor-pointer p-1">
          <p
            className="text-blue-500 text-sm"
            onClick={() => navigate("/forgot-password")}
          >
            Forgot password? click here!
          </p>
        </div>
      </div>
    </WhiteCard>
  );
}
