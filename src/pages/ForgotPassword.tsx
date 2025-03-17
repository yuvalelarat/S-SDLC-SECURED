import React, { useState } from "react";
import { TextField } from "../components/textField";
import { WhiteCard } from "../components/whiteCard";
import { validatePassword } from "../auth/validatePassword";
import { validateEmail } from "../auth/validateEmail";

export default function ForgotPassword() {
  const [oldPassword, setOldPassword] = useState<string>("");
  const [newPassword, setNewPassword] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  return (
    <WhiteCard>
      <h2 className="text-2xl font-bold pb-4 text-black">Reset password</h2>
      <form>
        <div className="py-4">
          <TextField
            placeholder="Old Password"
            containerStyle="mb-4"
            textFieldStyle="mb-4"
            onChange={(e) => setOldPassword(e.target.value)}
            type="password"
          />
        </div>
        <div className={error ? "pt-4" : "py-4"}>
          <TextField
            placeholder="New Password"
            containerStyle="mb-4"
            textFieldStyle="mb-4"
            onChange={(e) => setNewPassword(e.target.value)}
            type="password"
          />
          <div className="min-h-5 pb-4">
            {<p className="text-red-500 text-sm">{`${error ? error : ""}`}</p>}
          </div>
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 hover:cursor-pointer"
        >
          Change password
        </button>
      </form>
    </WhiteCard>
  );
}
