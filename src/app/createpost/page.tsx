"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import axios from "axios";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import { XCircle } from "lucide-react";

// Schema validation for form
const postSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  content: z.string().min(10, "Content must be at least 10 characters"),
  dealType: z.enum(["fair", "unfair"]),
  images: z.array(z.string()).optional(),
});

type PostFormData = z.infer<typeof postSchema>;

export default function PostCreatePage() {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
    reset
  } = useForm<PostFormData>({ resolver: zodResolver(postSchema) });

  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [submitStatus, setSubmitStatus] = useState<{
    type: "success" | "error" | null;
    message: string;
  }>({ type: null, message: "" });

  // Handle image upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === "string") {
          setImagePreviews((prev) => [...prev, reader.result as string]);
          setValue("images", [...(watch("images") || []), reader.result as string]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  // Remove image from preview
  const removeImage = (index: number) => {
    setImagePreviews((prev) => {
      const newPreviews = [...prev];
      newPreviews.splice(index, 1);
      return newPreviews;
    });
    
    const currentImages = watch("images") || [];
    const newImages = [...currentImages];
    newImages.splice(index, 1);
    setValue("images", newImages);
  };

  // Submit form data
  const onSubmit = async (data: PostFormData) => {
    try {
      await axios.post("/api/posts", data);
      setSubmitStatus({
        type: "success",
        message: "Post created successfully!"
      });
      reset();
      setImagePreviews([]);
    } catch (error) {
      console.error("Error creating post", error);
      setSubmitStatus({
        type: "error",
        message: "Failed to create post. Please try again."
      });
    }
  };

  return (

    <div className="min-h-screen bg-gray-50 mb-15">
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-blue-800 p-6">
            <h1 className="text-2xl md:text-3xl font-bold text-white">Create New Post</h1>
            <p className="text-blue-100 mt-2">Share your deal with the community</p>
          </div>

          {submitStatus.type && (
            <div className={`p-4 ${submitStatus.type === "success" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
              {submitStatus.message}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="p-6">
            <div className="space-y-6">
              {/* Title Field */}
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                  Title <span className="text-red-500">*</span>
                </label>
                <input
                  id="title"
                  {...register("title")}
                  className="text-black w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="What's this deal about?"
                />
                {errors.title && (
                  <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
                )}
              </div>

              {/* Content Field */}
              <div>
                <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">
                  Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="content"
                  rows={5}
                  {...register("content")}
                  className="text-black w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Provide details about the deal..."
                />
                {errors.content && (
                  <p className="mt-1 text-sm text-red-600">{errors.content.message}</p>
                )}
              </div>

              {/* Deal Type Field */}
              <div>
                <label htmlFor="dealType" className="block text-sm font-medium text-gray-700 mb-1">
                  Deal Rating <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-2 gap-4 mt-2">
                  <label className="flex items-center p-3 border rounded-md cursor-pointer hover:bg-blue-50 transition-colors">
                    <input
                      type="radio"
                      value="fair"
                      {...register("dealType")}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-gray-700">Fair Deal</span>
                  </label>
                  <label className="flex items-center p-3 border rounded-md cursor-pointer hover:bg-blue-50 transition-colors">
                    <input
                      type="radio"
                      value="unfair"
                      {...register("dealType")}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-gray-700">Unfair Deal</span>
                  </label>
                </div>
                {errors.dealType && (
                  <p className="mt-1 text-sm text-red-600">{errors.dealType.message}</p>
                )}
              </div>

              {/* Images Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Images</label>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                  <div className="space-y-1 text-center">
                    <svg
                      className="mx-auto h-12 w-12 text-gray-400"
                      stroke="currentColor"
                      fill="none"
                      viewBox="0 0 48 48"
                      aria-hidden="true"
                    >
                      <path
                        d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                        strokeWidth={2}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <div className="flex text-sm text-gray-600">
                      <label
                        htmlFor="file-upload"
                        className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500"
                      >
                        <span>Upload images</span>
                        <input
                          id="file-upload"
                          type="file"
                          accept="image/*"
                          multiple
                          onChange={handleImageUpload}
                          className="sr-only"
                        />
                      </label>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                  </div>
                </div>

                {/* Image Previews */}
                {imagePreviews.length > 0 && (
                  <div className="mt-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Image Previews</h4>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                      {imagePreviews.map((src, index) => (
                        <div key={index} className="relative group">
                          <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-lg bg-gray-200">
                            <Image
                              src={src}
                              alt={`Preview ${index + 1}`}
                              width={200}
                              height={200}
                              className="object-cover w-full h-full"
                            />
                          </div>
                          <button
                            type="button"
                            onClick={() => removeImage(index)}
                            className="absolute -top-2 -right-2 bg-red-100 rounded-full p-1 text-red-500 hover:text-red-700 focus:outline-none"
                          >
                            <XCircle size={20} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <div className="pt-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isSubmitting ? "Creating Post..." : "Create Post"}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}