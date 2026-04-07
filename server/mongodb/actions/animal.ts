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

export async function getAnimalsByOwner(ownerId: string) {
  return Animal.find({ owner: ownerId }).populate('owner', 'fullName');
}

export async function getAllAnimals(limit: number = 100, lastId?: string) {
  const query: any = lastId ? { _id: { $gt: new mongoose.Types.ObjectId(lastId) } } : {};
  const retrievedAnimals = await Animal.find(query).limit(limit).populate('owner', 'fullName');
  return retrievedAnimals;
}

export async function updateAnimal(animalId: string, newData: Partial<AnimalData>) {
  const updatedAnimal = await Animal.findByIdAndUpdate(animalId, { $set: newData }, { new: true, strict: false });
  return updatedAnimal;
}

export async function deleteAnimal(animalId: string) {
  await Animal.findByIdAndDelete(animalId);
}

export async function adjustAnimalHours(animalId: string, delta: number) {
  await Animal.findByIdAndUpdate(animalId, { $inc: { hoursTrained: delta } });
}
