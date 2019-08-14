import mongoose from "mongoose";

const ObjectId = mongoose.Schema.ObjectId;

mongoose.connect("mongodb://192.168.0.9/mongoose", {
  useNewUrlParser: true
});

const sessionSchema = new mongoose.Schema({
  sessionId: {
    type: String,
    required: true
  },
  sessionuser: {
    type: String,
    required: true
  },
  datetimeOfSessionBegin: { type: Date, default: Date.now }
});

const Session = mongoose.model("Session", sessionSchema);

module.exports = Session;
