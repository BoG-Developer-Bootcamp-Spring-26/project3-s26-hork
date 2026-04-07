import type { NextApiRequest, NextApiResponse } from "next";
import { AnimalData } from "@server/mongodb/types/types";
import { createAnimal, getAnimal, updateAnimal, deleteAnimal, getAnimalsByOwner } from "@server/mongodb/actions/animal";
import connectDb from "../../../server/mongodb/connectDb";
import { verifyToken } from "@server/jwt";

type AnimalApiData = {
  animalData?: AnimalData | AnimalData[];
  message: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<AnimalApiData>,
) {
  if ( req.method === "GET" ) {
    try {
      const token = req.cookies?.token;
      if (!token) return res.status(401).json({ message: "Unauthorized" });
      const { userId } = verifyToken(token);
      await connectDb();
      const animals = await getAnimalsByOwner(userId);
      const serialized = animals.map((a: any) => ({
        ...a.toObject(),
        _id: a._id.toString(),
        owner: a.owner?.fullName ?? a.owner?.toString() ?? '',
      }));
      return res.status(200).json({ animalData: serialized, message: "Animals retrieved successfully" });
    } catch (error) {
      return res.status(500).json({ message: "Error retrieving animals" });
    }
  } else if ( req.method === "POST" ) {
    try {
      const token = req.cookies?.token;
      if (!token) return res.status(401).json({ message: "Unauthorized" });
      const { userId } = verifyToken(token);

      if (!req.body.name || !req.body.breed) {
        return res.status(400).json({ message: "Missing required fields" });
      }
      const animalData = {
        name: req.body.name,
        breed: req.body.breed,
        owner: userId,
        hoursTrained: req.body.hoursTrained || 0,
        profilePicture: req.body.profilePicture || "",
      } as AnimalData;

      await connectDb();
      const animal = await createAnimal(animalData);
      res.status(200).json({
        animalData: animal,
        message: "Animal created successfully"
      });
    } catch (error) {
      res.status(500).json({
        message: "Error creating animal"
      });
    }
  } else if ( req.method === "PATCH" ) {
    try {
      if (!req.body.id || req.body.hoursTrained === undefined) {
        return res.status(400).json({ message: "Missing animal ID or hoursTrained" });
      }

      connectDb();
      const animal = await updateAnimal(req.body.id, { hoursTrained: req.body.hoursTrained });
      if (!animal) {
        return res.status(500).json({ message: "Animal not found" });
      }
      res.status(200).json({ 
        animalData: animal, 
        message: "Animal updated successfully" 
      });
    } catch (error) {
      res.status(500).json({ 
        message: "Error updating animal" 
      });
    }
  } else if (req.method === "DELETE") {
    try {
      const token = req.cookies?.token;
      if (!token) return res.status(401).json({ message: "Unauthorized" });
      const { userId } = verifyToken(token);

      const { id } = req.query;
      if (!id) return res.status(400).json({ message: "Missing animal ID" });

      await connectDb();
      const animal = await getAnimal(id as string);
      if (!animal) return res.status(404).json({ message: "Animal not found" });
      if (animal.owner.toString() !== userId) return res.status(403).json({ message: "Unauthorized" });

      await deleteAnimal(id as string);
      return res.status(200).json({ message: "Animal deleted successfully" });
    } catch (error) {
      return res.status(500).json({ message: "Error deleting animal" });
    }
  }
}
