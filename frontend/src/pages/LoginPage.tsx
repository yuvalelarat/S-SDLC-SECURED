import { useState } from "react";
import { TextField } from "../components/textField";
import { WhiteCard } from "../components/whiteCard";

export default function LoginPage() {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!username || !password) {
      setError("Please fill in all fields.");
      return;
    }

    setError(null);

    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    });
    if (response.ok) {
      // Handle successful login
    } else {
      // Handle login error
    }
  };

  return (
    <WhiteCard>
      <h2 className="text-2xl font-bold pb-4 text-black">Login</h2>
      <form onSubmit={handleLogin}>
        <div className="py-4">
          <TextField
            placeholder="Username"
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
          onClick={handleLogin}
        >
          Login
        </button>
      </form>
    </WhiteCard>
  );
}
