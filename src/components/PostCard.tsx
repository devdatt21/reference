"use client";

import { useState } from "react";
import Image from "next/image";
import { 
  ThumbsUp, 
  ThumbsDown, 
  MessageCircle, 
  Share2, 
  Bookmark, 
  X, 
  ExternalLink 
} from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { useRouter } from "next/navigation";
import { format } from "date-fns";

interface PostProps {
  post: {
    _id: string;
    title: string;
    content: string;
    images: string[];
    likes: number;
    comments: number;
    dealType: "fair" | "unfair";
    createdAt: string;
  };
}

export default function PostCard({ post }: PostProps) {
  const [liked, setLiked] = useState(false);
  const [disliked, setDisliked] = useState(false);
  const [saved, setSaved] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const router = useRouter();

  const handleLike = () => {
    setLiked(!liked);
    if (disliked) setDisliked(false);
  };

  const handleDislike = () => {
    setDisliked(!disliked);
    if (liked) setLiked(false);
  };

  const handleImageClick = (image: string) => {
    setSelectedImage(image);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      {/* Image Slider */}
      {post.images.length > 0 && (
        <Swiper spaceBetween={10} slidesPerView={1}>
          {post.images.map((img, index) => (
            <SwiperSlide key={index}>
              <div 
                className="relative w-full h-64 cursor-pointer"
                onClick={() => handleImageClick(img)}
              >
                <Image 
                  src={img} 
                  alt={`Post Image ${index + 1}`} 
                  fill 
                  priority
                  className="object-cover"
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      )}

      {/* Post Content */}
      <div className="p-4">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-lg font-bold text-gray-800 flex items-center">
            {post.title}
            <span 
              className={`ml-2 px-2 py-1 rounded-full text-xs ${
                post.dealType === "fair" 
                  ? "bg-green-100 text-green-800" 
                  : "bg-red-100 text-red-800"
              }`}
            >
              {post.dealType === "fair" ? "Fair Deal" : "Unfair Deal"}
            </span>
          </h2>
          <span className="text-sm text-gray-500">
            {format(new Date(post.createdAt), "MMM d, yyyy")}
          </span>
        </div>

        <p className="text-gray-600 text-sm mb-4 line-clamp-3">
          {post.content}
        </p>

        {/* Action Buttons */}
        <div className="flex justify-between items-center border-t pt-3">
          <div className="flex space-x-4">
            <button 
              onClick={handleLike} 
              className={`flex items-center space-x-1 ${
                liked ? "text-blue-600" : "text-gray-500 hover:text-blue-600"
              }`}
            >
              <ThumbsUp size={18} />
              <span className="text-sm">{post.likes}</span>
            </button>

            <button 
              onClick={handleDislike} 
              className={`flex items-center space-x-1 ${
                disliked ? "text-red-600" : "text-gray-500 hover:text-red-600"
              }`}
            >
              <ThumbsDown size={18} />
            </button>

            <button 
              onClick={() => router.push(`/post/${post._id}`)}
              className="flex items-center space-x-1 text-gray-500 hover:text-gray-700"
            >
              <MessageCircle size={18} />
              <span className="text-sm">{post.comments}</span>
            </button>
          </div>

          <div className="flex space-x-4">
            <button 
              onClick={() => setSaved(!saved)}
              className={`${saved ? "text-yellow-500" : "text-gray-500 hover:text-yellow-600"}`}
            >
              <Bookmark size={18} />
            </button>

            <button className="text-gray-500 hover:text-gray-700">
              <Share2 size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Fullscreen Image Modal */}
      {selectedImage && (
        <div 
          className="fixed inset-0 bg-black/80 z-50 flex justify-center items-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-w-4xl max-h-[90vh] w-full">
            <button 
              onClick={() => setSelectedImage(null)}
              className="absolute -top-10 right-0 text-white hover:text-gray-300"
            >
              <X size={24} />
            </button>
            <Image 
              src={selectedImage} 
              alt="Fullscreen" 
              layout="responsive"
              width={800} 
              height={600} 
              className="rounded-lg" 
            />
          </div>
        </div>
      )}
    </div>
  );
}