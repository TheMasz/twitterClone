"use client";
import { useRouter } from "next/navigation";
import useAuth from "@/hook/useAuth";
import { useEffect } from "react";

export default function Init() {
  const router = useRouter();
  const { isLogged } = useAuth();
  console.log("logged on component", isLogged);

  useEffect(() => {
    if (isLogged) {
      router.push("/home");
    } else {
      router.push("/auth/signin");
    }
  }, [isLogged, router]);

  return null;
}
