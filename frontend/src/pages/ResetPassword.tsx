import { useState } from "react";
import { TextField } from "../components/textField";
import { WhiteCard } from "../components/whiteCard";
import { useNavigate } from "react-router-dom";

export default function ResetPassword() {
  const [oldPassword, setOldPassword] = useState<string>("");
  const [newPassword, setNewPassword] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  if (!token) {
    return (
      <WhiteCard>
        <h2 className="text-2xl font-bold pb-4 text-black text-center">Please login to access this page.</h2>
        <p
          className="text-blue-500 text-md text-center hover:cursor-pointer p-1"
          onClick={() => navigate("/login")}
        >
          Go to login.
        </p>
      </WhiteCard>
    );
  }

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
