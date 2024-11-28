import mongoose from "mongoose";

export async function connectToDb() {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI as string);

    console.log(`Mongo DB connected: ${conn.connection.host}`);
  } catch (error) {
    console.log(error);
  }
}
