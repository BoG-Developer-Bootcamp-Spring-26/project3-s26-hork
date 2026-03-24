// TrainingLog {
//   _id: ObjectId // training log's id
//   user: ObjectId // user this training log corresponds to
//   animal: ObjectId // animal this training log corresponds to
//   title: string // title of training log
//   date: Date // date of training log
//   description: string // description of training log
//   hours: number // number of hours the training log records
// }

import mongoose from "mongoose"

const trainingLogSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  animal: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Animal",
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  hours: {
    type: Number,
    required: true,
  }
});

export default mongoose.models.TrainingLog || mongoose.model("TrainingLog", trainingLogSchema);
