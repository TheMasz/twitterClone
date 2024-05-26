"use client";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function SignUp() {
  const router = useRouter();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string | number>("");
  const [cfPassword, setCfPassword] = useState<string | number>("");
  const submitHandler = async () => {
    console.log("submit");

    try {
      const data = {
        email: email,
        password: password,
        cf_password: cfPassword,
      };
      await axios.post("http://localhost:5000/auth/signup", data, {
        withCredentials: true,
      });
      setEmail("");
      setPassword("");
      setCfPassword("");
      router.push("/auth/signin");
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="w-full md:w-10/12 lg:w-1/2 h-auto p-12 lg:px-32 bg-black rounded-2xl">
      <h2 className="font-bold text-3xl mb-4">Signup X</h2>
      <form action="#">
        <input
          type="text"
          onChange={(e) => setEmail(e.target.value)}
          value={email}
          className="border border-slate-200 outline-none p-4 h-12 w-full mb-6
         bg-black rounded-lg focus:border-sky-500"
          placeholder="Email"
          required
        />
        <input
          type="password"
          onChange={(e) => setPassword(e.target.value)}
          value={password}
          className="border border-slate-200 outline-none p-4 h-12 w-full mb-6
         bg-black rounded-lg focus:border-sky-500"
          placeholder="Password"
          minLength={8}
          required
        />
        <input
          type="password"
          onChange={(e) => setCfPassword(e.target.value)}
          value={cfPassword}
          className="border border-slate-200 outline-none p-4 h-12 w-full mb-6
         bg-black rounded-lg focus:border-sky-500"
          placeholder="Confirm Password"
          minLength={8}
          required
        />
        <button
          onClick={submitHandler}
          type="button"
          className="p-4 w-full rounded-2xl mb-2 text-center text-black bg-white"
        >
          Register
        </button>
        <p>
          Already have an account?{" "}
          <span className="text-sky-500">
            <Link href="/auth/signin">Signin</Link>
          </span>
        </p>
      </form>
    </div>
  );
}
