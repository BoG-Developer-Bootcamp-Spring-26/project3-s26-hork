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
  }
}
