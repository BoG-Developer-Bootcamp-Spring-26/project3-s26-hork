import type { NextApiRequest, NextApiResponse } from "next";
import { TrainingLogData } from "@server/mongodb/types/types";
import { getAllTrainingLogs, getTrainingLog, deleteTrainingLog } from "@server/mongodb/actions/traininglog";
import { adjustAnimalHours } from "@server/mongodb/actions/animal";
import connectDb from "@server/mongodb/connectDb";

type TrainingLogApiData = {
  trainingLogData?: TrainingLogData[];
  message: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<TrainingLogApiData>,
) {
  if ( req.method === "GET" ) {
    try {
      connectDb();
      const trainingLogs = await getAllTrainingLogs();

      res.status(200).json({
        trainingLogData: trainingLogs,
        message: "Training logs retrieved successfully"
      });
    } catch (error) {
      res.status(500).json({
        message: "Error retrieving training logs"
      });
    }
  } else if (req.method === "DELETE") {
    try {
      const { id } = req.query;
      if (!id) return res.status(400).json({ message: "Missing training log ID" });
      await connectDb();
      const log = await getTrainingLog(id as string);
      if (!log) return res.status(404).json({ message: "Training log not found" });
      await adjustAnimalHours(log.animal.toString(), -(log.hours ?? 0));
      await deleteTrainingLog(id as string);
      res.status(200).json({ message: "Training log deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Error deleting training log" });
    }
  }
}
