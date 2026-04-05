import type { NextApiRequest, NextApiResponse } from "next";
import { TrainingLogData } from "@server/mongodb/types/types";
import { createTrainingLog, getTrainingLog, updateTrainingLog, deleteTrainingLog, getTrainingLogsByUser } from "@server/mongodb/actions/traininglog";
import connectDb from "../../../server/mongodb/connectDb";
import { verifyToken } from "@server/jwt";

type TrainingLogApiData = {
  trainingLogData?: TrainingLogData | TrainingLogData[];
  message: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<TrainingLogApiData>,
) {
  if ( req.method === "GET" ) {
    try {
      const token = req.cookies?.token;
      if (!token) return res.status(401).json({ message: "Unauthorized" });
      const { userId } = verifyToken(token);
      await connectDb();

      const { id } = req.query;
      if (id) {
        const log = await getTrainingLog(id as string);
        if (!log) return res.status(404).json({ message: "Training log not found" });
        if (log.user.toString() !== userId) return res.status(403).json({ message: "Unauthorized" });
        return res.status(200).json({ trainingLogData: log, message: "Training log retrieved successfully" });
      }

      const trainingLogs = await getTrainingLogsByUser(userId);
      return res.status(200).json({ trainingLogData: trainingLogs, message: "Training logs retrieved successfully" });
    } catch (error) {
      return res.status(500).json({ message: "Error retrieving training logs" });
    }
  } else if ( req.method === "POST" ) {
    try {
      const token = req.cookies?.token;
      if (!token) return res.status(401).json({ message: "Unauthorized" });
      const { userId } = verifyToken(token);

      if (!req.body.animal || !req.body.date || !req.body.hours) {
        return res.status(400).json({ message: "Missing required fields" });
      }
      const trainingLogData = {
        user: userId,
        animal: req.body.animal,
        title: req.body.title,
        date: req.body.date,
        description: req.body.description || "",
        hours: req.body.hours,
      } as TrainingLogData;

      await connectDb();
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
      const token = req.cookies?.token;
      if (!token) return res.status(401).json({ message: "Unauthorized" });
      const { userId } = verifyToken(token);

      if (!req.body.id) {
        return res.status(400).json({ message: "Missing training log ID" });
      }

      await connectDb();

      const existingLog = await getTrainingLog(req.body.id);
      if (!existingLog) {
        return res.status(500).json({ message: "Training log not found" });
      }
      if (existingLog.user.toString() !== userId) {
        return res.status(403).json({ message: "Unauthorized to update this training log" });
      }

      const trainingLog = await updateTrainingLog(req.body.id, {
        title: req.body.title,
        animal: req.body.animal,
        date: req.body.date,
        description: req.body.description,
        hours: req.body.hours,
      });
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
