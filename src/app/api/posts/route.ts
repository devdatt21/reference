import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db/connect";
import Post from "@/lib/db/models/Post";
import { authOptions } from "@/app/api/auth/options";
import { getServerSession } from "next-auth";

export async function POST(req: Request) {
  try {
    await connectDB();
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    const { title, content, dealType, images } = await req.json();
    
    if (!title || !content || !dealType) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }
    
    const newPost = await Post.create({
      user: session.user.id,
      title,
      content,
      dealType,
      images,
    });
    
    return NextResponse.json(newPost, { status: 201 });
  } catch (error) {
    console.error("Error creating post:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function GET() {
    try {
      await connectDB();
      const posts = await Post.find().sort({ createdAt: -1 }).limit(10); // Fetch latest 10 posts
      return NextResponse.json(posts, { status: 200 });
    } catch (error) {
      console.error("Error fetching posts:", error);
      return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}