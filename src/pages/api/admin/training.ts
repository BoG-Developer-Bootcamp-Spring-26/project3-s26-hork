import type { NextApiRequest, NextApiResponse } from "next";
import { TrainingLogData } from "@server/mongodb/types/types";
import { getAllTrainingLogs } from "@server/mongodb/actions/traininglog";
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
  }
}
