import { Document, ObjectId } from "mongoose";

export interface IUser extends Document {
  fullname: string;
  email: string;
  password: string;
  profilePic?: string;
}

export interface IMessage extends Document {
  senderId: ObjectId | string;
  receiverId: ObjectId | string;
  text?: string;
  image?: string;
}
