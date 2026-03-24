import mongoose from "mongoose"

export default async function conectDb() {
  try {
    await mongoose.connect(process.env.DB_URL!);
    console.log("connected to mongodb");
  } catch (e) {
    console.log("unable to connect", e);
  }
}
