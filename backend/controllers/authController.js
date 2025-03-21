import { registerService } from "../services/authService.js";

export const login = (req, res) => {
  res.send("login");
};

export const register = async (req, res) => {
  const { userName, email, password } = req.body;

  if (!userName || !email || !password) {
    return res.status(400).json({ message: "Please fill in all fields" });
  }

  const result = await registerService(userName, email, password);

  res.status(result.status).json({ message: result.message });
};

export const forgotPassword = (req, res) => {
  res.send("forgot-password");
};

export const resetPassword = (req, res) => {
  res.send("reset-password");
};
