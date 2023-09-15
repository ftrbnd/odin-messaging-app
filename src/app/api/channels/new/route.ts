import dbConnect from '@/lib/dbConnect';
import Channel from '@/models/Channel';
import { UserDocument } from '@/models/User';
import mongoose from 'mongoose';
import { getToken } from 'next-auth/jwt';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const token = await getToken({ req: request });
  if (!token) return new NextResponse('No active session/token to create a new channel', { status: 404 });

  const { newUser }: { newUser: UserDocument } = await request.json();

  dbConnect();
  const channel = new Channel({
    name: 'DM Chat',
    channelType: 'DM',
    users: [new mongoose.Types.ObjectId(token.id), newUser._id] // TODO: modify JWT type to have an id field
  });
  await channel.save();

  return NextResponse.json({ channel }, { status: 200 });
}
