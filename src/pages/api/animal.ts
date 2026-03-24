import type { NextApiRequest, NextApiResponse } from "next";
import { AnimalData } from "@server/mongodb/types/types";
import { createAnimal, getAnimal, updateAnimal, deleteAnimal } from "@server/mongodb/actions/animal";
import connectDb from "../../../server/mongodb/connectDb";

type AnimalApiData = {
  animalData?: AnimalData;
  message: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<AnimalApiData>,
) {
  if ( req.method === "POST" ) {
    try {
      if (!req.body.name || !req.body.breed || !req.body.owner) {
        return res.status(400).json({ message: "Missing required fields" });
      }
      const animalData = {
        name: req.body.name,
        breed: req.body.breed,
        owner: req.body.owner,
        hoursTrained: req.body.hoursTrained || 0,
        profilePicture: req.body.profilePicture || "",
      } as AnimalData;

      connectDb();
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
  }
}
