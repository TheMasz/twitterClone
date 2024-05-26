import { commentType, postType } from "@/types";
import axios from "axios";
import { useEffect, useState, Dispatch, SetStateAction } from "react";
import Loading from "./Loading";

export default function CommentForm({
  postId,
  setIsModalComment,
  setComments,
}: {
  postId?: string;
  setIsModalComment?: Dispatch<SetStateAction<boolean>>;
  setComments?: Dispatch<SetStateAction<commentType[]>> | undefined;
}) {
  const [comment, setComment] = useState<string>("");
  const [post, setPost] = useState<postType>();
  const [isLoading, setIsloading] = useState<boolean>(false);

  const commentHandler = async () => {
    if (comment === "") return;
    try {
      const respone = await axios.post(
        "http://localhost:5000/feed/post/comment",
        {
          comment: comment,
          postId: postId,
        },
        { withCredentials: true }
      );
      setComment("");
      setComments &&
        setComments((prevComment) => [respone.data.comment, ...prevComment]);
      setIsModalComment && setIsModalComment(false);
    } catch (error) {
      console.log(error);
    }
  };

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
      setIsloading(false);
    };
    postId && fetchPost();
  }, [postId]);

  return setIsModalComment ? (
    <div
      className="fixed top-0 left-0 right-0 bottom-0 h-full w-full z-50"
      onClick={() => setIsModalComment(false)}
    >
      <div className="bg-gray-800 opacity-50 h-full w-full absolute"></div>
      <div
        className="p-4 absolute top-12 left-2/4 z-[1000]
      transform -translate-x-1/2 border rounded-2xl bg-black bg-opacity-90 backdrop-filter backdrop-blur-lg "
        onClick={(e) => e.stopPropagation()}
      >
        {isLoading ? (
          <Loading />
        ) : (
          <>
            <div className="flex gap-2 mb-4">
              <div className="flex flex-col  items-center">
                <div className="avatar-sm"></div>
                <div className="line py-2 mt-4 h-full w-[1px] bg-slate-50"></div>
              </div>
              <div>
                <h4 className="font-bold text-lg">{post?.username}</h4>
                <p className="text-lg">{post?.desc}</p>
                <div className="flex mb-4">
                  {post?.tags?.map((tag, index) => (
                    <p key={index} className=" text-sky-500 font-bold mr-2">
                      {tag}
                    </p>
                  ))}
                </div>
                <p className="text-lg font-extralight">
                  Replying to{" "}
                  <span className=" text-sky-300">@{post?.username}</span>
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <div className="avatar-sm"></div>
              <textarea
                className="mb-4 p-2 bg-inherit text-2xl focus:outline-none"
                style={{ resize: "none" }}
                cols={50}
                rows={5}
                placeholder="Post your reply"
                onChange={(e) => setComment(e.target.value)}
                value={comment}
                required
              ></textarea>
            </div>
            <hr />
            <div className="flex items-center justify-end mt-4">
              <button
                className="  p-4  bg-sky-500 hover:bg-sky-700 rounded-2xl font-bold text-xl"
                type="button"
                onClick={() => commentHandler()}
              >
                Reply
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  ) : (
    <>
      <div className="flex gap-2">
        <div className="avatar-sm"></div>
        <textarea
          className="mb-4 p-2 bg-inherit text-2xl focus:outline-none"
          style={{ resize: "none" }}
          cols={50}
          rows={5}
          placeholder="Post your reply"
          onChange={(e) => setComment(e.target.value)}
          value={comment}
          required
        ></textarea>
      </div>
      <hr />
      <div className="flex items-center justify-end mt-4">
        <button
          className="  p-4  bg-sky-500 hover:bg-sky-700 rounded-2xl font-bold text-xl"
          type="button"
          onClick={() => commentHandler()}
        >
          Reply
        </button>
      </div>
    </>
  );
}
