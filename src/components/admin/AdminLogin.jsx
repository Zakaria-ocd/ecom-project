"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import LoadingSpinner from "../LoadingSpinner";
import { Button } from "../ui/button";
function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState({
    emailError: "",
    passwordError: "",
    notFoundError: "",
  });
  const router = useRouter();
  useEffect(() => {
    async function checkAuth() {
      if (!localStorage.getItem("token")) {
        return setLoading(true);
      }
      const response = await fetch(
        "http://localhost:8000/api/admin/checkAuth",
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      const data = await response.json();
      console.log(data);
      if (data.ok) {
        router.replace("/admin/dashboard");
      } else {
        setLoading(true);
      }
    }
    checkAuth();
  }, []);
  async function submitData() {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!re.test(email)) {
      setError({ ...error, emailError: "Invalid email" });
      return;
    }

    const body = JSON.stringify({ email, password });
    console.log({
      "Content-Type": "application/json",
      body,
    });
    try {
      const response = await fetch("http://localhost:8000/api/admin/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body,
      });

      if (!response.ok) {
        const errorData = await response.json();
        setError({
          ...error,
          notFoundError: errorData.error || "Login failed",
        });
        return;
      }

      const data = await response.json();
      console.log(data);

      if (data.token) {
        localStorage.setItem("token", data.token);
        router.replace("/admin/dashboard");
      } else {
        setError({ ...error, notFoundError: "Invalid credentials" });
      }
    } catch (err) {
      console.error("Login error:", err);
      setError({ ...error, notFoundError: "Network error. Please try again." });
    }
  }

  return (
    <>
      {loading ? (
        <div className="w-full flex justify-center relative h-[100vh] overflow-hidden bg-red-300">
          <div className="h-full w-full relative">
            <Image
              alt="User profile"
              src={
                "/assets/20151215195453-business-leader-group-front-leadership-team-professionals-businesspeople.webp"
              }
              width={2000}
              height={1000}
              className="absolute object-cover"
            />
            <div className="bg-[#405189]/60  text-gray-100 flex flex-col items-center w-full h-full  absolute">
              <div className="space-x-14 items-center mt-7 justify-between">
                <Image
                  alt="User profile"
                  src={"/assets/favicon.ico"}
                  width={40}
                  height={40}
                  className="absolute mt-7 object-cover"
                ></Image>
                <h1 className="text-3xl mt-10">3Z Shop</h1>
              </div>
              <p className="text-gray-200">
                Buy, and sell products securely with ease
              </p>
            </div>
          </div>

          <div className="w-[1000px] h-[400px] bg-gray-200 absolute -bottom-40 -left-40 rotate-[8deg]"></div>
          <div className="w-[1000px] h-[400px] bg-gray-200 absolute -bottom-40 -right-40 rotate-[-8deg]"></div>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              submitData();
            }}
            className="absolute items-center shadow-md flex flex-col rounded-md h-[400px] w-[480px] bg-white top-48"
          >
            <div className="w-68 gap-1 h-32 justify-center   flex flex-col items-center">
              <p className="font-[500] text-[#3c5abf] text-xl">
                Welcome Back !
              </p>
              <p className="text-black/50 font-[450] text-[0.9rem]">
                Sign in to continue to dashboard admin
              </p>
            </div>
            <div className="w-full h-[160px] justify-between flex flex-col items-center">
              <div className="w-[80%] h-[68px] flex flex-col justify-between">
                <label className="text-[0.95rem]">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setError({ ...error, emailError: "", notFoundError: "" });
                  }}
                  placeholder="Enter email"
                  className="w-full h-10 focus:duration-300 focus:border-black/35 pl-4 placeholder:text-[0.95rem] border  rounded-sm border-black/20 outline-none "
                />
                {error.emailError && (
                  <p className="text-red-500 text-xs mt-1">
                    {error.emailError}
                  </p>
                )}
              </div>
              <div className="w-[80%] h-[68px] flex flex-col justify-between">
                <label className="text-[0.95rem]">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError({
                      ...error,
                      passwordError: "",
                      notFoundError: "",
                    });
                  }}
                  placeholder="Enter password"
                  className="w-full h-10 focus:duration-300 focus:border-black/35 pl-4 placeholder:text-[0.95rem] border  rounded-sm border-black/20 outline-none "
                />
                {error.passwordError && (
                  <p className="text-red-500 text-xs mt-1">
                    {error.passwordError}
                  </p>
                )}
              </div>
              {error.notFoundError && (
                <p className="text-red-500 text-sm w-[80%] text-center">
                  {error.notFoundError}
                </p>
              )}
            </div>
            <Button
              type="submit"
              className="w-[80%] rounded-sm font-semibold text-white bg-[#0ab39c] hover:bg-[#279385] h-10 mt-8"
            >
              Login
            </Button>
          </form>
        </div>
      ) : (
        <LoadingSpinner />
      )}
    </>
  );
}

export default AdminLogin;
