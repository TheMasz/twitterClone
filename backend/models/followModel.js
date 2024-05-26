import mongoose from "mongoose";

const { Schema, Types } = mongoose;
const { ObjectId } = Types;

const followSchema = Schema({
  follower: {
    type: ObjectId,
    required: true,
  },
  following: {
    type: ObjectId,
    required: true,
  },
});

export const Follow = mongoose.model("Follow", followSchema);
