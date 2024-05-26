import mongoose from "mongoose";

const { Schema, Types } = mongoose;
const { ObjectId } = Types;

const LikeSchema = Schema({
  userId: {
    type: ObjectId,
    required: true,
  },
  postId: {
    type: ObjectId,
    required: true,
  },
});

export const Like = mongoose.model("Like", LikeSchema);
