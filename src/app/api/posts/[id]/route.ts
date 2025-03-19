import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import {connectDB} from '@/lib/db/connect';
import Post from '@/lib/db/models/Post';
import User from '@/lib/db/models/User';
import { authOptions } from '../../auth/options';

interface Params {
  params: { id: string };
}

export async function GET(request: Request, { params }: Params) {
  try {
    await connectDB();
    const post = await Post.findById(params.id)
      .populate('user', 'name image')
      .populate('comments.user', 'name image');

    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    return NextResponse.json(post);
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: Params) {
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

    if (!user || post.user.toString() !== user._id.toString()) {
      return NextResponse.json({ error: 'Not authorized' }, { status: 403 });
    }

    const { title, content, dealType } = await request.json();
    
    post.title = title || post.title;
    post.content = content || post.content;
    post.dealType = dealType || post.dealType;

    await post.save();

    return NextResponse.json(post);
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: Params) {
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

    if (!user || post.user.toString() !== user._id.toString()) {
      return NextResponse.json({ error: 'Not authorized' }, { status: 403 });
    }

    await post.deleteOne();

    return NextResponse.json({ message: 'Post removed' });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
