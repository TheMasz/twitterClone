"use client";
import BackButton from "@/components/BackButton";
import CommentForm from "@/components/CommentForm";
import Loading from "@/components/Loading";
import Post from "@/components/Post";
import useAuth from "@/hook/useAuth";
import { postType } from "@/types";
import axios from "axios";
import { useEffect, useState } from "react";
import { MdDateRange } from "react-icons/md";

export default function Bookmark() {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [posts, setPosts] = useState<postType[]>([]);
  const [isModalComment, setIsModalComment] = useState<boolean>(false);
  const [postId, setPostId] = useState<string>("");

  useEffect(() => {
    const fetchPosts = async () => {
      setIsLoading(true);
      const response = await axios.get("http://localhost:5000/feed/bookmarks", {
        withCredentials: true,
      });
      setPosts(response.data.posts);
      setIsLoading(false);
    };
    fetchPosts();
  }, []);
  return isLoading ? (
    <Loading />
  ) : (
    <section>
      <div className="flex items-center gap-2">
        <BackButton />
        <h2 className="text-2xl font-bold mb-4">Saved Post</h2>
      </div>

      {posts.length === 0 && (
        <div className="py-12 flex-col flex-center">
          <MdDateRange className="w-12 h-12 mb-4" />
          <h3 className="text-2xl font-bold">Keep your posts do you like.</h3>
        </div>
      )}
      
      {posts.map((post, index) => (
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
    </section>
  );
}
