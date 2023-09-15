import dbConnect from '@/lib/dbConnect';
import Channel, { ChannelDocument } from '@/models/Channel';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  let channels;

  const userId = request.nextUrl.searchParams.get('userId');

  dbConnect();
  if (userId) {
    console.log(`looking for channels with ${userId}`);

    channels = await Channel.find<ChannelDocument>({});
    // channels = await prisma.channel.findRaw({
    //   filter: {
    //     userIds: { $elemMatch: { $eq: { $oid: userId } } }
    //   }
    // });

    console.log('found channels: ', channels);
  } else {
    channels = await Channel.find<ChannelDocument>({});
  }

  console.log('channels: ', channels);

  return NextResponse.json({ channels }, { status: 200 });
}
