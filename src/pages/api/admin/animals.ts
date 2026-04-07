import type { NextApiRequest, NextApiResponse } from "next";
import { AnimalData } from "@server/mongodb/types/types";
import { getAllAnimals, deleteAnimal } from "@server/mongodb/actions/animal";
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
      const serialized = animals.map((a: any) => ({
        ...a.toObject(),
        _id: a._id.toString(),
        owner: a.owner?.fullName ?? a.owner?.toString() ?? '',
      }));

      res.status(200).json({
        animalData: serialized,
        message: "Animals retrieved successfully"
      });
    } catch (error) {
      res.status(500).json({
        message: "Error retrieving animals"
      });
    }
  } else if (req.method === "DELETE") {
    try {
      const { id } = req.query;
      if (!id) return res.status(400).json({ message: "Missing animal ID" });
      await connectDb();
      await deleteAnimal(id as string);
      res.status(200).json({ message: "Animal deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Error deleting animal" });
    }
  }
}
