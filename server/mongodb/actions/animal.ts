import { AnimalData } from "../types/types";
import Animal from "../models/Animal";
import mongoose from "mongoose";

export async function createAnimal(animalData: AnimalData) {
  const newAnimal = new Animal(animalData);
  await newAnimal.save();
  return newAnimal;
}

export async function getAnimal(animalId: string) {
  const retrievedAnimal = await Animal.findById(animalId);
  return retrievedAnimal;
}

export async function getAllAnimals(limit: number = 10, lastId?: string) {
  const query: any = lastId ? { _id: { $gt: new mongoose.Types.ObjectId(lastId) } } : {};
  const retrievedAnimals = await Animal.find(query).limit(limit);
  return retrievedAnimals;
}

export async function updateAnimal(animalId: string, newData: Partial<AnimalData>) {
  const updatedAnimal = await Animal.findByIdAndUpdate(animalId, newData, { new: true });
  return updatedAnimal;
}

export async function deleteAnimal(animalId: string) {
  await Animal.findByIdAndDelete(animalId);
}
