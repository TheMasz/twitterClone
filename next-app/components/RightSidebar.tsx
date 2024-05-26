import { userType } from "@/types";
import axios from "axios";
import Link from "next/link";
import { useEffect, useState } from "react";
import Loading from "./Loading";
import { removeHashtag } from "@/utils";

export default function RightSidebar() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [trends, setTrends] = useState<{ count: number; tag: string }[]>([]);
  const [peoples, setPeoples] = useState<userType[]>([]);

  const followHandler = async (
    e: React.MouseEvent<HTMLButtonElement>,
    action: "follow" | "unfollow",
    userId: string
  ) => {
    e.preventDefault();
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
        const updatedPeoples = peoples?.map((p: userType): userType => {
          if (p._id === userId) {
            return {
              ...p,
              isFollowing: action === "follow",
            };
          }
          return p;
        });
        setPeoples(updatedPeoples);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      const resTrends = await axios.get("http://localhost:5000/feed/trends", {
        withCredentials: true,
      });
      const resPeoples = await axios.get("http://localhost:5000/feed/peoples", {
        withCredentials: true,
      });
      setTrends(resTrends.data.trends);
      setPeoples(resPeoples.data.peoples);
      setIsLoading(false);
    };
    fetchData();
  }, []);

  return (
    <section className="p-4 ">
      <div className="p-4 rounded-2xl border border-slate-300 mb-6">
        <h3 className="title-text">Subscribe to Premium</h3>
        <p className="text-justify mb-4">
          Subscribe to unlock new features and if eligible, receive a share of
          ads revenue.
        </p>
        <button className="p-2 bg-sky-500 hover:bg-sky-700 rounded-lg">
          Subscribe
        </button>
      </div>
      <div className="py-4 rounded-2xl border border-slate-300 mb-6">
        <h3 className="px-4 title-text">Trends for you</h3>
        {isLoading ? (
          <Loading />
        ) : (
          <ul>
            {trends?.map((trend, index) => (
              <li className="p-4 rounded-md hover:bg-[#181818]" key={index}>
                <Link href={`/home/tags/${removeHashtag(trend.tag)}`}>
                  <p className="sub-text">Trending in Thailand</p>
                  <p>{trend.tag}</p>
                  <p className="sub-text">{trend.count} posts</p>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
      <div className="py-4 rounded-2xl border border-slate-300">
        <h3 className="px-4 title-text mb-2">Suggest people for you</h3>
        {isLoading ? (
          <Loading />
        ) : (
          <ul>
            {peoples?.map((people, index) => (
              <li key={index} className="p-4 hover:bg-[#181818]">
                <Link
                  href={`/home/profile/${people._id}`}
                  className="flex items-center justify-between"
                >
                  <div className="flex  gap-2">
                    <div className="avatar-sm"></div>
                    <h6 className="text-lg font-bold">{people.username}</h6>
                  </div>
                  <button
                    onClick={(e) =>
                      followHandler(
                        e,
                        people?.isFollowing ? "unfollow" : "follow",
                        people._id
                      )
                    }
                    className="p-2 font-medium border border-slate-50 rounded-xl hover:bg-white hover:text-black"
                  >
                    {people?.isFollowing ? "following" : "follow"}
                  </button>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
