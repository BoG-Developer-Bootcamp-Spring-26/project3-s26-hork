import type { NextApiRequest, NextApiResponse } from "next";
import { AnimalData } from "@server/mongodb/types/types";
import { getAllAnimals } from "@server/mongodb/actions/animal";
import connectDb from "@server/mongodb/connectDb";

type AnimalApiData = {
  animalData?: AnimalData[];
  message: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<AnimalApiData>,
) {
  if ( req.method === "GET" ) {
    try {
      connectDb();
      const animals = await getAllAnimals();

      res.status(200).json({
        animalData: animals,
        message: "Animals retrieved successfully"
      });
    } catch (error) {
      res.status(500).json({
        message: "Error retrieving animals"
      });
    }
  }
}
