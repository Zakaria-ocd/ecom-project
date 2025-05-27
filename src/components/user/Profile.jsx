"use client";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { isAuthenticated, getAuthToken } from "@/lib/auth";
import ProfileImage from "./ProfileImage";

export default function Profile() {
  const router = useRouter();
  const user = useSelector((state) => state.userReducer);
  const [saving, setSaving] = useState(false);
  const [profileData, setProfileData] = useState({
    username: "",
    email: "",
    password: "",
    password_confirmation: "",
    currentPassword: "",
  });
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated()) {
      router.push("/user/login");
    }
  }, [router]);

  // Load user data
  useEffect(() => {
    if (user) {
      setProfileData((prev) => ({
        ...prev,
        username: user.username || "",
        email: user.email || "",
      }));
    }
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const updateProfile = async (e) => {
    e.preventDefault();

    if (!isAuthenticated()) {
      toast.error("You must be logged in to update your profile");
      return;
    }

    // Check if passwords match when trying to change password
    if (
      profileData.password &&
      profileData.password !== profileData.password_confirmation
    ) {
      toast.error("Passwords do not match");
      return;
    }

    // Check if current password is provided when changing password or email
    if (
      (profileData.password || profileData.email !== user.email) &&
      !profileData.currentPassword
    ) {
      toast.error("Current password is required to change password or email");
      return;
    }

    setSaving(true);
    try {
      const token = getAuthToken();
      const newData = {
        id: user.id,
        username: profileData.username,
        email: profileData.email,
        current_password: profileData.currentPassword,
        password: profileData.password || undefined,
        password_confirmation: profileData.password_confirmation || undefined,
      };
      const response = await fetch(
        `http://localhost:8000/api/users/${user.id}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newData),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to update profile");
      }

      // Update profile image if selected
      if (selectedImage) {
        await uploadProfileImage();
      }

      toast.success("Profile updated successfully");

      // Clear password fields
      setProfileData((prev) => ({
        ...prev,
        password: "",
        password_confirmation: "",
        currentPassword: "",
      }));
    } catch (error) {
      toast.error(error.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const uploadProfileImage = async () => {
    if (!selectedImage) return;

    try {
      const token = getAuthToken();
      const formData = new FormData();
      formData.append("image", selectedImage);
      formData.append("user_id", user.id);

      const response = await fetch("http://localhost:8000/api/users/image", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to upload profile image");
      }

      // Clear selected image after successful upload
      setSelectedImage(null);
      setPreviewImage(null);

      // Update user state with new image from response
      if (data.data && data.data.filename) {
        // Update the user state with the new image
        toast.success("Profile image updated successfully");
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      toast.error(error.message || "Failed to upload profile image");
    }
  };

  if (!isAuthenticated()) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="container mx-auto py-10 px-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-200">
          My Profile
        </h1>

        <Link
          href="/user/orders"
          className="mt-2 sm:mt-0 flex items-center text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mr-1"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
            />
          </svg>
          View My Orders
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Profile Image Card */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h2 className="text-lg font-medium mb-2 text-slate-800 dark:text-slate-200">
            Profile Image
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
            Update your profile picture
          </p>

          <div className="flex flex-col items-center gap-4">
            <div className="relative w-32 h-32 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700 group">
              <ProfileImage
                imageUrl={
                  previewImage
                    ? previewImage
                    : user.image
                    ? `http://localhost:8000/api/users/image/${user.image}`
                    : null
                }
                previewUrl={previewImage}
                username={profileData.username}
                onImageChange={handleImageChange}
                canUpload={true}
                className="w-32 h-32"
              />
            </div>

            <div className="w-full">
              <div className="relative">
                <label
                  htmlFor="picture"
                  className="flex justify-center items-center gap-2 w-full py-2.5 px-4 text-sm font-medium text-gray-900 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 cursor-pointer dark:text-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:hover:bg-gray-600 transition-colors"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  {selectedImage ? "Change Image" : "Upload Image"}
                </label>
                <input
                  id="picture"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
                {selectedImage && (
                  <span className="absolute top-0 right-0 -mt-2 -mr-2 bg-blue-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                    ✓
                  </span>
                )}
              </div>

              {selectedImage && (
                <p className="mt-2 text-xs text-center text-gray-500 dark:text-gray-400">
                  Image selected: {selectedImage.name.substring(0, 20)}
                  {selectedImage.name.length > 20 ? "..." : ""}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Profile Information Card */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow md:col-span-2">
          <h2 className="text-lg font-medium mb-2 text-slate-800 dark:text-slate-200">
            Personal Information
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
            Update your account details
          </p>

          <form onSubmit={updateProfile}>
            <div className="space-y-4">
              <div>
                <label
                  htmlFor="username"
                  className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Username
                </label>
                <input
                  id="username"
                  name="username"
                  value={profileData.username}
                  onChange={handleInputChange}
                  placeholder="Your username"
                  className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:focus:border-blue-400 dark:focus:ring-blue-400"
                />
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={profileData.email}
                  onChange={handleInputChange}
                  placeholder="Your email address"
                  className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:focus:border-blue-400 dark:focus:ring-blue-400"
                />
              </div>

              <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-medium mb-4 text-slate-800 dark:text-slate-200">
                  Change Password
                </h3>

                <div>
                  <label
                    htmlFor="currentPassword"
                    className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    Current Password
                  </label>
                  <input
                    id="currentPassword"
                    name="currentPassword"
                    type="password"
                    value={profileData.currentPassword}
                    onChange={handleInputChange}
                    placeholder="Enter your current password"
                    className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:focus:border-blue-400 dark:focus:ring-blue-400"
                  />
                </div>

                <div className="mt-4">
                  <label
                    htmlFor="password"
                    className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    New Password
                  </label>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    value={profileData.password}
                    onChange={handleInputChange}
                    placeholder="Enter new password"
                    className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:focus:border-blue-400 dark:focus:ring-blue-400"
                  />
                </div>

                <div className="mt-4">
                  <label
                    htmlFor="password_confirmation"
                    className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    Confirm New Password
                  </label>
                  <input
                    id="password_confirmation"
                    name="password_confirmation"
                    type="password"
                    value={profileData.password_confirmation}
                    onChange={handleInputChange}
                    placeholder="Confirm new password"
                    className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:focus:border-blue-400 dark:focus:ring-blue-400"
                  />
                </div>
              </div>
            </div>

            <div className="mt-6">
              <button
                type="submit"
                disabled={saving}
                className="w-full flex items-center justify-center rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-200 dark:focus:ring-blue-800 disabled:bg-blue-400"
              >
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
