"use client";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Image from "next/image";
import { useEffect, useState } from "react";
import { FaUpload, FaXmark } from "react-icons/fa6";
import { IoIosCloudUpload } from "react-icons/io";
import ProductOptions from "./ProductOptions";
import { toast } from "sonner";

export default function ImageUploader() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [categories, setCategories] = useState([]);
  const [selectedImages, setSelectedImages] = useState([]);
  const [previewImages, setPreviewImages] = useState([]);
  const [productData, setProductData] = useState({
    name: "",
    description: "",
    price: 0,
    quantity: 1,
    category_id: "",
    seller_id: 2,
  });
  const [productOptions, setProductOptions] = useState({
    hasOptions: false,
    options: [],
  });
  const [productOptionsKey, setProductOptionsKey] = useState(0);

  function handleFileChange(event) {
    const MAX_FILE_SIZE_MB = 5;
    const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;
    const MAX_FILE_COUNT = 10;
    const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];

    const files = Array.from(event.target.files);

    const availableSlots = MAX_FILE_COUNT - selectedImages.length;
    const validFiles = files.slice(0, availableSlots);

    const filteredFiles = validFiles.filter((file) => {
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

    setSelectedImages((prev) => [...prev, ...filteredFiles]);
    setPreviewImages((prev) => [
      ...prev,
      ...filteredFiles.map((file) => URL.createObjectURL(file)),
    ]);
  }

  function removeImage(index) {
    setSelectedImages((prev) => prev.filter((_, i) => i !== index));
    setPreviewImages((prev) => prev.filter((_, i) => i !== index));
  }

  async function createProduct(data) {
    console.log(data);
    const res = await fetch("http://localhost:8000/api/products/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Failed to create product");
    return await res.json();
  }

  async function uploadImages(productId, files) {
    const formData = new FormData();
    files.forEach((file) => {
      formData.append("images[]", file);
    });
    formData.append("product_id", productId);
    const res = await fetch("http://localhost:8000/api/uploadImages", {
      method: "POST",
      body: formData,
      headers: {
        Accept: "application/json",
      },
    });
    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || "Image upload failed");
    }
    return await res.json();
  }

  async function createProductWithImages(files) {
    try {
      const requestData = productOptions.hasOptions
        ? {
            name: productData.name,
            description: productData.description,
            category_id: productData.category_id,
            seller_id: productData.seller_id,
            options: productOptions.options,
          }
        : { ...productData };
      const productId = await createProduct(requestData);
      console.log(productId);
      if (files.length > 0 && productId) {
        await uploadImages(productId, files);
      }
      toast.success("Product created successfully!");
      setSelectedImages([]);
      setPreviewImages([]);
      setProductData({
        name: "",
        description: "",
        price: 0,
        quantity: 1,
        category_id: "",
        seller_id: 2,
      });
      setProductOptions({
        hasOptions: false,
        options: [],
      });
      setProductOptionsKey((prev) => prev + 1);
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong!");
    } finally {
      setIsSubmitting(false);
    }
  }

  const handleOptionsUpdate = (optionsData) => {
    setProductOptions((prev) => ({
      ...prev,
      hasOptions: !optionsData.hasNoOptions,
      options: optionsData.selectedOptions.map((opt) => ({
        ...opt,
        values: opt.values.filter(
          (val) => val.option_value_id !== null && val.price > 0
        ),
      })),
    }));

    if (optionsData.hasNoOptions) {
      setProductData((prev) => ({
        ...prev,
        price: optionsData.hasNoOptionsInputs.price,
        quantity: optionsData.hasNoOptionsInputs.quantity,
      }));
    }
  };

  function handleSubmit() {
    if (isSubmitting) return;
    const { name, description, category_id, price, quantity } = productData;
    if (!name || !description || !category_id) {
      toast.warning("Fill all required fields!");
      return;
    }
    if (!productOptions.hasOptions && (price <= 0 || quantity <= 0)) {
      toast.warning("Price and quantity must be greater than zero");
      return;
    }
    if (selectedImages.length === 0) {
      toast.warning("Please select at least one image.");
      return;
    }
    if (selectedImages.length > 10) {
      toast.warning("Maximum 10 images allowed");
      return;
    }
    if (productOptions.hasOptions) {
      const hasInvalid = productOptions.options.some(
        (opt) =>
          !opt.option_id ||
          opt.values.length === 0 ||
          opt.values.some((v) => !v.option_value_id || v.price <= 0)
      );
      if (hasInvalid) {
        toast.warning("Please complete all option values with valid prices");
        return;
      }
    }
    setIsSubmitting(true);
    createProductWithImages(selectedImages);
  }

  useEffect(() => {
    async function fetchCategories() {
      try {
        const res = await fetch("http://localhost:8000/api/categories");
        const data = await res.json();
        setCategories(data);
      } catch (err) {
        console.error("Error fetching categories:", err);
      }
    }
    fetchCategories();
  }, []);

  return (
    <div className="flex flex-col gap-6 px-4 pt-8 pb-[60px]">
      <h1 className="text-3xl text-slate-800 font-semibold ml-3">
        Product Creation
      </h1>
      <div className="w-full flex flex-col items-center gap-y-4 px-4">
        <div className="w-full flex flex-col items-start gap-4 mb-8">
          <div className="border border-dashed border-slate-400/80 p-2.5">
            <div className="min-w-96 min-h-96 flex flex-col items-center justify-center gap-10">
              <div className="flex flex-wrap items-center gap-2">
                {previewImages.length ? (
                  previewImages.map((url, index) => (
                    <div key={index} className="relative">
                      <Image
                        src={url}
                        alt={`Preview ${index}`}
                        width={120}
                        height={120}
                        className="object-cover"
                      />
                      <button
                        onClick={() => removeImage(index)}
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
                      Upload images<div className="text-slate-500">or</div>
                      drop them here
                    </div>
                  </div>
                )}
              </div>
              <input
                id="file-upload"
                type="file"
                accept="image/jpeg, image/jpg, image/avif, image/png, image/webp"
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
              Upload Images ({selectedImages.length}/10, max 5MB each)
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
              setProductData({ ...productData, name: e.target.value })
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
              setProductData({ ...productData, description: e.target.value })
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
            onValueChange={(value) => {
              const numValue = parseInt(value, 10);
              if (!isNaN(numValue) && numValue !== productData.category_id) {
                setProductData((prev) => ({
                  ...prev,
                  category_id: numValue,
                }));
              }
            }}
          >
            <SelectTrigger className="w-full bg-white">
              <SelectValue placeholder="Select a category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((cat) => (
                <SelectItem key={cat.id} value={cat.id.toString()}>
                  {cat.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <ProductOptions
          key={productOptionsKey}
          onOptionsUpdate={handleOptionsUpdate}
          productData={productData}
          setProductData={setProductData}
        />
        <Button
          onClick={handleSubmit}
          className="absolute bottom-3 bg-indigo-500 hover:bg-indigo-600"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Creating..." : "Create Product"}
        </Button>
      </div>
    </div>
  );
}
