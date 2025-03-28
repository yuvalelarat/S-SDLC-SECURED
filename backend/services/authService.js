import bcrypt from "bcrypt";
import { AppDataSource } from "../config/data-source.js";
import User from "../models/userModel.js";
import { generateToken } from "../utils/JWTutils.js";

export async function loginService(userName, password) {
    try {
        const userRepository = AppDataSource.getRepository(User);

        const user = await userRepository.findOne({ where: { userName } });

        if (!user) {
            return { status: 404, message: "Invalid username or password" };
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return { status: 400, message: "Invalid username or password" };
        }

        const token = generateToken(user);

        return { status: 200, message: "Login successful", token };

    } catch (error) {
        console.error(error);
        return { status: 500, message: "Internal Server Error", error: error.message };
    }
}

export async function registerService(userName, email, password) {
    try {
        const userRepository = AppDataSource.getRepository(User);

        const nonUniqueEmail = await userRepository.findOne({ where: { email } });

        if (nonUniqueEmail) {
            return { status: 400, message: "Email already exists" };
        }

        const nonUniqueUserName = await userRepository.findOne({ where: { userName } });

        if (nonUniqueUserName) {
            return { status: 400, message: "Username already exists" };
        }

        const saltRounds = 10;
        const salt = await bcrypt.genSalt(saltRounds);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = userRepository.create({
            userName,
            email,
            password: hashedPassword,
            salt,
        });

        await userRepository.save(newUser);

        return { status: 201, message: "User registered successfully" };
    } catch (error) {
        console.error(error);
        return { status: 500, message: "Internal Server Error", error: error.message };
    }
}
