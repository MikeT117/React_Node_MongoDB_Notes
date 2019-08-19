import mongoose from "mongoose";
import mongooseLeanVirtuals from "mongoose-lean-virtuals";

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

// Arrow functions are now allowed here due to 'this'
// bug with arrow functions and mongoose schemas
// https://github.com/Automattic/mongoose/issues/3695
userSchema.virtual("fullname").get(function() {
  return this.firstname + " " + this.lastname;
});

userSchema.virtual("avatarImg").get(function() {
  return "http://localhost:3000/avatar" + this.avatar + ".jpg"
})

userSchema.plugin(mongooseLeanVirtuals);

const User = mongoose.model("User", userSchema);
module.exports = User;
