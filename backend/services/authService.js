import crypto from "crypto";
import { AppDataSource } from "../config/data-source.js";
import User from "../models/userModel.js";
import { generateToken } from "../utils/JWTutils.js";
import { validatePassword, checkSamePasswords } from "../utils/validatePassword.js";
import { passwordConfig } from '../utils/passwordConfig.js';
import dotenv from 'dotenv';
dotenv.config();

const secretKey = process.env.SECRET_KEY;

export async function loginService(userName, password) {
    try {
        const userRepository = AppDataSource.getRepository(User);

        const users = await userRepository.query(
            `SELECT * FROM public.users WHERE "userName" = $1`,
            [userName]
        );

        const user = users[0];

        if (!user) {
            return { status: 404, message: "Invalid username or password" };
        }

        const fifteenMinutesAgo = new Date(Date.now() + 15 * 60 * 1000);
        if (user.loginTimeOut && user.loginTimeOut > fifteenMinutesAgo && user.loginAttempts >= passwordConfig.login_attempts) {
            user.loginAttempts = 0;
            user.loginTimeOut = null;
            await userRepository.save(user);
        }

        if (user.loginAttempts >= passwordConfig.login_attempts) {
            return { status: 403, message: "you are blocked from login, you can try again later." };
        }

        const isSamePass = checkSamePasswords(password, user.salt, user.password, secretKey);
        
        if (!isSamePass) {
            user.loginAttempts += 1;
            await userRepository.save(user);
            if (user.loginAttempts >= passwordConfig.login_attempts) {
                user.loginTimeOut = new Date();
                await userRepository.save(user);
                return { status: 403, message: "you are blocked from login, you can try again later." };
            }
            return { status: 400, message: "Invalid username or password" };
        }

        const token = generateToken(user);

        user.loginAttempts = 0;
        user.loginTimeOut = null;
        await userRepository.save(user);

        return { status: 200, message: "Login successful", token };

    } catch (error) {
        console.error(error);
        return { status: 500, message: "Internal Server Error", error: error.message };
    }
}


export async function registerService(userName, email, password) {
    try {
        const userRepository = AppDataSource.getRepository(User);

        const emailCheckQuery = `SELECT * FROM public.users WHERE "email" = $1`;
        const existingEmails = await userRepository.query(emailCheckQuery, [email]);

        if (existingEmails.length > 0) {
            return { status: 400, message: "Email already exists" };
        }

        const userNameCheckQuery = `SELECT * FROM public.users WHERE "userName" = $1`;
        const existingUserNames = await userRepository.query(userNameCheckQuery, [userName]);

        if (existingUserNames.length > 0) {
            return { status: 400, message: "Username already exists" };
        }

        const pass = password;
        const salt = crypto.randomBytes(16).toString('hex');
        const combinedPassword = pass + salt;

        const hmac = crypto.createHmac('sha256', secretKey);
        hmac.update(combinedPassword);
        const hashedPassword = hmac.digest('hex');

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


export async function resetPasswordService(userName, currentPassword, newPassword) {

    const validationResult = validatePassword(newPassword);
    if (validationResult !== null) {
        return { status: 400, message: validationResult };
    }

    try {
        const userRepository = AppDataSource.getRepository(User);
        const user = await userRepository.findOne({ where: { userName } });

        if (!user) {
            return { status: 404, message: "User not found" };
        }

        const isCurrentPasswordCorrect = checkSamePasswords(currentPassword, user.salt, user.password, secretKey);

        if (!isCurrentPasswordCorrect) {
            return { status: 400, message: "Current password is incorrect" };
        }

        const isNewPassSamePass = checkSamePasswords(newPassword, user.salt, user.password, secretKey);

        if (isNewPassSamePass) {
            return { status: 400, message: "New password cannot be the same as old passwords" };
        }

        let passwordList = user.passwordList;

        if (!passwordList) passwordList = []

        if (typeof passwordList === 'string') {
            try {
                passwordList = JSON.parse(passwordList);
            } catch (error) {
                console.error("Error parsing passwordList:", error);
                return { status: 500, message: "Internal Server Error" };
            }
        }

        if (passwordList.length > 0) {
            for (let i = 0; i < passwordConfig.password_history; i++) {
                if (passwordList[i]) {
                    console.log("Checking password history for match:", passwordList[i].oldPass);
                    const matchedPasswords = checkSamePasswords(newPassword, passwordList[i].oldSalt, passwordList[i].oldPass, secretKey);
                    console.log("Matched passwords:", matchedPasswords);
                    if (matchedPasswords) return { status: 400, message: "New password cannot be the same as old passwords" };
                }
            }
        }

        if (passwordList.length > 0) {
            passwordList.unshift({ oldPass: user.password, oldSalt: user.salt })
        } else {
            user.passwordList = [{ oldPass: user.password, oldSalt: user.salt }]
        }

        const pass = newPassword;
        const salt = crypto.randomBytes(16).toString('hex');
        const combinedPassword = pass + salt;

        const hmac = crypto.createHmac('sha256', secretKey);
        hmac.update(combinedPassword);
        const hashedPassword = hmac.digest('hex');

        user.password = hashedPassword;
        user.salt = salt;
        user.tempPass = null;

        await userRepository.save(user);

        return { status: 200, message: "Password changed successfully" };
    } catch (error) {
        console.error(error);
        return { status: 500, message: "Internal Server Error", error: error.message };
    }
}

export async function resetPasswordNoTokenService(email, newPassword) {
    const validationResult = validatePassword(newPassword);
    if (validationResult !== null) {
        return { status: 400, message: validationResult };
    }

    try {
        const userRepository = AppDataSource.getRepository(User);
        const user = await userRepository.findOne({ where: { email } });

        if (!user) {
            return { status: 404, message: "User not found" };
        }

        const isSamePass = checkSamePasswords(newPassword, user.salt, user.password, secretKey);

        if (isSamePass) {
            return { status: 400, message: "New password cannot be the same as old passwords" };
        }

        let passwordList = user.passwordList;

        if (!passwordList) passwordList = []

        if (passwordList.length > 0) {
            for (let i = 0; i < passwordConfig.password_history; i++) {
                if (passwordList[i]) {
                    const matchedPasswords = checkSamePasswords(newPassword, passwordList[i].oldSalt, passwordList[i].oldPass, secretKey);
                    if (matchedPasswords) return { status: 400, message: "New password cannot be the same as old passwords" };
                }
            }
        }

        if (passwordList.length > 0) {
            passwordList.unshift({ oldPass: user.password, oldSalt: user.salt })
        } else {
            user.passwordList = [{ oldPass: user.password, oldSalt: user.salt }]
        }

        const password = newPassword;
        const salt = crypto.randomBytes(16).toString('hex');

        const combinedPassword = password + salt;

        const hmac = crypto.createHmac('sha256', secretKey);
        hmac.update(combinedPassword);
        const hashedPassword = hmac.digest('hex');

        user.password = hashedPassword;
        user.salt = salt;
        user.tempPass = null;

        await userRepository.save(user);

        return { status: 200, message: "Password changed successfully" };
    } catch (error) {
        console.error(error);
        return { status: 500, message: "Internal Server Error", error: error.message };
    }
}

export async function saveTempPasswordService(tempPass, email) {
    if (tempPass === null || email === undefined) {
        return { status: 400, message: "fields cannot be null" };
    }

    try {
        const userRepository = AppDataSource.getRepository(User);
        const user = await userRepository.findOne({ where: { email } });

        if (!user) {
            return { status: 404, message: "User not found" };
        }

        user.tempPass = tempPass;

        await userRepository.save(user);

        return { status: 200, message: "Temp password saved successfully" };
    } catch (error) {
        console.error(error);
        return { status: 500, message: "Internal Server Error", error: error.message };
    }
}

export async function checkTempPasswordService(tempPass, email) {
    if (tempPass === null || email === null) {
        return { status: 400, message: "fields cannot be null" };
    }

    try {
        const userRepository = AppDataSource.getRepository(User);
        const user = await userRepository.findOne({ where: { email } });

        if (!user) {
            return { status: 404, message: "User not found" };
        }

        if (user.tempPass !== tempPass) {
            return { status: 400, message: "Invalid temporary password" };
        }

        return { status: 200, message: "Temporary password is valid" };
    } catch (error) {
        console.error(error);
        return { status: 500, message: "Internal Server Error", error: error.message };
    }
}