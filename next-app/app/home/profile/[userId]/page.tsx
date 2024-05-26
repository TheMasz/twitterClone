"use client";
import BackButton from "@/components/BackButton";
import CommentForm from "@/components/CommentForm";
import EditForm from "@/components/EditForm";
import Loading from "@/components/Loading";
import Post from "@/components/Post";
import useAuth from "@/hook/useAuth";
import { postType, userType } from "@/types";
import { formatDate } from "@/utils";
import axios from "axios";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";

export default function Profile() {
  const { user } = useAuth();
  const { userId } = useParams();
  const [posts, setPosts] = useState<postType[]>([]);
  const [users, setUsers] = useState<userType>();
  const [isModalComment, setIsModalComment] = useState<boolean>(false);
  const [isModalEdit, setIsModalEdit] = useState<boolean>(false);
  const [postId, setPostId] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const followHandler = async (
    action: "follow" | "unfollow",
    userId: string
  ) => {
    try {
      const response = await axios.post(
        "http://localhost:5000/profile/follow",
        {
          action,
          userId,
        },
        {
          withCredentials: true,
        }
      );
      if (response.data == "ok") {
        setUsers((prevUser) => ({
          ...prevUser,
          isFollowing: action === "follow",
          followerCount:
            (prevUser?.followerCount || 0) + (action === "follow" ? 1 : -1),
          _id: prevUser?._id || "", // Ensure _id is always a string
          email: prevUser?.email || "", // Ensure email is always a string
          username: prevUser?.username || "", // Ensure username is always a string
          bio: prevUser?.bio || undefined, // Ensure bio is either a string or undefined
          password: prevUser?.password || undefined, // Ensure password is either a string or undefined
          createdAt: prevUser?.createdAt || new Date(), // Ensure createdAt is always a Date
          updatedAt: prevUser?.updatedAt || new Date(), // Ensure updatedAt is always a Date
        }));
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const fetchPosts = async () => {
      setIsLoading(true);
      const response = await axios.get(
        `http://localhost:5000/profile/${userId}`,
        {
          withCredentials: true,
        }
      );
      setPosts(response.data.posts);
      setUsers(response.data.user);
      setIsLoading(false);
    };
    fetchPosts();
  }, [userId]);

  return isLoading ? (
    <Loading />
  ) : (
    <div>
      <div className="flex gap-8 items-center mb-8">
        <BackButton />
        <div>
          <h3 className="text-lg font-bold uppercase">{users?.username}</h3>
          <p className="text-[#555]">{posts.length} posts</p>
        </div>
      </div>
      <div className="mb-8 border-b border-slate-50">
        <div className="flex items-center justify-between">
          <div className="avatar-lg"></div>
          {user?.id == userId ? (
            <button
              onClick={() => setIsModalEdit(true)}
              className="font-bold p-2 rounded-xl bg-sky-500 hover:bg-sky-700 text-white"
            >
              Edit Profile
            </button>
          ) : (
            <button
              type="button"
              onClick={() =>
                followHandler(
                  users?.isFollowing ? "unfollow" : "follow",
                  users?._id || ""
                )
              }
              className="p-2 border border-slate-50 rounded-lg"
            >
              {users?.isFollowing ? "following" : "follow"}
            </button>
          )}
        </div>
        <div className="my-4">
          <h4 className="text-lg font-bold uppercase">{users?.username}</h4>
          <p className="text-[#555] mb-2">@{users?.username}</p>
          <p className="mb-2 text-[#555]">{users?.bio}</p>
          <p className="mb-2 text-[#555]">
            {formatDate(users?.createdAt || "")}
          </p>
          <div className="flex gap-4">
            <p>
              {users?.followingCount}{" "}
              <span className="text-[#555]">Following</span>
            </p>
            <p>
              {users?.followerCount}{" "}
              <span className="text-[#555]">Followers</span>
            </p>
          </div>
        </div>
      </div>
      {posts?.map((post, index) => (
        <Post
          key={index}
          post={post}
          user={user}
          setIsModalComment={setIsModalComment}
          setPostId={setPostId}
          posts={posts}
          setPosts={setPosts}
        />
      ))}

      {isModalComment && (
        <CommentForm postId={postId} setIsModalComment={setIsModalComment} />
      )}

      {isModalEdit && (
        <EditForm userId={user?.id || ""} setIsModalEdit={setIsModalEdit} setUsers={setUsers} />
      )}
    </div>
  );
}
