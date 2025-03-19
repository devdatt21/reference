import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import {connectDB} from '@/lib/db/connect';
import Post from '@/lib/db/models/Post';
import User from '@/lib/db/models/User';
import { authOptions } from '../auth/options';

export async function GET() {
  try {
    await connectDB();
    const posts = await Post.find()
      .populate('user', 'name image')
      .populate('comments.user', 'name image')
      .sort({ createdAt: -1 });

    return NextResponse.json(posts);
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { title, content, dealType } = await request.json();

    if (!title || !content || !dealType) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    await connectDB();
    const user = await User.findOne({ email: session.user.email });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const newPost = await Post.create({
      user: user._id,
      title,
      content,
      dealType,
    });

    return NextResponse.json(newPost, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
