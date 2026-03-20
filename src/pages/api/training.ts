import type { NextApiRequest, NextApiResponse } from "next";
import { TrainingLogData } from "@server/mongodb/types/types";
import { createTrainingLog, getTrainingLog, updateTrainingLog, deleteTrainingLog } from "@server/mongodb/actions/traininglog";
import connectDb from "../../../server/mongodb/connectDb";

type TrainingLogApiData = {
  trainingLogData?: TrainingLogData;
  message: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<TrainingLogApiData>,
) {
  if ( req.method === "POST" ) {
    try {
      if (!req.body.user || !req.body.date || !req.body.hours) {
        return res.status(400).json({ message: "Missing required fields" });
      }
      const trainingLogData = {
        user: req.body.user,
        animal: req.body.animal,
        title: req.body.title,
        date: req.body.date || 0,
        description: req.body.description || "",
        hours: req.body.hours || 0,
      } as TrainingLogData;

      connectDb();
      const trainingLog = await createTrainingLog(trainingLogData);
      res.status(200).json({ 
        trainingLogData: trainingLog, 
        message: "Training log created successfully" 
      });
    } catch (error) {
      res.status(500).json({ 
        message: "Error creating training log" 
      });
    }
  } else if ( req.method === "PATCH" ) {
    try {
      if (!req.body.id || !req.body.user) {
        return res.status(400).json({ message: "Missing training log ID or user" });
      }

      connectDb();

      const existingLog = await getTrainingLog(req.body.id);
      if (!existingLog) {
        return res.status(500).json({ message: "Training log not found" });
      }
      if (existingLog.user.toString() !== req.body.user) {
        return res.status(500).json({ message: "Unauthorized to update this training log" });
      }

      const trainingLog = await updateTrainingLog(req.body.id, { hours: req.body.hours });
      if (!trainingLog) {
        return res.status(500).json({ message: "Training log not found" });
      }

      res.status(200).json({ 
        trainingLogData: trainingLog, 
        message: "Training log updated successfully" 
      });
    } catch (error) {
      res.status(500).json({ 
        message: "Error updating training log" 
      });
    }
  }
}
