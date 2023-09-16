import dbConnect from '@/lib/dbConnect';
import Channel, { ChannelDocument } from '@/models/Channel';
import mongoose from 'mongoose';
import { getToken } from 'next-auth/jwt';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const token = await getToken({ req: request });
  if (!token) return new NextResponse('No active session/token to get user channels', { status: 404 });

  try {
    await dbConnect();

    const userObjectId = new mongoose.Types.ObjectId(token.id);

    const channels = await Channel.find<ChannelDocument[]>({
      users: userObjectId
    })
      .populate('users')
      .sort({ updatedAt: -1 });

    return NextResponse.json({ channels }, { status: 200 });
  } catch (err) {
    console.log(err);
    return NextResponse.json({ err }, { status: 400 });
  }
}
