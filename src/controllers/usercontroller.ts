import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { UserModel } from "../models/usermodel";


export const register = async (req: Request, res: Response) => {
    try {
        const { name, email, password, role } = req.body;
        const existingUser = await UserModel.findOne({ email })
        if (existingUser)
            return res.status(400).json({
                message: "user already exist"
            })

        const hashedpassword = await bcrypt.hash(password, 10);
        const user = new UserModel({ name, email, password: hashedpassword, role });
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
        const user = await UserModel.findOne({ email });
        if (!user) {
            return res.status(404).json({
                message: "User not found"
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
            }
        });

    } catch (error) {
        console.error("Login Error:", error);
        return res.status(500).json({
            message: "internal server error"
        });
    }
};


export const getUsers = async (req: Request, res: Response) => {
    try {
        const users = await UserModel.find();
        return res.status(200).json({
            message: "user fetching successfully",
            count: users.length, users
        })
    } catch (error) {
        console.error("error fetching user", error)
        return res.status(500).json({
            message: "internal server error", error
        })
    }
}


export const deleteUser = async (req: Request, res: Response) => {
    try {
        const userId = req.params.id;

        // const user = await userModel.findById(userId);
        if (!userId) {
            return res.status(404).json({
                message: "User not found",
            });
        }

        await UserModel.findByIdAndDelete(userId);

        return res.status(200).json({
            message: "User deleted successfully",
        });
    } catch (error) {
        console.error("Error deleting user:", error);
        return res.status(500).json({
            message: "Internal server error",
        });
    }
};


export const updateUser = async (req: Request, res: Response) => {
    try {
         const UserId = req.params.Id;
        const { name, email, password, role } = req.body;
        const image = req.file ? `${req.protocol}://${req.get("host")}/uploads/profile/${req.file.filename}` : undefined;

        const updateFields: any = {};

        if (name) updateFields.name = name;
        if (email) updateFields.email = email;
        if (image) updateFields.image = image;

        if (password) {
            const hashPassword = await bcrypt.hash(password, 10);
            updateFields.password = hashPassword;
        }
        const updatedUser = await UserModel.findByIdAndUpdate(
            { _id: UserId },
            updateFields,
            { new: true }
        );

        if (!updateUser) {
            return res.status(404).json({
                message: "user not found "
            })
        }

        return res.status(200).json({
            message: "user update successfully",
            updateUser,
        })


    } catch (error) {
        console.log("error updating user ", error)
        return res.status(500).json({
            message: "internal server error"
        })

    }
};



export const getUserById = async (req: Request, res: Response) => {
  try {
    const userId = req.params.id;

    

    const user = await UserModel.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({
      message: "User fetched successfully",
      user,
    });
  } catch (error) {
    console.error("Error fetching user", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteAllUsers = async (req: Request, res: Response) => {
  try {
    const result = await UserModel.deleteMany({});
    res.status(200).json({
      message: "All users deleted successfully",
      deletedCount: result.deletedCount,
    });
  } catch (error) {
    console.error("Delete All Users Error:", error);
    res.status(500).json({
      message: "Failed to delete users",
    });
  }
};
