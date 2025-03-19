import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import {connectDB} from '@/lib/db/connect';
import Post from '@/lib/db/models/Post';
import User from '@/lib/db/models/User';
import { authOptions } from '../../../auth/options';

interface Params {
  params: { id: string };
}

// Add comment
export async function POST(request: Request, { params }: Params) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { text } = await request.json();

    if (!text) {
      return NextResponse.json({ error: 'Comment text is required' }, { status: 400 });
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

    const newComment = {
      user: user._id,
      text
    };

    post.comments.push(newComment);

    await post.save();

    // Return the populated comments
    const updatedPost = await Post.findById(params.id).populate('comments.user', 'name image');

    return NextResponse.json(updatedPost.comments);
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}

// Delete comment
export async function DELETE(request: Request, { params }: Params) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const commentId = searchParams.get('commentId');

    if (!commentId) {
      return NextResponse.json({ error: 'Comment ID is required' }, { status: 400 });
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

    // Find the comment
    const comment = post.comments.find((comment: any) => comment._id.toString() === commentId);

    if (!comment) {
      return NextResponse.json({ error: 'Comment not found' }, { status: 404 });
    }

    // Check if user is the comment owner
    if (comment.user.toString() !== user._id.toString()) {
      return NextResponse.json({ error: 'Not authorized' }, { status: 403 });
    }

    // Remove comment
    post.comments = post.comments.filter((comment: any) => comment._id.toString() !== commentId);

    await post.save();

    return NextResponse.json({ message: 'Comment removed' });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
