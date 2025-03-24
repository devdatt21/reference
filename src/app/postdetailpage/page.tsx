// "use client";

// import { useState, useRef, useEffect } from "react";
// import { useSession } from "next-auth/react";
// import { useRouter } from "next/navigation"; // For App Router
// import Image from "next/image";
// import Navbar from "@/components/Navbar";
// import {
//   FaTimes,
//   FaChevronLeft,
//   FaChevronRight,
// } from "react-icons/fa";

// // ✅ Type Definitions
// interface User {
//   id: string;
//   name: string;
//   image: string;
// }

// interface Reply {
//   _id: string;
//   text: string;
//   createdAt: string;
//   user: User;
// }

// interface Comment {
//   _id: string;
//   text: string;
//   createdAt: string;
//   user: User;
//   likes: string[];
//   replies?: Reply[];
// }

// interface Post {
//   _id: string;
//   title: string;
//   content: string;
//   images: string[];
//   createdAt: string;
//   user: User;
//   dealType: string;
//   likes: string[];
//   comments: Comment[];
// }

// // ✅ Props Type for `ProductDetailPage`
// interface ProductDetailPageProps {
//   params: { id: string };
// }

// export default function ProductDetailPage({ params }: ProductDetailPageProps) {
//   const { data: session } = useSession();
//   const router = useRouter();
//   const [post, setPost] = useState<Post | null>(null);
//   const [loading, setLoading] = useState<boolean>(false);
//   const [error, setError] = useState<string | null>(null);
//   const [comment, setComment] = useState<string>("");
//   const [fullscreenImage, setFullscreenImage] = useState<string | null>(null);
//   const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);
//   const [isLiked, setIsLiked] = useState<boolean>(false);
//   const commentInputRef = useRef<HTMLTextAreaElement | null>(null);

//   // ✅ Fetch post data on component mount
//   useEffect(() => {
//     const fetchPost = async () => {
//       try {
//         const response = await fetch(`/api/posts/${params.id}`);

//         if (!response.ok) {
//           throw new Error("Failed to fetch post");
//         }

//         const data: Post = await response.json();
//         setPost(data);

//         // Check if the current user has liked the post
//         if (session?.user && data.likes.includes(session.user.id)) {
//           setIsLiked(true);
//         }
        
//       } catch (err) {
//         setError((err as Error).message);
//       } finally {
//         setLoading(false);
//       }
//     };

//     if (params?.id) {
//       fetchPost();
//     }
//   }, [params?.id, session]);

//   // ✅ Handle Like Toggle
//   const handleLikeToggle = async () => {
//     if (!session) return;

//     try {
//       const response = await fetch(`/api/posts/${params.id}/like`, {
//         method: "PUT",
//         headers: { "Content-Type": "application/json" },
//       });

//       if (!response.ok) throw new Error("Failed to update like status");

//       const updatedPost: Post = await response.json();
//       setPost(updatedPost);
//       setIsLiked(!isLiked);
//     } catch (err) {
//       console.error("Error toggling like:", err);
//     }
//   };

//   // ✅ Handle Comment Submission
//   const handleCommentSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault();
//     if (!comment.trim() || !session) return;

//     try {
//       const response = await fetch(`/api/posts/${params.id}/comment`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ text: comment }),
//       });

//       if (!response.ok) throw new Error("Failed to add comment");

//       const updatedPost: Post = await response.json();
//       setPost(updatedPost);
//       setComment("");
//     } catch (err) {
//       console.error("Error adding comment:", err);
//     }
//   };

//   // ✅ Handle Reply
//   const handleReply = (commentId: string) => {
//     if (!session) return;
//     if (commentInputRef.current) {
//       commentInputRef.current.focus();
//       const commentAuthor =
//         post?.comments.find((c) => c._id === commentId)?.user?.name || "user";
//       setComment(`@${commentAuthor} `);
//     }
//   };

//   // ✅ Open Fullscreen Image Viewer
//   const openFullscreen = (index: number) => {
//     setCurrentImageIndex(index);
//     setFullscreenImage(post?.images[index] || null);
//     document.body.style.overflow = "hidden";
//   };

//   // ✅ Close Fullscreen Image Viewer
//   const closeFullscreen = () => {
//     setFullscreenImage(null);
//     document.body.style.overflow = "auto";
//   };

//   // ✅ Navigate Images
//   const navigateImage = (direction: number) => {
//     if (!post?.images?.length) return;

//     let newIndex = currentImageIndex + direction;
//     if (newIndex < 0) newIndex = post.images.length - 1;
//     if (newIndex >= post.images.length) newIndex = 0;

//     setCurrentImageIndex(newIndex);
//     setFullscreenImage(post.images[newIndex]);
//   };

//   // ✅ Loading State
//   if (loading) {
//     return (
//       <main className="flex min-h-screen flex-col">
//         <Navbar />
//         <div className="flex justify-center items-center h-64">
//           <p className="text-gray-500">Loading...</p>
//         </div>
//       </main>
//     );
//   }

//   // ✅ Error Handling
//   if (error || !post) {
//     return (
//       <main className="flex min-h-screen flex-col">
//         <Navbar />
//         <div className="flex justify-center items-center h-64">
//           <p className="text-red-500">Error: {error || "Post not found"}</p>
//         </div>
//       </main>
//     );
//   }

//   return (
//     <main className="flex min-h-screen flex-col">
//       <Navbar />

//       {/* Fullscreen Image Viewer */}
//       {fullscreenImage && (
//         <div className="fixed inset-0 bg-black z-50 flex flex-col">
//           <div className="p-4 flex justify-between items-center text-white">
//             <span className="text-sm">
//               {currentImageIndex + 1} / {post?.images.length}
//             </span>
//             <button onClick={closeFullscreen} className="text-white p-2">
//               <FaTimes size={24} />
//             </button>
//           </div>

//           <div className="flex-1 flex items-center justify-center relative">
//             <Image
//               src={fullscreenImage}
//               alt={`${post.title} - image ${currentImageIndex + 1}`}
//               fill
//               className="object-contain"
//             />
//             <button onClick={() => navigateImage(-1)} className="absolute left-2 bg-black/50 text-white p-2 rounded-full">
//               <FaChevronLeft size={20} />
//             </button>
//             <button onClick={() => navigateImage(1)} className="absolute right-2 bg-black/50 text-white p-2 rounded-full">
//               <FaChevronRight size={20} />
//             </button>
//           </div>
//         </div>
//       )}

//       {/* Post Content Goes Here (Same as before) */}
//     </main>
//   );
// }
