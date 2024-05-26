import { useState, Dispatch, SetStateAction } from "react";
import axios from "axios";
import { postType } from "@/types";
import { useRouter } from "next/navigation";

export default function PostForm({
  setIsModal,
  setPosts,
}: {
  setIsModal?: Dispatch<SetStateAction<boolean>>;
  setPosts?: Dispatch<SetStateAction<postType[]>>;
}) {
  const router = useRouter();
  const [desc, setDesc] = useState<string | number>("");

  const postHandler = async () => {
    if (desc === "") return;
    try {
      await axios
        .post(
          "http://localhost:5000/feed/post",
          { desc: desc },
          {
            withCredentials: true,
          }
        )
        .then((res) => {
          setDesc("");
          setPosts
            ? setPosts((prevPosts) => [res.data.post, ...prevPosts])
            : router.push("/home");
          setIsModal && setIsModal(false);
        });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <div className="flex gap-2">
        <div className="avatar-sm"></div>
        <textarea
          className="mb-4 p-2 bg-inherit text-2xl focus:outline-none"
          name="desc"
          style={{ resize: "none" }}
          cols={50}
          rows={5}
          placeholder="What is happening?!"
          onChange={(e) => setDesc(e.target.value)}
          value={desc}
          required
        ></textarea>
      </div>

      <hr />
      <div className="flex items-center justify-end mt-4">
        <button
          className="  p-4  bg-sky-500 hover:bg-sky-700 rounded-2xl font-bold text-xl"
          type="button"
          onClick={postHandler}
        >
          Post
        </button>
      </div>
    </>
  );
}
