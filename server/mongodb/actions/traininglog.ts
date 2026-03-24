import { TrainingLogData } from "../types/types";
import TrainingLog from "../models/TrainingLog";
import mongoose from "mongoose";

export async function createTrainingLog(trainingLogData: TrainingLogData) {
  const newTrainingLog = new TrainingLog(trainingLogData);
  await newTrainingLog.save();
  return newTrainingLog;
}

export async function getTrainingLog(trainingLogId: string) {
  const retrievedTrainingLog = await TrainingLog.findById(trainingLogId);
  return retrievedTrainingLog;
}

export async function getAllTrainingLogs(limit: number = 10, lastId?: string) {
  const query: any = lastId ? { _id: { $gt: new mongoose.Types.ObjectId(lastId) } } : {};
  const retrievedTrainingLogs = await TrainingLog.find(query).limit(limit);
  return retrievedTrainingLogs;
}

export async function updateTrainingLog(trainingLogId: string, newData: Partial<TrainingLogData>) {
  const updatedTrainingLog = await TrainingLog.findByIdAndUpdate(trainingLogId, newData, { new: true });
  return updatedTrainingLog;
}

export async function deleteTrainingLog(trainingLogId: string) {
  await TrainingLog.findByIdAndDelete(trainingLogId);
}
