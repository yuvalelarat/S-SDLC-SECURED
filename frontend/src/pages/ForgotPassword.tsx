import React, { useState } from "react";
import { TextField } from "../components/textField";
import { WhiteCard } from "../components/whiteCard";
import { validateEmail } from "../auth/validateEmail";
import { useNavigate } from "react-router-dom";

export default function ForgotPassword() {
  const [email, setEmail] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateEmail(email)) {
      setError("Invalid email format.");
      return;
    }

    setError(null);

    //   const response = await fetch("/api/auth/forgot-password", {
    //     method: "POST",
    //     headers: {
    //       "Content-Type": "application/json",
    //     },
    //     body: JSON.stringify({ email }),
    //   });
    //   if (response.ok) {
    //   } else {
    //   }
  };

  const token = localStorage.getItem("token");

  if (token) {
    return (
      <WhiteCard>
        <h2 className="text-2xl font-bold pb-4 text-black text-center">You are already logged in!</h2>
        <p
          className="text-blue-500 text-md text-center hover:cursor-pointer p-1"
          onClick={() => navigate("/")}
        >
          Go to home page.
        </p>
      </WhiteCard>
    );
  }

  return (
    <WhiteCard>
      <h2 className="text-2xl font-bold pb-4 text-black">Reset password</h2>
      <form>
        <div className={error ? "pt-4" : "py-4"}>
          <TextField
            placeholder="Email"
            containerStyle="mb-4"
            textFieldStyle="mb-4"
            onChange={(e) => setEmail(e.target.value)}
            type="email"
          />
          <div className="min-h-5 pb-4">
            {<p className="text-red-500 text-sm">{`${error ? error : ""}`}</p>}
          </div>
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 hover:cursor-pointer"
          onClick={handleSubmit}
        >
          Submit
        </button>
      </form>
    </WhiteCard>
  );
}
