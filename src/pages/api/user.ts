import type { NextApiRequest, NextApiResponse } from "next";
import { UserData } from "@server/mongodb/types/types";
import { createUser, getUser, getUsers, deleteUser } from "@server/mongodb/actions/user";
import connectDb from "@server/mongodb/connectDb";
import argon2 from "argon2";

type UserApiData = {
  userData?: UserData | Omit<UserData, "password">[]; // user data w/o password for GET 
  message: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<UserApiData>,
) {
  if ( req.method === "POST" ) {
    try {
      if (!req.body.fullName || !req.body.email || !req.body.password) {
        return res.status(400).json({ message: "Missing required fields" });
      }

      const hashedPassword = await argon2.hash(req.body.password, { type: argon2.argon2d });

      const userData = {
        fullName: req.body.fullName,
        email: req.body.email,
        password: hashedPassword,
        admin: req.body.admin || false,
      } as UserData;

      connectDb();
      const user = await createUser(userData);
      res.status(200).json({ 
        userData: user, 
        message: "User created successfully" 
      });
    } catch (error) {
      console.error("Error creating user:", error);
      res.status(500).json({ 
        message: "Error creating user"
      });
    }
  } else if ( req.method === "GET" ) {
    try {
      connectDb();
      const users = await getUsers();

      res.status(200).json({
        userData: users,
        message: "Users retrieved successfully"
      });
    } catch (error) {
      res.status(500).json({
        message: "Error retrieving users"
      });
    }
  } else if ( req.method === "DELETE" ) {
    try {
      if (!req.body.userId) {
        return res.status(500).json({ message: "Deleting requires user ID" });
      }

      connectDb();
      await deleteUser(req.body.userId);
      res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Error deleting user" });
    }
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}
