import mongoose from "mongoose";

const connectDb = async () => {
  if (!process.env.MONGO_URI) {
    throw new Error("Mongo Uri is missing");
  }
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log(`Db Connected`);
  } catch (error) {
    console.log(`MongoDb Error: ${Error}`);
  }
};

export default connectDb;
