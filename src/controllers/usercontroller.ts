import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { User } from "../models/usermodel";


export const register = async (req: Request, res: Response) => {
    try {
        const { name, email, password, role } = req.body;
        const existingUser = await User.findOne({ email })
        if (existingUser)
            return res.status(400).json({
                message: "user already exist"
            })

        const hashedpassword = await bcrypt.hash(password, 10);
        const user = new User({ name, email, password: hashedpassword, role });
        await user.save();
        return res.status(200).json({
            message: "user registered successfully"
        })
    } catch (error) {
        console.log("error to register")
        return res.status(500).json({
            message: "server error"
        })

    }
}

export const loginUser = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                message: "Email and password are required"
            });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        if (!user.password) {
            return res.status(400).json({
                message: "This account is registered with Google. Please use Google login."
            });
        }

        const matchPassword = await bcrypt.compare(password, user.password);
        if (!matchPassword) {
            return res.status(401).json({
                message: "Invalid password"
            });
        }

        const token = jwt.sign(
            { userId: user._id, email: user.email },
            process.env.JWT_SECRET as string,
            { expiresIn: "1d" }
        );

        return res.status(200).json({
            message: "User is logged in",
            token,
            user: {
                id: user._id,
                email: user.email,
                name: user.name
            }
        });

    } catch (error) {
        console.error("Login Error:", error);
        return res.status(500).json({
            message: "Internal server error"
        });
    }
};