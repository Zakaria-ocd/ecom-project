"use client";
import { useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { toast } from "sonner";
import { ArrowLeft, Camera, Loader2, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function EditUserPage() {
  const { userId } = useParams();
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const fileInputRef = useRef(null);

  // Form state
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    role: "",
  });

  // Image upload state
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    fetchUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  async function fetchUser() {
    setLoading(true);
    try {
      const response = await fetch(
        `http://localhost:8000/api/users/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch user");
      }

      const data = await response.json();
      setUser(data);
      setFormData({
        username: data.username || "",
        email: data.email || "",
        role: data.role || "",
      });
    } catch (error) {
      console.error("Error fetching user:", error);
      toast.error("Failed to load user details");
    } finally {
      setLoading(false);
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleRoleChange = (value) => {
    setFormData((prev) => ({
      ...prev,
      role: value,
    }));
  };

  const handleImageClick = () => {
    fileInputRef.current.click();
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image is too large. Maximum size is 5MB.");
        return;
      }

      setSelectedImage(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (file) {
      if (file.type.startsWith("image/")) {
        if (file.size > 5 * 1024 * 1024) {
          toast.error("Image is too large. Maximum size is 5MB.");
          return;
        }
        setSelectedImage(file);
        setPreviewUrl(URL.createObjectURL(file));
      } else {
        toast.error("File must be an image");
      }
    }
  };

  const removeImage = async () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setSelectedImage(null);
    setPreviewUrl(null);
    fileInputRef.current.value = "";

    // If this is an existing user image, delete it from the server
    if (user.image) {
      try {
        const response = await fetch(
          `http://localhost:8000/api/users/image/${userId}`,
          {
            method: "DELETE",
          }
        );

        if (!response.ok) {
          throw new Error("Failed to delete image");
        }

        const data = await response.json();
        if (data.success) {
          toast.success("Profile image deleted");
          // Update local user state
          setUser((prev) => ({
            ...prev,
            image: null,
          }));
        } else {
          throw new Error(data.message || "Failed to delete image");
        }
      } catch (error) {
        console.error("Error deleting image:", error);
        toast.error(error.message || "Failed to delete image");
      }
    }
  };

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);

    try {
      // First handle image upload if an image was selected
      if (selectedImage) {
        const formDataImage = new FormData();
        formDataImage.append("image", selectedImage);
        formDataImage.append("user_id", userId);

        const imageResponse = await fetch(
          `http://localhost:8000/api/users/image`,
          {
            method: "POST",
            body: formDataImage,
          }
        );

        if (!imageResponse.ok) {
          throw new Error("Failed to upload image");
        }
      }

      // Update user details
      const response = await fetch(
        `http://localhost:8000/api/users/${userId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify(formData),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update user");
      }

      toast.success("User updated successfully");
      router.push(`/admin/users/${userId}`);
    } catch (error) {
      console.error("Error updating user:", error);
      toast.error(error.message || "Failed to update user");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <Breadcrumb className="mb-6">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/admin/dashboard">Dashboard</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/admin/users">Users</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href={`/admin/users/${userId}`}>
                User
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Edit</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <Skeleton className="h-8 w-1/3 mb-8" />

          <div className="flex flex-col md:flex-row gap-8">
            <div className="md:w-1/3">
              <Skeleton className="h-64 w-full rounded-lg" />
            </div>

            <div className="md:w-2/3 space-y-6">
              <div className="space-y-2">
                <Skeleton className="h-6 w-1/4" />
                <Skeleton className="h-10 w-full" />
              </div>

              <div className="space-y-2">
                <Skeleton className="h-6 w-1/4" />
                <Skeleton className="h-10 w-full" />
              </div>

              <div className="space-y-2">
                <Skeleton className="h-6 w-1/4" />
                <Skeleton className="h-10 w-full" />
              </div>

              <div className="space-y-2">
                <Skeleton className="h-6 w-1/4" />
                <Skeleton className="h-10 w-full" />
              </div>

              <Skeleton className="h-10 w-32" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container mx-auto p-6">
        <Breadcrumb className="mb-6">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/admin/dashboard">Dashboard</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/admin/users">Users</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>User Not Found</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="bg-white rounded-lg shadow-sm p-8 text-center">
          <h1 className="text-2xl font-semibold text-red-600 mb-4">
            User Not Found
          </h1>
          <p className="text-slate-600 mb-6">
            The user you are trying to edit does not exist or has been deleted.
          </p>
          <Button asChild>
            <Link href="/admin/users">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Return to Users
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <Breadcrumb className="mb-6">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/admin/dashboard">Dashboard</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="/admin/users">Users</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href={`/admin/users/${userId}`}>
              {user.username || `User #${user.id}`}
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Edit</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-6 border-b border-slate-100">
          <h1 className="text-2xl font-semibold">Edit User</h1>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="flex flex-col md:flex-row gap-8">
            <div className="md:w-1/3">
              <div className="bg-slate-50 rounded-lg p-6 flex flex-col items-center justify-center">
                {/* Image Upload Dropzone */}
                <div
                  className={`relative cursor-pointer w-full pb-6 ${
                    isDragging ? "opacity-70" : ""
                  }`}
                  onClick={handleImageClick}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpg, image/jpeg, image/png, image/webp, image/avif"
                    onChange={handleImageChange}
                    className="sr-only"
                  />

                  <div className="relative h-48 w-48 mx-auto mb-4 rounded-full overflow-hidden bg-white border-2 border-dashed hover:border-blue-400 transition-colors duration-200 border-slate-300">
                    {previewUrl ? (
                      <Image
                        src={previewUrl}
                        alt="Profile preview"
                        fill
                        className="object-cover"
                      />
                    ) : user.image ? (
                      <Image
                        src={`http://localhost:8000/api/users/imageById/${user.id}`}
                        alt={user.username || `User #${user.id}`}
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    ) : (
                      <div className="h-full w-full flex flex-col items-center justify-center bg-blue-50 text-blue-500">
                        <Camera className="h-12 w-12 mb-2 opacity-50" />
                        <span className="text-sm font-medium text-center">
                          Click or drop
                          <br />
                          to upload
                        </span>
                      </div>
                    )}

                    {(previewUrl || user.image) && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 hover:opacity-100 transition-opacity">
                        <Camera className="h-12 w-12 text-white" />
                      </div>
                    )}
                  </div>

                  {/* Remove Button - Only shown when there's a preview or user image */}
                  {(previewUrl || user.image) && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeImage();
                      }}
                      className="absolute top-0 right-0 bg-red-100 text-red-600 hover:bg-red-200 p-1 rounded-full transition-colors"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}

                  <div className="mt-2 text-center text-sm text-slate-500">
                    <p className="font-medium text-slate-700">Profile Image</p>
                    <p className="mt-1 text-xs">
                      Click to browse or drag & drop
                    </p>
                    <p className="text-xs">JPG, PNG, WEBP • Max 5MB</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="md:w-2/3 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="username">Username</Label>
                  <Input
                    id="username"
                    name="username"
                    value={formData.username}
                    onChange={handleInputChange}
                    placeholder="Enter username"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="Enter email"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="role">Role</Label>
                  <Select
                    value={formData.role}
                    onValueChange={handleRoleChange}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="admin">Admin</SelectItem>
                      <SelectItem value="seller">Seller</SelectItem>
                      <SelectItem value="buyer">Buyer</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="id">ID</Label>
                  <Input
                    id="id"
                    value={user.id}
                    disabled
                    className="bg-slate-50 text-slate-500"
                  />
                </div>
              </div>

              <div className="pt-4 flex justify-between items-center">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push(`/admin/users/${userId}`)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={saving}
                  className="min-w-[120px]"
                >
                  {saving ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    "Save Changes"
                  )}
                </Button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
