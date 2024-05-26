import { useState, useEffect, Dispatch, SetStateAction } from "react";
import Loading from "./Loading";
import axios from "axios";
import { userType } from "@/types";

function EditForm({
  userId,
  setIsModalEdit,
  setUsers,
}: {
  userId: string;
  setIsModalEdit: Dispatch<SetStateAction<boolean>>;
  setUsers: Dispatch<SetStateAction<userType>>;
}) {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [email, setEmail] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const [bio, setBio] = useState<string>("");

  const editHandler = async () => {
    const response = await axios.put(
      "http://localhost:5000/profile/edit",
      {
        email: email,
        username: username,
        bio: bio,
      },
      {
        withCredentials: true,
      }
    );
    if (response.data.success) {
      setUsers((prevUser) => ({
        ...prevUser,
        email: response.data.user.email,
        username: response.data.user.username,
        bio: response.data.user.bio,
      }));
      setEmail(response.data.user.email);
      setUsername(response.data.user.username);
      setBio(response.data.user.bio);
      setIsModalEdit(false);
    }
  };

  useEffect(() => {
    const fetchUser = async () => {
      setIsLoading(true);
      const response = await axios.get(
        `http://localhost:5000/profile/${userId}`,
        {
          withCredentials: true,
        }
      );
      setEmail(response.data.user.email);
      setUsername(response.data.user.username);
      setBio(response.data.user.bio);
      setIsLoading(false);
    };
    fetchUser();
  }, [userId]);

  return (
    <div
      className="fixed top-0 left-0 right-0 bottom-0 h-full w-full z-50"
      onClick={() => setIsModalEdit(false)}
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
            <h2 className="font-bold text-lg mb-4">Update your Profile</h2>
            <div className="flex gap-2 items-center mb-4">
              <p className=" w-20">Username: </p>
              <input
                className="p-2 bg-black border border-slate-50 rounded-lg "
                type="text"
                value={username}
                placeholder="Enter your username"
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div className="flex gap-2 items-center mb-4">
              <p className=" w-20">Email: </p>
              <input
                className="p-2 bg-black border border-slate-50 rounded-lg"
                type="email"
                value={email}
                placeholder="Enter your email"
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="flex gap-2 items-center mb-4">
              <p className=" w-20">Bio: </p>
              <input
                className="p-2 bg-black border border-slate-50 rounded-lg"
                type="text"
                value={bio}
                placeholder="Enter your bio"
                onChange={(e) => setBio(e.target.value)}
              />
            </div>
            <div className="flex items-center justify-end mt-4">
              <button
                className="p-2 bg-sky-500 hover:bg-sky-700 rounded-2xl font-medium 
                text-lg"
                type="button"
                onClick={() => editHandler()}
              >
                Update
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default EditForm;
