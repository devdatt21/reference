"use client";

import { useEffect, useState } from "react";
import PostCard from "@/components/PostCard";
import { Loader2 } from "lucide-react";

interface Post {
  _id: string;
  title: string;
  content: string;
  images: string[];
  likes: number;
  comments: number;
  dealType: "fair" | "unfair";
  createdAt: string;
}

export default function HomePage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "fair" | "unfair">("all");

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch("/api/posts");
        if (!response.ok) {
          throw new Error("Failed to fetch posts");
        }
        const data = await response.json();
        setPosts(data);
      } catch (error) {
        console.error("Error fetching posts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  const filteredPosts = filter === "all" 
    ? posts 
    : posts.filter(post => post.dealType === filter);

  return (
    <div className="min-h-screen bg-gray-50 pt-15">
      <div className="max-w-screen-xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Community Deals</h1>
          
          <div className="flex space-x-2">
            <button 
              onClick={() => setFilter("all")}
              className={`px-3 py-1 rounded-full text-sm transition-colors ${
                filter === "all" 
                  ? "bg-blue-600 text-white" 
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              All
            </button>
            <button 
              onClick={() => setFilter("fair")}
              className={`px-3 py-1 rounded-full text-sm transition-colors ${
                filter === "fair" 
                  ? "bg-green-600 text-white" 
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              Fair Deals
            </button>
            <button 
              onClick={() => setFilter("unfair")}
              className={`px-3 py-1 rounded-full text-sm transition-colors ${
                filter === "unfair" 
                  ? "bg-red-600 text-white" 
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              Unfair Deals
            </button>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="animate-spin text-blue-600" size={48} />
          </div>
        ) : filteredPosts.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow-md">
            <p className="text-gray-500 text-xl">
              {filter === "all" 
                ? "No posts available yet." 
                : `No ${filter} deals found.`}
            </p>
            <p className="text-gray-400 mt-2">Be the first to share a deal!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredPosts.map((post) => (
              <PostCard key={post._id} post={post} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}