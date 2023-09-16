import dbConnect from '@/lib/dbConnect';
import Channel, { ChannelDocument } from '@/models/Channel';
import Message from '@/models/Message';
import { getToken } from 'next-auth/jwt';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const token = await getToken({ req: request });
  if (!token) return new NextResponse('No active session/token to create a new Message', { status: 404 });

  const { text, channelId }: { text: string; channelId: string } = await request.json();

  await dbConnect();

  const message = new Message({
    text,
    author: token.id
  });
  await message.save();

  let channel = await Channel.findById(channelId).populate(['users', { path: 'messages', populate: { path: 'author' } }]);

  channel.messages.push(message);
  await channel.save();

  const updatedChannel = await Channel.findById(channelId).populate(['users', { path: 'messages', populate: { path: 'author' } }]);

  return NextResponse.json({ message, channel: updatedChannel }, { status: 200 });
}
