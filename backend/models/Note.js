import mongoose from "mongoose";

mongoose.connect("mongodb://192.168.0.9/mongoose", {
  useNewUrlParser: true
});

const noteSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true
    },
    body: {
      type: String,
      default: ""
    },
    user: {
      required: true,
      type: mongoose.Schema.Types.ObjectId,
    },
    tags: [String]
  },
  {
    timestamps: {
      createdAt: "dateOfCreation",
      updatedAt: "dateModified"
    }
  }
);

const Note = mongoose.model("Note", noteSchema);

module.exports = Note;
