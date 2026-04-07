export interface UserData {
  fullName: string;
  email: string;
  password: string;
  admin?: boolean;
}

export interface AnimalData {
  name: string;
  breed: string;
  owner: string; // ObjectId as a string
  hoursTrained?: number;
  birthdate?: Date;
  note?: string;
  profilePicture?: string;
}

export interface TrainingLogData {
  animal: string; // ObjectId as a string
  title: string;
  date: Date;
  description: string;
  hours: number; // in hours
}
