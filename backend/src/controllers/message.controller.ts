import { Request, Response } from "express";
import cloudinary from "../libs/cloudinary";
import { getReceiverSocketId, io } from "../libs/socket";
import Message from "../models/message.model";
import User from "../models/user.model";

export async function getUserForSidebar(
  req: Request,
  res: Response
): Promise<any> {
  try {
    const loggedInUserId = req.user?._id;

    const filterdUser = await User.find({
      _id: { $ne: loggedInUserId },
    }).select("-password");

    res.status(200).json(filterdUser);
  } catch (error) {
    console.log(`error in getUserForSidebar function, ${getUserForSidebar}`);
    return res.status(500).json({ message: "Internal server error" });
  }
}

export async function getMessages(req: Request, res: Response): Promise<any> {
  try {
    const { id: userToChatId } = req.params;
    const senderId = req.user?._id;

    const messages = await Message.find({
      $or: [
        { senderId: senderId, receiverId: userToChatId },
        { senderId: userToChatId, receiverId: senderId },
      ],
    });

    return res.status(200).json(messages);
  } catch (error) {
    console.log(`error in getMessages function, ${getUserForSidebar}`);
    return res.status(500).json({ message: "Internal server error" });
  }
}

export async function sendMessage(req: Request, res: Response): Promise<any> {
  try {
    const { text, image } = req.body;
    const { id: receiverId } = req.params;
    const senderId = req.user?._id;

    let imageUrl;
    if (image) {
      const uploadedResponse = await cloudinary.uploader.upload(image);
      imageUrl = uploadedResponse.secure_url;
    }

    const newMessage = new Message({
      senderId,
      receiverId,
      text,
      image: imageUrl,
    });

    await newMessage.save();

    const receiverSocketId = getReceiverSocketId(receiverId);
    if (receiverId) {
      io.to(receiverSocketId).emit("newMessage", newMessage);
    }

    res.status(201).json(newMessage);
  } catch (error) {
    console.log(`error in sendMessage function, ${getUserForSidebar}`);
    return res.status(500).json({ message: "Internal server error" });
  }
}
