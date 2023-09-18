import dbConnect from '@/lib/dbConnect';
import Channel, { ChannelDocument } from '@/models/Channel';
import { UserDocument } from '@/models/User';
import mongoose from 'mongoose';
import { getToken } from 'next-auth/jwt';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const token = await getToken({ req: request });
  if (!token) return new NextResponse('No active session/token to create a new channel', { status: 404 });

  const { newUser }: { newUser: UserDocument } = await request.json();

  try {
    await dbConnect();

    // check if dm channel exists already
    const channelExists = await Channel.findOne<ChannelDocument>({
      users: { $all: [newUser._id, token?.id] }
    }).populate([
      {
        path: 'users',
        populate: {
          path: 'friends'
        }
      },
      { path: 'messages', populate: { path: 'author' } }
    ]);
    if (channelExists) return NextResponse.json({ channel: channelExists }, { status: 200 });

    // otherwise create a new dm channel
    let channel = await Channel.create<ChannelDocument>({
      channelType: 'DM',
      users: [new mongoose.Types.ObjectId(token?.id), newUser._id]
    });

    channel = await channel.populate([
      {
        path: 'users',
        populate: {
          path: 'friends'
        }
      },
      { path: 'messages', populate: { path: 'author' } }
    ]);

    return NextResponse.json({ channel }, { status: 200 });
  } catch (err) {
    console.log(err);
    return NextResponse.json({ err }, { status: 400 });
  }
}
