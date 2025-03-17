import { useState } from "react";
import { TextField } from "../components/textField";
import { WhiteCard } from "../components/whiteCard";

export function LoginPage() {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  return (
    <WhiteCard>
      <h2 className="text-2xl font-bold pb-4 text-black">Login</h2>
      <form>
        <div className="py-4">
          <TextField
            placeholder="Username"
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div className="py-4">
          <TextField
            placeholder="Password"
            type="password"
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded hover:cursor-pointer"
        >
          Login
        </button>
      </form>
    </WhiteCard>
  );
}
