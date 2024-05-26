"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import Loading from "@/components/Loading";
import PostForm from "@/components/PostForm";
import { postType } from "@/types";

import useAuth from "@/hook/useAuth";
import CommentForm from "@/components/CommentForm";
import Post from "@/components/Post";

import { MdDateRange } from "react-icons/md";

export default function Home() {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [posts, setPosts] = useState<postType[] | []>([]);
  const [isModalComment, setIsModalComment] = useState<boolean>(false);
  const [postId, setPostId] = useState<string>("");

  useEffect(() => {
    const fetcPosts = async () => {
      try {
        setIsLoading(true);
        await axios
          .get("http://localhost:5000/feed", {
            withCredentials: true,
          })
          .then((res) => {
            setPosts(res.data.posts);
            setIsLoading(false);
          });
      } catch (error) {
        console.error("Error checking session:", error);
      }
    };
    fetcPosts();
  }, []);

  return isLoading ? (
    <Loading />
  ) : (
    <section className="relative">
      <div className="py-4 border-b border-slate-50">
        <PostForm setPosts={setPosts} />
      </div>
      <div className="posts">
        {posts.length === 0 && (
          <div className="py-12 flex-col flex-center">
            <MdDateRange className="w-12 h-12 mb-4"  />
            <h3 className="text-2xl font-bold">
              Follow people for new experiences.
            </h3>
          </div>
        )}
        {posts?.map((post: postType, index) => (
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
      </div>
      {isModalComment && (
        <CommentForm postId={postId} setIsModalComment={setIsModalComment} />
      )}
    </section>
  );
}
