import { Dispatch, SetStateAction } from "react";
import { postType } from "@/types";
import axios from "axios";
import Link from "next/link";

import { BiMessageRounded, BiHeart, BiBookmark } from "react-icons/bi";
import { FaBookmark, FaTrash } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { removeHashtag } from "@/utils";

export default function Post({
  post,
  user,
  posts,
  setIsModalComment,
  setPostId,
  setPosts,
  setPost,
}: {
  post?: postType;
  user?: { id: string; username: string } | null;
  posts?: postType[];
  setIsModalComment: Dispatch<SetStateAction<boolean>>;
  setPostId?: Dispatch<SetStateAction<string>>;
  setPosts?: Dispatch<SetStateAction<postType[]>>;
  setPost?: Dispatch<SetStateAction<postType>>;
}) {
  const router = useRouter();

  const likeHandler = async (
    e: React.MouseEvent<HTMLButtonElement>,
    post: postType
  ) => {
    try {
      const action = post.likedByCurrentUser ? "unlike" : "like";

      const res = await axios.post(
        "http://localhost:5000/feed/post/like",
        {
          postId: post._id,
          action: action,
        },
        {
          withCredentials: true,
        }
      );

      if (res.data === "ok") {
        const updatedPosts = posts?.map((p: postType): postType => {
          if (p._id === post._id) {
            return {
              ...p,
              likedByCurrentUser: action === "like",
              likesCount: (p.likesCount || 0) + (action === "like" ? 1 : -1),
            };
          }
          return p;
        });
        setPosts && setPosts(updatedPosts || []);
        setPost &&
          setPost((prevPost) => ({
            ...prevPost,
            likedByCurrentUser: action === "like",
            likesCount:
              (prevPost.likesCount || 0) + (action === "like" ? 1 : -1),
          }));
      }
    } catch (error) {
      console.log(error);
    }
  };

  const saveHandler = async (
    e: React.MouseEvent<HTMLButtonElement>,
    post: postType
  ) => {
    try {
      const action = post.savedByCurrentUser ? "unsave" : "save";

      const res = await axios.post(
        "http://localhost:5000/feed/post/save",
        {
          postId: post._id,
          action: action,
        },
        {
          withCredentials: true,
        }
      );
      if (res.data === "ok") {
        const updatedPosts = posts?.map((p: postType): postType => {
          if (p._id === post._id) {
            return {
              ...p,
              savedByCurrentUser: action === "save",
            };
          }
          return p;
        });
        setPosts && setPosts(updatedPosts || []);
        setPost &&
          setPost((prevPost) => ({
            ...prevPost,
            savedByCurrentUser: action === "save",
          }));
      }
    } catch (error) {
      console.log(error);
    }
  };

  const commentHandler = (postId: string) => {
    setIsModalComment((e) => !e);
    setPostId && setPostId(postId);
  };

  const deleteHandler = async (
    e: React.MouseEvent<HTMLButtonElement>,
    postId: string
  ) => {
    e.preventDefault();
    const cf = confirm("you want to delete this?");
    if (cf) {
      try {
        const respone = await axios.delete(
          `http://localhost:5000/feed/post/delete/${postId}`,
          {
            withCredentials: true,
          }
        );
        if (respone.data == "Post removed") {
          const updatedPosts = posts?.filter((p) => p._id != postId);
          setPosts && setPosts(updatedPosts || []);
          setPost && router.push("/home");
        } else {
          console.log(respone.data);
        }
      } catch (error) {
        console.log(error);
      }
    } else {
      return;
    }
  };

  return (
    <div className=" p-4 border-b border-slate-50 hover:bg-[#181818]">
      <div className="flex gap-2">
        <div className="avatar-sm"></div>

        <div className="flex-1">
          <Link href={`/home/${post?._id}`}>
            <div className="flex items-center justify-between">
              <Link href={`/home/profile/${post?.userId}`}>
                <h4 className="font-bold uppercase">
                  {post?.username || user?.username}
                </h4>
              </Link>

              {user?.id == post?.userId && (
                <button
                  type="button"
                  onClick={(e) => deleteHandler(e, post?._id || "")}
                  className="text-lg text-red-500 hover:text-red-700 mr-4"
                >
                  <FaTrash />
                </button>
              )}
            </div>
            <p>{post?.desc}</p>
            <div className="flex">
              {post?.tags?.map((tag, index) => (
                <Link
                  key={index}
                  href={`/home/tags/${removeHashtag(tag)}`}
                  className=" text-sky-500 font-bold mr-2"
                >
                  {tag}
                </Link>
              ))}
            </div>
          </Link>

          <div className="flex gap-2 mt-2 justify-between">
            <button
              onClick={() => commentHandler(post._id)}
              className="flex-center h-12  w-12 rounded-full hover:text-sky-500"
            >
              <BiMessageRounded className="text-2xl" />
            </button>
            <button
              onClick={(e) => likeHandler(e, post)}
              className={`flex-center h-12  w-12 rounded-full hover:text-red-700 ${
                post?.likedByCurrentUser && "text-red-500"
              }`}
            >
              <BiHeart className={`text-2xl  text-inherit`} />
              <span>{post?.likesCount || 0}</span>
            </button>
            <button
              onClick={(e) => saveHandler(e, post)}
              className="flex-center h-12  w-12 rounded-full hover:text-yellow-500"
            >
              {post?.savedByCurrentUser ? (
                <FaBookmark className="text-2xl text-yellow-500" />
              ) : (
                <BiBookmark className="text-2xl " />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
