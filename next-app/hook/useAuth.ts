import { useState, useEffect } from "react";
import axios from "axios";

type user = {
  id: string;
  username: string;
};

export default function useAuth() {
  const [isLogged, setIsLogged] = useState(false);
  const [user, setUser] = useState<user | null>(null);

  useEffect(() => {
    const checkSession = async () => {
      try {
        await axios
          .get("http://localhost:5000/auth/checkSession", {
            withCredentials: true,
          })
          .then((res) => {
            setIsLogged(res.data.logged);
            setUser(res.data.user);
            console.log("in useeffect: ", res.data.logged);
          });
      } catch (error) {
        console.error("Error checking session:", error);
      }
    };
    checkSession();
  }, [isLogged]);

  return { isLogged, setIsLogged, user };
}
