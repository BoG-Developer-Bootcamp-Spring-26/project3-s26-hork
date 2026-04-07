import type { NextApiRequest, NextApiResponse } from "next";
import { UserData } from "@server/mongodb/types/types";
import { getAllUsers, deleteUser } from "@server/mongodb/actions/user";
import connectDb from "@server/mongodb/connectDb";

type UserApiData = {
  userData?: UserData[];
  message: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<UserApiData>,
) {
  if ( req.method === "GET" ) {
    try {
      connectDb();
      const users = await getAllUsers();

      res.status(200).json({
        userData: users,
        message: "Users retrieved successfully"
      });
    } catch (error) {
      res.status(500).json({
        message: "Error retrieving users"
      });
    }
  } else if (req.method === "DELETE") {
    try {
      const { id } = req.query;
      if (!id) return res.status(400).json({ message: "Missing user ID" });
      await connectDb();
      await deleteUser(id as string);
      res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Error deleting user" });
    }
  }
}
