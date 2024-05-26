import mongoose from "mongoose";

const { Schema, Types } = mongoose;
const { ObjectId } = Types;

const SaveSchema = Schema({
  userId: {
    type: ObjectId,
    required: true,
  },
  postId: {
    type: ObjectId,
    required: true,
  },
});

export const Save = mongoose.model("Save", SaveSchema);
