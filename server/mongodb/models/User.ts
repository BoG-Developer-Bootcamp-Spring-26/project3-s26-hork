// User {
//   _id: ObjectId // user's ID
//   fullName: string // user's full name
//   email: string // user's email
//   password: string // user's password
//   admin: boolean // holds whether or not a user is an admin
// }

import mongoose from "mongoose"

const userSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  admin: {
    type: Boolean,
    default: false
  }
});

export default mongoose.models.User || mongoose.model("User", userSchema);
