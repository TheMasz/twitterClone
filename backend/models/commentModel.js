import mongoose from "mongoose";

const { Schema, Types } = mongoose;
const { ObjectId } = Types;

const commentSchem = Schema(
  {
    comment: {
      type: String,
      required: true,
    },
    userId: {
      type: ObjectId,
      required: true,
    },
    postId: {
      type: ObjectId,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Comment = mongoose.model("Comment", commentSchem);
