import { UserData } from "../types/types";
import User from "../models/User";
import mongoose from "mongoose";

export async function createUser(userData: UserData) {
  const newUser = new User(userData);
  await newUser.save();
  return newUser;
}

export async function getUser(userId: string) {
  const retrievedUser = await User.findById(userId);
  return retrievedUser;
}

export async function getAllUsers(limit: number = 10, lastId?: string) {
  const query: any = lastId ? { _id: { $gt: new mongoose.Types.ObjectId(lastId) } } : {};
  const retrievedUsers = await User.find(query, { password: 0 }).limit(limit);
  return retrievedUsers;
}

export async function getUserByEmail(email: string) {
  const retrievedUser = await User.findOne({ email });
  return retrievedUser;
}

export async function deleteUser(userId: string) {
  await User.findByIdAndDelete(userId);
}
