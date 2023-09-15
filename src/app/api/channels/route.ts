import dbConnect from '@/lib/dbConnect';
import Channel, { ChannelDocument } from '@/models/Channel';
import mongoose from 'mongoose';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const userId = request.nextUrl.searchParams.get('userId');

  try {
    await dbConnect();

    let channels;
    if (userId) {
      const userObjectId = new mongoose.Types.ObjectId(userId);

      channels = await Channel.find({
        users: userObjectId
      }).populate('users');
    } else {
      channels = await Channel.find<ChannelDocument>({});
    }

    return NextResponse.json({ channels }, { status: 200 });
  } catch (err) {
    console.log(err);
    return NextResponse.json({ err }, { status: 400 });
  }
}
