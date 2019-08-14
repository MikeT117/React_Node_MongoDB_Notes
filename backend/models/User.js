import mongoose from "mongoose";

const root = "http://localhost:3000/public/profile_images/";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      trim: true,
      required: true,
      unique: true
    },
    password: {
      required: true,
      type: String
    },
    firstname: {
      type: String,
      trim: true,
      required: true
    },
    lastname: {
      type: String,
      trim: true,
      required: true
    },
    email: {
      type: String,
      trim: true,
      required: true,
      unique: true
    },
    // See if we can define a getter here to retrieve
    // the last entry for the user from the sessions collection
    // in the meantim just uset Date.now
    dateTimeOfLastLogin: { type: Date, default: Date.now },
    avatar: { type: String, get: a => `${root}${a}` }
  },
  {
    timestamps: {
      createdAt: "dateOfRegistration",
      updatedAt: "dateOfAccountUpdate"
    }
  }
);

const User = mongoose.model("User", userSchema);
module.exports = User;
