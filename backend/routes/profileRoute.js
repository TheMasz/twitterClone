import express from "express";
import { checkSession, checkUsername, checkEmail } from "../utils.js";
import { Post } from "../models/postModel.js";
import { User } from "../models/userModel.js";
import { Follow } from "../models/followModel.js";

const router = express.Router();

router.get("/:id", checkSession, async (req, res) => {
  const userIdSession = req.session.user.id;
  const userId = req.params.id;
  try {
    const posts = await Post.aggregate([
      {
        $match: {
          $expr: { $eq: ["$userId", { $toObjectId: userId }] },
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
    if (userIdSession !== userId) {
      const user = await User.aggregate([
        {
          $match: {
            $expr: { $eq: ["$_id", { $toObjectId: userId }] },
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
            bio: 1,
            createdAt: 1,
            updatedAt: 1,
            followingCount: 1,
            followerCount: 1,
            isFollowing: 1,
          },
        },
      ]);
      return res.status(200).json({ posts: posts, user: user[0] });
    } else {
      const user = await User.aggregate([
        {
          $match: {
            $expr: { $eq: ["$_id", { $toObjectId: userId }] },
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
          $addFields: {
            followingCount: { $size: "$following" },
            followerCount: { $size: "$follower" },
          },
        },
        {
          $project: {
            _id: 1,
            username: 1,
            email: 1,
            bio: 1,
            createdAt: 1,
            updatedAt: 1,
            followingCount: 1,
            followerCount: 1,
            isFollowing: 1,
          },
        },
      ]);
      return res.status(200).json({ posts: posts, user: user[0] });
    }
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ message: error.message });
  }
});

router.post("/follow", checkSession, async (req, res) => {
  const { action, userId } = req.body;
  try {
    const userIdSession = req.session.user.id;
    if (action == "follow") {
      const newFollow = new Follow({
        follower: userIdSession,
        following: userId,
      });
      await newFollow.save();
      return res.status(201).json("ok");
    }
    if (action == "unfollow") {
      const removedFollow = await Follow.findOneAndDelete({
        follower: userIdSession,
        following: userId,
      });
      if (removedFollow) {
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

router.put("/edit", checkSession, async (req, res) => {
  const { email, username, bio } = req.body;
  try {
    const userId = req.session.user.id;
    const user = await User.findOne({ _id: userId });
    if (user) {
      if (checkEmail(email) === true) {
        return res.status(400).send({
          message: "Email has already.",
        });
      }
      if (checkUsername(username) === true) {
        return res.status(400).send({
          message: "Username has already.",
        });
      }
      if (email) user.email = email;
      if (username) user.username = username;
      if (bio) user.bio = bio;
      await user.save();
      res
        .status(200)
        .json({ success: true, message: "User updated successfully", user });
    } else {
      res.status(404).send("User not found");
    }
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Internal server error" });
  }
});

export default router;
