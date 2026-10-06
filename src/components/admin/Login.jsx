"use client";
import { useState } from "react";
import { LoaderCircle, Lock, Mail } from "lucide-react";
import Notification from "./Notification";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Button } from "../ui/button";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState({
    message: "",
    type: "",
    visible: false,
  });
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Something went wrong");
      }
      setNotification({
        message: data.message,
        type: "success",
        visible: true,
      });
      router.push("/admin/dashboard");
    } catch (err) {
      setNotification({ message: err.message, type: "error", visible: true });
    } finally {
      setLoading(false);
    }
  };

  const closeNotification = () => {
    setNotification({ ...notification, visible: false });
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className={`bg-white p-8 rounded-lg shadow-xl w-96 form-container`}>
        <Image
          src={"/assets/logo.png"}
          alt="Logo"
          width={158}
          height={170}
          className="mx-auto pointer-events-none mb-6"
        />

        <form onSubmit={handleSubmit}>
          <div className="mb-4 relative">
            <label
              className="block text-gray-700 font-medium mb-2"
              htmlFor="email"
            >
              Email
            </label>
            <div className="flex items-center bg-gray-50 p-2 rounded-lg border border-gray-300 focus-within:border-blue-500 transition">
              <Mail className="mr-2 h-4 w-4 text-gray-500" />
              <input
                className="w-full bg-transparent outline-none text-gray-700"
                type="email"
                id="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="mb-6 relative">
            <label
              className="block text-gray-700 font-medium mb-2"
              htmlFor="password"
            >
              Password
            </label>
            <div className="flex items-center bg-gray-50 p-2 rounded-lg border border-gray-300 focus-within:border-blue-500 transition">
              <Lock className="mr-2 h-4 w-4 text-gray-500" />
              <input
                className="w-full bg-transparent outline-none text-gray-700"
                type="password"
                id="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <Button
            className="w-full bg-cyan-600 text-white p-2 rounded-lg hover:bg-cyan-700 transition duration-300 focus:outline-none"
            type="submit"
            disabled={loading}
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <LoaderCircle className="mr-2 h-4 w-4 animate-spin text-white" />
                <span>Logging in...</span>
              </div>
            ) : (
              <span>Login</span>
            )}
          </Button>
        </form>
      </div>

      {notification.visible && (
        <Notification
          message={notification.message}
          type={notification.type === "success" ? "success" : "error"}
          onClose={closeNotification}
        />
      )}
    </div>
  );
}
