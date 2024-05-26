"use client";

import Link from "next/link";
import axios from "axios";

import {
  MdOutlineHome,
  MdOutlineSearch,
  MdOutlineNotifications,
  MdOutlineLocalPostOffice,
  MdOutlineListAlt,
  MdOutlineBookmarkBorder,
  MdOutlinePerson,
  MdOutlineMoreHoriz,
} from "react-icons/md";
import { HiOutlineUsers } from "react-icons/hi";
import { BsTwitterX } from "react-icons/bs";
import { CiCircleMore } from "react-icons/ci";
import { FaBars } from "react-icons/fa6";

import { useRouter } from "next/navigation";
import { Dispatch, SetStateAction, useState } from "react";
import useAuth from "@/hook/useAuth";

export default function LeftSidebar({
  setIsModal,
  setIsSidebar,
}: {
  setIsModal: Dispatch<SetStateAction<boolean>>;
  setIsSidebar: Dispatch<SetStateAction<boolean>>;
}) {
  const router = useRouter();
  const { user } = useAuth();
  const [isMenu, setIsMenu] = useState<boolean>(false);
  const logoutHandler = async () => {
    await axios
      .post("http://localhost:5000/auth/logout", null, {
        withCredentials: true,
      })
      .then(() => {
        router.push("/auth/signin");
      });
  };

  return (
    <section className="flex flex-col p-4 bg-black">
      <nav className="p-4 flex-1">
        <li className="flex justify-between items-center gap-4 text-xl font-bold py-4 hover:underline">
          <Link href="/">
            <BsTwitterX />
          </Link>
          <button onClick={()=>setIsSidebar(false)}>
            <FaBars className="text-lg"/>
          </button>
        </li>
        <li className="flex items-center gap-4 text-xl font-bold py-4 hover:underline">
          <MdOutlineHome />
          <Link href="/home">Home</Link>
        </li>
        <li className="flex items-center gap-4 text-xl font-bold py-4 hover:underline">
          <MdOutlineSearch />
          <Link href="/">Search</Link>
        </li>
        <li className="flex items-center gap-4 text-xl font-bold py-4 hover:underline">
          <MdOutlineNotifications />
          <Link href="/">Notifications</Link>
        </li>
        <li className="flex items-center gap-4 text-xl font-bold py-4 hover:underline">
          <MdOutlineLocalPostOffice />
          <Link href="/">Messages</Link>
        </li>
        <li className="flex items-center gap-4 text-xl font-bold py-4 hover:underline">
          <MdOutlineListAlt />
          <Link href="/">Lists</Link>
        </li>
        <li className="flex items-center gap-4 text-xl font-bold py-4 hover:underline">
          <MdOutlineBookmarkBorder />
          <Link href="/home/bookmarks">Bookmarks</Link>
        </li>
        <li className="flex items-center gap-4 text-xl font-bold py-4 hover:underline">
          <HiOutlineUsers />
          <Link href="/">Communities</Link>
        </li>
        <li className="flex items-center gap-4 text-xl font-bold py-4 hover:underline">
          <BsTwitterX />
          <Link href="/">Premium</Link>
        </li>
        <li className="flex items-center gap-4 text-xl font-bold py-4 hover:underline">
          <MdOutlinePerson />
          <Link href="/">Profile</Link>
        </li>
        <li className="flex items-center gap-4 text-xl font-bold py-4 hover:underline">
          <CiCircleMore />
          <Link href="/">More</Link>
        </li>
        <li className="py-4">
          <button
            onClick={() => setIsModal(true)}
            className="p-4 font-medium text-xl bg-sky-500 w-full rounded-xl hover:bg-sky-700"
          >
            Post
          </button>
        </li>
      </nav>
      <div className="relative flex justify-between items-center p-4 rounded-lg cursor-pointer">
        <div className="flex gap-2 items-center">
          <div className="avatar-sm"></div>
          <div>
            <p className="uppercase">{user?.username}</p>
            <p>@{user?.username}</p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => setIsMenu(!isMenu)}
          className=" hover:bg-[#181818] p-2 rounded-full "
        >
          <MdOutlineMoreHoriz className="text-lg" />
        </button>
        {isMenu && (
          <ul className="absolute right-[-80px] rounded-lg border border-slate-50 bg-black">
            <li className="p-2 border-b hover:bg-[#181818] rounded-lg text-center">
              <Link href={`/home/profile/${user?.id}`}>My Profile</Link>
            </li>
            <li className="p-2 border-b hover:bg-[#181818] rounded-lg text-center">
              <button type="button" onClick={() => logoutHandler()}>
                Logout
              </button>
            </li>
          </ul>
        )}
      </div>
    </section>
  );
}
