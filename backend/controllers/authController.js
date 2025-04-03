import { registerService, loginService, resetPasswordService } from "../services/authService.js";
import { validatePassword } from "../utils/validatePassword.js";
import { validateEmail } from "../utils/validateEmail.js";

export const login = async (req, res) => {
  const { userName, password } = req.body;

  if (!userName || !password) {
    return res.status(400).json({ message: "Please fill in all fields" });
  }

  const result = await loginService(userName, password);

  res.status(result.status).json(result);
};

export const register = async (req, res) => {
  const { userName, email, password } = req.body;

  if (!userName || !email || !password) {
    return res.status(400).json({ message: "Please fill in all fields" });
  }

  const isEmailOk = validateEmail(email);

  if (!isEmailOk) {
    return res.status(400).json({ message: "Email is not valid." });
  }

  const isPasswordWeak = validatePassword(password);

  if (isPasswordWeak) {
    return res.status(400).json({ message: isPasswordWeak });
  }

  const result = await registerService(userName, email, password);

  res.status(result.status).json(result);
};

export const forgotPassword = (req, res) => {
  res.send("forgot-password");
};

export const resetPassword = async (req, res) => {
  const {userName,oldPassword, newPassword} = req.body;
  const result = await resetPasswordService(userName,oldPassword, newPassword);
  res.status(result.status).json(result);
};
