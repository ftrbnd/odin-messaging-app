import dbConnect from '@/lib/dbConnect';
import Channel, { ChannelDocument } from '@/models/Channel';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const userId = request.nextUrl.searchParams.get('userId');

  await dbConnect();
  let channels;
  if (userId) {
    // TODO: filter channels by their users list that contain the current user's id
    channels = await Channel.find<ChannelDocument>({});
  } else {
    channels = await Channel.find<ChannelDocument>({});
  }

  return NextResponse.json({ channels }, { status: 200 });
}
