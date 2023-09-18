import dbConnect from '@/lib/dbConnect';
import Channel, { ChannelDocument } from '@/models/Channel';
import mongoose from 'mongoose';
import { getToken } from 'next-auth/jwt';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const token = await getToken({ req: request });
  if (!token) return new NextResponse('No active session/token to create a new channel', { status: 404 });

  const friendId = request.nextUrl.searchParams.get('friendId');

  try {
    await dbConnect();

    if (friendId) {
      // find dm channel with friend that was clicked on
      const channel = await Channel.findOne<ChannelDocument[]>({
        users: { $all: [friendId, token?.id] }
      })
        .populate([
          {
            path: 'users',
            populate: {
              path: 'friends'
            }
          },
          { path: 'messages', populate: { path: 'author' } }
        ])
        .sort({ updatedAt: -1 });

      return NextResponse.json({ channel }, { status: 200 });
    } else {
      // find all channels that session user is in
      const userObjectId = new mongoose.Types.ObjectId(token?.id);

      const channels = await Channel.find<ChannelDocument[]>({
        users: userObjectId
      })
        .populate([
          {
            path: 'users',
            populate: {
              path: 'friends'
            }
          },
          { path: 'messages', populate: { path: 'author' } }
        ])
        .sort({ updatedAt: -1 });

      return NextResponse.json({ channels }, { status: 200 });
    }
  } catch (err) {
    console.log(err);
    return NextResponse.json({ err }, { status: 400 });
  }
}
