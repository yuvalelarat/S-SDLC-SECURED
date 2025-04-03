import { registerService, loginService, resetPasswordService } from "../services/authService.js";
import { validatePassword } from "../utils/validatePassword.js";
import { validateEmail } from "../utils/validateEmail.js";
import { decodeToken } from "../utils/JWTutils.js";
import { sendEmail } from "../utils/sendEmail.js";
import crypto from "crypto";

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
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: "Please fill in all fields" });
  }

  const isEmailOk = validateEmail(email);

  if (!isEmailOk) {
    return res.status(400).json({ message: "Email is not valid." });
  }

  const tempPass = crypto.createHash("sha1").update(email).digest("hex");
  sendEmail(email, tempPass)
    .then(() => {
      res.status(200).json({ message: "Password reset email sent successfully." });
    })
    .catch((error) => {
      res.status(500).json({ message: "Failed to send password reset email.", error });
    });
};

export const resetPassword = async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  
  if (!token) {
      return res.status(401).json({ message: "Unauthorized - No Token Provided" });
  }

  const decodedToken = decodeToken(token);

  if (!decodedToken) {
      return res.status(401).json({ message: "Unauthorized - Invalid Token" });
  }
  
  const { userName } = decodedToken;
  if (!userName) {
      return res.status(401).json({ message: "Unauthorized - Invalid Token" });
  }

  const {oldPassword, newPassword} = req.body;

  if (!oldPassword || !newPassword) {
      return res.status(400).json({ message: "Please fill in all fields" });
  }

  const result = await resetPasswordService(userName,oldPassword, newPassword);
  res.status(result.status).json(result);
};
