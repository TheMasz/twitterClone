"use client";
import LeftSidebar from "@/components/LeftSidebar";
import PostForm from "@/components/PostForm";
import RightSidebar from "@/components/RightSidebar";
import { useState } from "react";
import { FaBars } from "react-icons/fa6";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [isModal, setIsModal] = useState<boolean>(false);
  const [isSidebar, setIsSidebar] = useState<boolean>(true);

  return (
    <>
      <main className="relative container mx-auto overflow-x-hidden">
        <div className="flex">
          <div className="fixed min-h-screen md:w-64 bg-black ">
            {isSidebar ? (
              <LeftSidebar
                setIsModal={setIsModal}
                setIsSidebar={setIsSidebar}
              />
            ) : (
              <button className="mt-8" onClick={() => setIsSidebar(true)}>
                <FaBars className="text-lg" />
              </button>
            )}
          </div>

          <main
            className={` flex-1 border-l border-r border-slate-300 p-4 ${
              isSidebar ? "ml-64" : "ml-20"
            }`}
          >
            {children}
          </main>
          <div className="relative w-0 min-h-screen hidden lg:w-80 lg:block">
            <RightSidebar />
          </div>
        </div>
      </main>
      {isModal && (
        <div
          className="fixed top-0 left-0 right-0 bottom-0 h-full w-full z-50"
          onClick={() => setIsModal(false)}
        >
          <div className="bg-gray-800 opacity-50 h-full w-full absolute"></div>
          <div
            onClick={(e) => e.stopPropagation()}
            className="p-6 absolute top-12 left-2/4 z-[1000]
      transform -translate-x-1/2 
      border rounded-2xl bg-black bg-opacity-90 backdrop-filter backdrop-blur-lg"
          >
            <PostForm setIsModal={setIsModal} />
          </div>
        </div>
      )}
    </>
  );
}
