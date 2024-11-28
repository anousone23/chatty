import { Request, Response } from "express";
import bcryptjs from "bcryptjs";

import User from "../models/user.model";
import { generateToken } from "../libs/utils";
import cloudinary from "../libs/cloudinary";

export async function signup(req: Request, res: Response): Promise<any> {
  try {
    const { fullname, email, password } = req.body;

    if (!fullname || !email || !password)
      return res.status(400).json({ message: "Invalid user data" });

    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be atleast 6 characters long" });
    }

    const user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(password, salt);

    const newUser = new User({
      fullname,
      email,
      password: hashedPassword,
    });

    if (!newUser) return res.status(400).json({ message: "Invalid user data" });

    await newUser.save();
    generateToken(newUser._id as string, res);

    return res.status(201).json({
      _id: newUser._id,
      fullname: newUser.fullname,
      email: newUser.fullname,
      profilePic: newUser.profilePic,
    });
  } catch (error) {
    console.log(`error in signup function, ${error}`);
    return res.status(500).json({ message: "Internal server error" });
  }
}

export async function login(req: Request, res: Response): Promise<any> {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isPasswordCorrect = await bcryptjs.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    generateToken(user._id as string, res);

    return res.status(200).json({
      _id: user._id,
      fullname: user.fullname,
      email: user.email,
      profilePic: user.profilePic,
    });
  } catch (error) {
    console.log(`error in login function, ${error}`);
    return res.status(500).json({ message: "Internal server error" });
  }
}

export async function logout(req: Request, res: Response): Promise<any> {
  try {
    res.cookie("jwt", "", { maxAge: 0 });

    return res.status(200).json({ message: "Logout successfully" });
  } catch (error) {
    console.log(`error in logout function, ${error}`);
    return res.status(500).json({ message: "Internal server error" });
  }
}

export async function updateProfile(req: Request, res: Response): Promise<any> {
  try {
    const userId = req.user?.id;

    const { profilePic } = req.body;
    if (!profilePic) {
      return res.status(400).json({ message: "Profile image is required" });
    }

    const uploadedResponse = await cloudinary.uploader.upload(profilePic);

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { profilePic: uploadedResponse.secure_url },
      { new: true }
    ).select("-password");

    return res.status(200).json(updatedUser);
  } catch (error) {
    console.log(`error from updateProfile function, ${error}`);
    return res.status(500).json({ message: "Internal server error" });
  }
}

export async function checkAuth(req: Request, res: Response): Promise<any> {
  try {
    res.status(200).json(req.user);
  } catch (error) {
    console.log(`error in checkAuth function, ${error}`);
    return res.status(500).json({ message: "Interal server error" });
  }
}
