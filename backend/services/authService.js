import { AppDataSource } from "../config/data-source.js";
import User from "../models/userModel.js";

export async function registerService(userName, email, password) {
    try {
        const userRepository = AppDataSource.getRepository(User);
    
        const nonUniqueEmail = await userRepository.findOne({ where: { email } });
    
        if (nonUniqueEmail) {
        return { status: 400, message: "Email already exists" };
        }

        const nonUniqueUserName = await userRepository.findOne({ where: { username: userName } });
        
        if (nonUniqueUserName) {
        return { status: 400, message: "user name already exists" };
        }
    
        const newUser = userRepository.create({
        username: userName,
        email,
        password,
        });
    
        await userRepository.save(newUser);
    
        return { status: 201, message: "User registered successfully", user: newUser };
    } catch (error) {
        console.error(error);
        return { status: 500, message: "Internal Server Error" };
    }
}
