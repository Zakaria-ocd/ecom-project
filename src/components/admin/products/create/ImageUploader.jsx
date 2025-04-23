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

export default function ImageUploader() {
  const [categories, setCategories] = useState([]);
  const [selectedImages, setSelectedImages] = useState([]);
  const [previewImages, setPreviewImages] = useState([]);
  const [productData, setProductData] = useState({
    name: "",
    description: "",
    price: 0,
    category_id: "",
    seller_id: 2,
  });

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

  const handleFileChange = (event) => {
    const files = Array.from(event.target.files);
    setSelectedImages((prev) => [...prev, ...files]);
    const previews = files.map((file) => URL.createObjectURL(file));
    setPreviewImages((prev) => [...prev, ...previews]);
  };

  const removeImage = (index) => {
    setSelectedImages((prev) => prev.filter((_, i) => i !== index));
    setPreviewImages((prev) => prev.filter((_, i) => i !== index));
  };

  async function createProduct(data) {
    console.log(data);
    const res = await fetch("http://localhost:8000/api/createProduct", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!res.ok) throw new Error("Failed to create product");

    const { product } = await res.json();
    return product.id;
  }

  async function uploadImages(productId, files) {
    const formData = new FormData();
    files.forEach((file) => formData.append("images[]", file));
    formData.append("product_id", productId);

    const res = await fetch("http://localhost:8000/api/uploadImages", {
      method: "POST",
      body: formData,
    });

    if (!res.ok) throw new Error("Failed to upload images");

    const data = await res.json();
    return data.images;
  }

  async function createProductWithImages(data, files) {
    try {
      const productId = await createProduct(data);
      await uploadImages(productId, files);
      alert("Product created successfully!");

      setSelectedImages([]);
      setPreviewImages([]);
      setProductData({
        name: "",
        description: "",
        price: 0,
        category_id: "",
        seller_id: 1,
      });
    } catch (err) {
      console.error(err);
      alert("Something went wrong!");
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    const { name, description, price, category_id } = productData;

    if (!name || !description || !price || !category_id) {
      alert("Fill all fields please!");
      return;
    }

    if (selectedImages.length === 0) {
      alert("Please select at least one image.");
      return;
    }

    createProductWithImages(productData, selectedImages);
  };

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
                accept="image/*"
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
              Upload Images <FaUpload />
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
            Price:
          </label>
          <input
            type="number"
            min={0}
            value={productData.price}
            onChange={(e) => {
              const value = e.target.value;
              Number(value) >= 0 &&
                setProductData({
                  ...productData,
                  price: parseFloat(value),
                });
            }}
            className="w-full rounded-lg border border-gray-300 p-2.5 text-sm text-gray-900"
            required
          />
        </div>
        <div className="w-full">
          <label className="block mb-1 text-sm font-medium text-gray-900">
            Category:
          </label>
          <Select
            value={productData.category_id?.toString()}
            onValueChange={(value) =>
              setProductData({ ...productData, category_id: parseInt(value) })
            }
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

        <Button
          onClick={handleSubmit}
          className="absolute bottom-3 bg-indigo-600 hover:bg-indigo-700"
        >
          Create Product
        </Button>
      </div>
    </div>
  );
}
