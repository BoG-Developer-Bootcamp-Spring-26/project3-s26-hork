import type { NextApiRequest, NextApiResponse } from "next";
import { getUserByEmail } from "@server/mongodb/actions/user";
import connectDb from "@server/mongodb/connectDb";
import { signToken } from "@server/jwt";
import argon2 from "argon2";

type VerifyApiData = {
  userId?: string;
  admin?: boolean;
  message: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<VerifyApiData>,
) {
  if ( req.method === "POST" ) {
    try {
      if (!req.body.email || !req.body.password) {
        return res.status(400).json({ message: "Missing required fields" });
      }

      connectDb();
      const user = await getUserByEmail(req.body.email);
      
      if (!user) {
        return res.status(500).json({ message: "User not found" });
      }

      const passwordMatch = await argon2.verify(user.password, req.body.password);

      if (!passwordMatch) {
        return res.status(500).json({ message: "Invalid password" });
      }

      const token = signToken({
        userId: user._id.toString(),
        admin: user.admin,
      });

      res.setHeader("Set-Cookie", `token=${token}; HttpOnly; Path=/; Max-Age=3600`);

      res.status(200).json({ 
        userId: user._id.toString(), 
        admin: user.admin,
        message: "User verified successfully" 
      });
    } catch (error) {
      res.status(500).json({ 
        message: "Error verifying user" 
      });
    }
  } else {
    res.status(500).json({ 
      message: "Invalid request method" 
    });
  }
}
