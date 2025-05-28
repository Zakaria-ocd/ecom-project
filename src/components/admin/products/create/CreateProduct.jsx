"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import ProductChoices from "./ProductChoices";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { FaUpload, FaXmark } from "react-icons/fa6";
import { IoIosCloudUpload } from "react-icons/io";
import Image from "next/image";
import { useSelector } from "react-redux";

export default function CreateProduct() {
  const [productData, setProductData] = useState({
    name: "",
    description: "",
    category_id: null,
  });
  const [selectedImages, setSelectedImages] = useState([]);
  const [previewImages, setPreviewImages] = useState([]);

  const [categories, setCategories] = useState([]);
  const [productChoices, setProductChoices] = useState([]);

  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [componentKey, setComponentKey] = useState(0);

  const user = useSelector((state) => state.userReducer);

  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true);
      try {
        const res = await fetch("http://localhost:8000/api/categories");
        if (!res.ok) throw new Error("Failed to fetch categories");
        const data = await res.json();
        setCategories(data.data || []);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load categories");
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  function handleFileChange(event) {
    const MAX_FILE_SIZE_MB = 5;
    const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;
    const MAX_FILE_COUNT = 10;
    const ALLOWED_TYPES = [
      "image/jpeg",
      "image/jpg",
      "image/avif",
      "image/png",
      "image/webp",
    ];

    const files = Array.from(event.target.files);
    const availableSlots = MAX_FILE_COUNT - selectedImages.length;
    const validFiles = files.slice(0, availableSlots).filter((file) => {
      if (!ALLOWED_TYPES.includes(file.type)) {
        toast.error(`Invalid file type: ${file.name}`);
        return false;
      }
      if (file.size > MAX_FILE_SIZE_BYTES) {
        toast.error(
          `File too big (${(file.size / 1024 / 1024).toFixed(1)}MB): ${
            file.name
          }`
        );
        return false;
      }
      return true;
    });

    if (files.length > validFiles.length) {
      toast.warning(`Can only upload ${availableSlots} more files`);
    }

    setSelectedImages((prev) => [...prev, ...validFiles]);
    setPreviewImages((prev) => [
      ...prev,
      ...validFiles.map((file) => URL.createObjectURL(file)),
    ]);
  }

  function removeImage(index) {
    setSelectedImages((prev) => prev.filter((_, i) => i !== index));
    setPreviewImages((prev) => prev.filter((_, i) => i !== index));
  }

  const validateProductData = () => {
    if (!productData.name.trim()) {
      toast.error("Product name is required");
      return false;
    }
    return true;
  };

  const validateChoices = () => {
    if (!productChoices.length) {
      toast.error("At least one product choice is required");
      return false;
    }
    for (let i = 0; i < productChoices.length; i++) {
      if (productChoices[i].typeValuePairs.length === 0) {
        toast.error(`Choice ${i + 1} has no options selected`);
        return false;
      }
    }
    return true;
  };

  const validateImages = () => {
    if (selectedImages.length === 0) {
      toast.warning("Please select at least one image.");
      return false;
    }
    if (selectedImages.length > 10) {
      toast.warning("Maximum 10 images allowed");
      return false;
    }
    return true;
  };

  async function uploadImages(productId, files) {
    try {
      const formData = new FormData();
      files.forEach((file) => formData.append("images[]", file));
      formData.append("product_id", productId);

      const res = await fetch("http://localhost:8000/api/uploadImages", {
        method: "POST",
        body: formData,
        headers: { Accept: "application/json" },
      });
      const data = await res.json();

      if (res.ok) {
        return data;
      }
    } catch (error) {
      console.error(data.message, error, "Image upload failed");
      toast.error(data.message);
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateProductData() || !validateChoices() || !validateImages())
      return;

    setSubmitting(true);
    try {
      const newProduct = { ...productData, seller_id: user.id };
      const productRes = await fetch("http://localhost:8000/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newProduct),
      });
      if (!productRes.ok) throw new Error("Failed to create product");
      const prData = await productRes.json();
      const productId = prData.data.id;

      if (selectedImages.length && productId) {
        await uploadImages(productId, selectedImages);
      }

      const choicePromises = productChoices.map((choice) => {
        const choiceData = {
          typeValuePairs: choice.typeValuePairs.map((pair) => ({
            typeId: pair.typeId,
            valueId: pair.valueId,
            colorCode: pair.colorCode,
          })),
          price: choice.price,
          quantity: choice.quantity,
        };
        const res = fetch(
          `http://localhost:8000/api/products/${productId}/choices`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(choiceData),
          }
        );

        return res;
      });

      const responses = await Promise.all(choicePromises);
      const failed = responses.filter((r) => !r.ok);
      if (failed.length)
        throw new Error(`Failed to create ${failed.length} choices`);

      toast.success(prData.message);
      setProductData({ name: "", description: "", category_id: null });
      setSelectedImages([]);
      setPreviewImages([]);
      setProductChoices([]);
      setComponentKey((prev) => prev + 1);
    } catch (error) {
      console.error(error);
      toast.error(error.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 px-4 pt-8 pb-[60px] relative">
      <h1 className="text-3xl text-slate-800 font-semibold ml-3">
        Product Creation
      </h1>
      <form
        onSubmit={handleSubmit}
        className="w-full flex flex-col items-center gap-y-4 px-4"
      >
        <div className="w-full flex flex-col items-start gap-4 mb-8">
          <div className="border border-dashed border-slate-400/80 p-2.5">
            <div className="min-w-96 min-h-96 flex flex-col items-center justify-center gap-10">
              <div className="flex flex-wrap items-center gap-2">
                {previewImages.length ? (
                  previewImages.map((url, i) => (
                    <div key={i} className="relative">
                      <Image
                        src={url}
                        alt={`Preview ${i}`}
                        width={120}
                        height={120}
                        className="object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(i)}
                        className="absolute top-1 right-1 bg-rose-600 hover:bg-rose-700 rounded-full size-5 flex items-center justify-center"
                      >
                        <FaXmark className="text-white" />
                      </button>
                    </div>
                  ))
                ) : (
                  <div className="flex flex-col items-center gap-3 text-center text-sm text-slate-700">
                    <IoIosCloudUpload size={80} className="text-sky-400" />
                    <div className="text-slate-600">
                      Upload images<div className="text-slate-500">or</div>drop
                      them here
                    </div>
                  </div>
                )}
              </div>
              <input
                id="file-upload"
                type="file"
                accept="image/jpeg,image/jpg,image/avif,image/png,image/webp"
                multiple
                onChange={handleFileChange}
                className="hidden"
              />
            </div>
          </div>
          <Button type="button" className="bg-emerald-500 hover:bg-emerald-600">
            <label
              htmlFor="file-upload"
              className="cursor-pointer px-4 py-2 flex items-center gap-2"
            >
              Upload Images ({selectedImages.length}/10, max 5MB each){" "}
              <FaUpload />
            </label>
          </Button>
        </div>

        <div className="w-full">
          <label className="block mb-1 text-sm font-medium text-gray-900">
            Product Name:
          </label>
          <input
            type="text"
            value={productData.name}
            onChange={(e) =>
              setProductData((prev) => ({ ...prev, name: e.target.value }))
            }
            className="w-full rounded-lg border border-gray-300 p-2.5 text-sm text-gray-900"
            required
          />
        </div>

        <div className="w-full">
          <label className="block mb-1 text-sm font-medium text-gray-900">
            Description:
          </label>
          <textarea
            rows={4}
            value={productData.description}
            onChange={(e) =>
              setProductData((prev) => ({
                ...prev,
                description: e.target.value,
              }))
            }
            className="w-full rounded-lg border border-gray-300 p-2.5 text-sm text-gray-900"
            required
          />
        </div>

        <div className="w-full">
          <label className="block mb-1 text-sm font-medium text-gray-900">
            Category:
          </label>
          <Select
            value={productData.category_id?.toString() || ""}
            onValueChange={(val) =>
              setProductData((prev) => ({
                ...prev,
                category_id: parseInt(val, 10) || null,
              }))
            }
          >
            <SelectTrigger className="w-full bg-white">
              <SelectValue placeholder="Select a category" />
            </SelectTrigger>
            <SelectContent>
              {loading ? (
                <div className="p-2 flex items-center">
                  <Loader2 className="animate-spin mr-2" />
                  Loading...
                </div>
              ) : categories.length ? (
                categories.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id.toString()}>
                    {cat.name}
                  </SelectItem>
                ))
              ) : (
                <SelectItem value="" disabled>
                  No categories available
                </SelectItem>
              )}
            </SelectContent>
          </Select>
        </div>

        <ProductChoices
          key={componentKey}
          onChoicesUpdate={setProductChoices}
        />

        <Button
          type="submit"
          className="absolute bottom-3 bg-indigo-500 hover:bg-indigo-600"
          disabled={submitting}
        >
          {submitting ? (
            <>
              <Loader2 className="size-4 animate-spin mr-2" />
              Creating...
            </>
          ) : (
            "Create Product"
          )}
        </Button>
      </form>
    </div>
  );
}
