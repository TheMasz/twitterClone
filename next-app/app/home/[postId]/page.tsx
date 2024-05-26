"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { commentType, postType } from "@/types";
import axios from "axios";
import Loading from "@/components/Loading";
import Post from "@/components/Post";
import CommentForm from "@/components/CommentForm";
import useAuth from "@/hook/useAuth";
import BackButton from "@/components/BackButton";

export default function PostId() {
  const { user } = useAuth();
  const { postId } = useParams();
  const [post, setPost] = useState<postType>();
  const [comments, setComments] = useState<commentType[]>([]);
  const [isLoading, setIsloading] = useState<boolean>(false);
  const [isModalComment, setIsModalComment] = useState<boolean>(false);

  useEffect(() => {
    const fetchPost = async () => {
      setIsloading(true);
      const respone = await axios.get(
        `http://localhost:5000/feed/post/${postId}`,
        {
          withCredentials: true,
        }
      );
      setPost(respone.data.post);
      setComments(respone.data.comments);
      setIsloading(false);
    };
    fetchPost();
  }, [postId]);

  return isLoading ? (
    <Loading />
  ) : (
    <section>
      <BackButton />
      <Post
        post={post}
        setIsModalComment={setIsModalComment}
        setPost={setPost}
        user={user}
      />
      <div className="mb-8"></div>
      <CommentForm postId={post?._id} setComments={setComments} />
      <div className="mb-4"></div>
      <div className="comments">
        {comments?.map((comment, index) => (
          <div
            key={index}
            className="border-t border-b border-slate-50 py-4 flex gap-2"
          >
            <div className="avatar-sm"></div>
            <div>
              <h4 className="text-lg font-bold">
                {comment.username || user?.username}
              </h4>
              <p>{comment.comment}</p>
            </div>
          </div>
        ))}
      </div>
      {isModalComment && (
        <CommentForm
          postId={post?._id}
          setIsModalComment={setIsModalComment}
          setComments={setComments}
        />
      )}
    </section>
  );
}
