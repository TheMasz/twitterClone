"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import axios from "axios";

export default function SignIn() {
  const router = useRouter();
  const [emailOrUsername, setEmailOrUsername] = useState<string>("");
  const [password, setPassword] = useState<string | number>();

  const submitHandler = async () => {
    const data = {
      email_username: emailOrUsername,
      password: password,
    };
    try {
      await axios
        .post("http://localhost:5000/auth/signin", data, {
          withCredentials: true,
        })
        .then(() => {
          setEmailOrUsername("");
          setPassword("");
          router.push("/home");
        });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="w-full md:w-10/12 lg:w-1/2  h-auto p-12 lg:px-32 bg-black rounded-2xl">
      <h2 className="font-bold text-3xl mb-4">Signin X</h2>
      <div>
        <input
          type="text"
          onChange={(e) => setEmailOrUsername(e.target.value)}
          value={emailOrUsername}
          className="border border-slate-200 outline-none p-4 h-12 w-full mb-6
           bg-black rounded-lg focus:border-sky-500"
          placeholder="Email or Username"
          required
        />
        <input
          type="password"
          onChange={(e) => setPassword(e.target.value)}
          className="border border-slate-200 outline-none p-4 h-12 w-full mb-6
           bg-black rounded-lg focus:border-sky-500"
          placeholder="Password"
          required
        />
        <button
          onClick={submitHandler}
          type="button"
          className="p-4 w-full rounded-2xl mb-2 text-center text-black bg-white"
        >
          Login
        </button>
        <p>
          don&apos;t have an account?{" "}
          <span className="text-sky-500">
            <Link href="/auth/signup">Signup</Link>
          </span>
        </p>
      </div>
    </div>
  );
}
