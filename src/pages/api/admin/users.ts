import type { NextApiRequest, NextApiResponse } from "next";
import { UserData } from "@server/mongodb/types/types";
import { getAllUsers } from "@server/mongodb/actions/user";
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
  }
}
