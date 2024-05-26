import express from "express";
import { checkSession } from "../utils.js";
import { Post } from "../models/postModel.js";
import { Like } from "../models/LikeModel.js";
import { Save } from "../models/savedModel.js";
import { Comment } from "../models/commentModel.js";
import { Follow } from "../models/followModel.js";
import mongoose from "mongoose";
import { User } from "../models/userModel.js";

const router = express.Router();

router.get("/", checkSession, async (req, res) => {
  try {
    const userId = req.session.user.id;
    const userByFollowed = await Follow.find({ follower: userId }).select(
      "following"
    );

    const followingIds = userByFollowed.map((entry) => entry.following);
    followingIds.push(new mongoose.Types.ObjectId(userId));

    const posts = await Post.aggregate([
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "user",
        },
      },
      {
        $unwind: "$user",
      },
      {
        $lookup: {
          from: "likes",
          localField: "_id",
          foreignField: "postId",
          as: "likes",
        },
      },
      {
        $lookup: {
          from: "likes",
          let: { postId: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$postId", "$$postId"] },
                    { $eq: ["$userId", { $toObjectId: userId }] },
                  ],
                },
              },
            },
          ],
          as: "userLikes",
        },
      },
      {
        $lookup: {
          from: "saves",
          let: { postId: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$postId", "$$postId"] },
                    { $eq: ["$userId", { $toObjectId: userId }] },
                  ],
                },
              },
            },
          ],
          as: "userSaves",
        },
      },
      {
        $addFields: {
          username: "$user.username",
          likesCount: { $size: "$likes" },
          likedByCurrentUser: { $gt: [{ $size: "$userLikes" }, 0] },
          savedByCurrentUser: { $gt: [{ $size: "$userSaves" }, 0] },
        },
      },
      {
        $match: {
          userId: {
            $in: followingIds,
          },
        },
      },
      {
        $sort: {
          createdAt: -1,
        },
      },
      {
        $project: {
          _id: 1,
          desc: 1,
          imagePath: 1,
          tags: 1,
          userId: 1,
          username: 1,
          likesCount: 1,
          likedByCurrentUser: 1,
          savedByCurrentUser: 1,
        },
      },
    ]);

    return res.status(200).json({ posts: posts });
  } catch (error) {
    console.error("Error fetching posts:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/post/:id", checkSession, async (req, res) => {
  const postId = req.params.id;
  try {
    const userId = req.session.user.id;
    const post = await Post.aggregate([
      {
        $match: {
          $expr: { $eq: ["$_id", { $toObjectId: postId }] },
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "user",
        },
      },
      {
        $unwind: "$user",
      },
      {
        $lookup: {
          from: "likes",
          localField: "_id",
          foreignField: "postId",
          as: "likes",
        },
      },
      {
        $lookup: {
          from: "likes",
          let: { postId: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$postId", "$$postId"] },
                    { $eq: ["$userId", { $toObjectId: userId }] },
                  ],
                },
              },
            },
          ],
          as: "userLikes",
        },
      },
      {
        $lookup: {
          from: "saves",
          let: { postId: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$postId", "$$postId"] },
                    { $eq: ["$userId", { $toObjectId: userId }] },
                  ],
                },
              },
            },
          ],
          as: "userSaves",
        },
      },
      {
        $addFields: {
          username: "$user.username",
          likesCount: { $size: "$likes" },
          likedByCurrentUser: { $gt: [{ $size: "$userLikes" }, 0] },
          savedByCurrentUser: { $gt: [{ $size: "$userSaves" }, 0] },
        },
      },
      {
        $sort: {
          createdAt: -1,
        },
      },
      {
        $project: {
          _id: 1,
          desc: 1,
          imagePath: 1,
          tags: 1,
          userId: 1,
          username: 1,
          likesCount: 1,
          likedByCurrentUser: 1,
          savedByCurrentUser: 1,
        },
      },
    ]);
    const comments = await Comment.aggregate([
      {
        $match: {
          $expr: { $eq: ["$postId", { $toObjectId: postId }] },
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "user",
        },
      },
      {
        $unwind: "$user",
      },
      {
        $addFields: {
          username: "$user.username",
        },
      },
      {
        $project: {
          _id: 1,
          comment: 1,
          postId: 1,
          userId: 1,
          username: 1,
          createdAt: 1,
          updatedAt: 1,
        },
      },
    ]);
    return res.status(200).json({ post: post[0], comments: comments });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ message: error.message });
  }
});

router.post("/post", checkSession, async (req, res) => {
  const userId = req.session.user.id;
  const { desc } = await req.body;
  try {
    const hashtags = desc.match(/#\w+/g) || [];
    const txt_desc = desc.replace(/#\w+/g, "").trim();

    const newPost = new Post({
      desc: txt_desc,
      tags: hashtags,
      userId: userId,
    });

    await newPost.save();
    return res.status(201).json({ message: "Post Created!", post: newPost });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ message: error.message });
  }
});

router.post("/post/like", checkSession, async (req, res) => {
  const { action, postId } = await req.body;
  try {
    const userId = req.session.user.id;
    if (action == "like") {
      const newLike = new Like({
        userId: userId,
        postId: postId,
      });
      await newLike.save();
      return res.status(201).json("ok");
    }
    if (action === "unlike") {
      const removedLike = await Like.findOneAndDelete({
        userId: userId,
        postId: postId,
      });
      if (removedLike) {
        return res.status(200).json("ok");
      } else {
        return res.status(404).json("not found");
      }
    }
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ message: error.message });
  }
});

router.post("/post/save", checkSession, async (req, res) => {
  const { action, postId } = await req.body;
  try {
    const userId = req.session.user.id;
    if (action == "save") {
      const newSaved = new Save({
        userId: userId,
        postId: postId,
      });
      await newSaved.save();
      return res.status(201).json("ok");
    }
    if (action == "unsave") {
      const removedSaved = await Save.findOneAndDelete({
        userId: userId,
        postId: postId,
      });
      if (removedSaved) {
        return res.status(200).json("ok");
      } else {
        return res.status(404).json("not found");
      }
    }
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ message: error.message });
  }
});

router.post("/post/comment", checkSession, async (req, res) => {
  const { postId, comment } = await req.body;
  try {
    const userId = req.session.user.id;
    const newComment = new Comment({
      comment: comment,
      postId: postId,
      userId: userId,
    });
    await newComment.save();
    return res.status(201).json({
      comment: newComment,
      message: "Comment Created!",
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ message: error.message });
  }
});

router.delete("/post/delete/:id", checkSession, async (req, res) => {
  const postId = req.params.id;
  try {
    const removed = await Post.findOneAndDelete({ _id: postId });
    if (removed) {
      await Comment.deleteMany({ postId: postId });
      await Like.deleteMany({ postId: postId });
      await Save.deleteMany({ postId: postId });
      return res.status(200).json("Post removed");
    } else {
      return res.status(404).json("Post not found");
    }
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ message: error.message });
  }
});

router.get("/trends", checkSession, async (req, res) => {
  try {
    const posts = await Post.find();
    const tagCounts = new Map();

    posts.forEach((post) => {
      post.tags.forEach((tag) => {
        const trimmedTag = tag.trim();
        if (trimmedTag) {
          tagCounts.set(trimmedTag, (tagCounts.get(trimmedTag) || 0) + 1);
        }
      });
    });

    const tagCountArray = Array.from(tagCounts, ([tag, count]) => ({
      count,
      tag,
    }));

    return res.status(200).json({ trends: tagCountArray });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ message: error.message });
  }
});

router.get("/peoples", checkSession, async (req, res) => {
  try {
    const userIdSession = req.session.user.id;
    const peoples = await User.aggregate([
      {
        $match: {
          $expr: { $ne: ["$_id", { $toObjectId: userIdSession }] },
        },
      },
      {
        $lookup: {
          from: "follows",
          localField: "_id",
          foreignField: "follower",
          as: "following",
        },
      },
      {
        $lookup: {
          from: "follows",
          localField: "_id",
          foreignField: "following",
          as: "follower",
        },
      },
      {
        $lookup: {
          from: "follows",
          let: { userId: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    {
                      $eq: ["$follower", { $toObjectId: userIdSession }],
                    },
                    { $eq: ["$following", "$$userId"] },
                  ],
                },
              },
            },
          ],
          as: "isFollowing",
        },
      },
      {
        $addFields: {
          followerCount: { $size: "$follower" },
          followingCount: { $size: "$following" },
          isFollowing: { $gt: [{ $size: "$isFollowing" }, 0] },
        },
      },
      {
        $project: {
          _id: 1,
          username: 1,
          email: 1,
          createdAt: 1,
          updatedAt: 1,
          followingCount: 1,
          followerCount: 1,
          isFollowing: 1,
        },
      },
    ]);
    return res.status(200).json({ peoples: peoples });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ message: error.message });
  }
});

router.get("/tags/:tag", checkSession, async (req, res) => {
  const { tag } = req.params;
  try {
    const userId = req.session.user.id;
    const posts = await Post.aggregate([
      {
        $match: {
          tags: {
            $regex: tag,
            $options: "i", // case-insensitive
          },
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "user",
        },
      },
      {
        $unwind: "$user",
      },
      {
        $lookup: {
          from: "likes",
          localField: "_id",
          foreignField: "postId",
          as: "likes",
        },
      },
      {
        $lookup: {
          from: "likes",
          let: { postId: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$postId", "$$postId"] },
                    { $eq: ["$userId", { $toObjectId: userId }] },
                  ],
                },
              },
            },
          ],
          as: "userLikes",
        },
      },
      {
        $lookup: {
          from: "saves",
          let: { postId: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$postId", "$$postId"] },
                    { $eq: ["$userId", { $toObjectId: userId }] },
                  ],
                },
              },
            },
          ],
          as: "userSaves",
        },
      },
      {
        $addFields: {
          username: "$user.username",
          likesCount: { $size: "$likes" },
          likedByCurrentUser: { $gt: [{ $size: "$userLikes" }, 0] },
          savedByCurrentUser: { $gt: [{ $size: "$userSaves" }, 0] },
        },
      },
      {
        $sort: {
          createdAt: -1,
        },
      },
      {
        $project: {
          _id: 1,
          desc: 1,
          imagePath: 1,
          tags: 1,
          userId: 1,
          username: 1,
          likesCount: 1,
          likedByCurrentUser: 1,
          savedByCurrentUser: 1,
        },
      },
    ]);
    return res.status(200).json({ posts: posts });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ message: error.message });
  }
});

router.get("/bookmarks", checkSession, async (req, res) => {
  try {
    const userId = req.session.user.id;
    const savedPost = await Save.find({ userId: userId });
    const postIds = savedPost.map((post) => post.postId);

    const posts = await Post.aggregate([
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "user",
        },
      },
      {
        $unwind: "$user",
      },
      {
        $lookup: {
          from: "likes",
          localField: "_id",
          foreignField: "postId",
          as: "likes",
        },
      },
      {
        $lookup: {
          from: "likes",
          let: { postId: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$postId", "$$postId"] },
                    { $eq: ["$userId", { $toObjectId: userId }] },
                  ],
                },
              },
            },
          ],
          as: "userLikes",
        },
      },
      {
        $lookup: {
          from: "saves",
          let: { postId: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$postId", "$$postId"] },
                    { $eq: ["$userId", { $toObjectId: userId }] },
                  ],
                },
              },
            },
          ],
          as: "userSaves",
        },
      },
      {
        $addFields: {
          username: "$user.username",
          likesCount: { $size: "$likes" },
          likedByCurrentUser: { $gt: [{ $size: "$userLikes" }, 0] },
          savedByCurrentUser: { $gt: [{ $size: "$userSaves" }, 0] },
        },
      },
      {
        $match: {
          _id: {
            $in: postIds,
          },
        },
      },
      {
        $sort: {
          createdAt: -1,
        },
      },
      {
        $project: {
          _id: 1,
          desc: 1,
          imagePath: 1,
          tags: 1,
          userId: 1,
          username: 1,
          likesCount: 1,
          likedByCurrentUser: 1,
          savedByCurrentUser: 1,
        },
      },
    ]);

    return res.status(200).json({ posts: posts });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ message: error.message });
  }
});

export default router;
