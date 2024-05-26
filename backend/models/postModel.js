import mongoose from "mongoose";

const { Schema, Types } = mongoose;
const { ObjectId } = Types;

const postSchema = Schema(
  {
    desc: {
      type: String,
      required: true,
    },
    imagePath: {
      type: String,
    },
    tags: [
      {
        type: String,
      },
    ],
    userId: {
      type: ObjectId,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Post = mongoose.model("Post", postSchema);
