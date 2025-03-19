import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import {connectDB} from '@/lib/db/connect';
import Post from '@/lib/db/models/Post';
import User from '@/lib/db/models/User';
import { authOptions } from '../../../auth/options';

interface Params {
  params: { id: string };
}

export async function POST(request: Request, { params }: Params) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const post = await Post.findById(params.id);
    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const userIdStr = user._id.toString();
    
    if (post.likes.some((like: any) => like.toString() === userIdStr)) {
      post.likes = post.likes.filter((like: any) => like.toString() !== userIdStr);
    } else {
      post.likes.push(user._id);
    }

    await post.save();

    return NextResponse.json(post);
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
