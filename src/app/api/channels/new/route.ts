import dbConnect from '@/lib/dbConnect';
import Channel from '@/models/Channel';
import { UserDocument } from '@/models/User';
import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const session = await getServerSession();
  if (!session?.user) return new NextResponse('No active session to create a new channel', { status: 404 });

  const { newUser }: { newUser: UserDocument } = await request.json();

  dbConnect();
  const channel = new Channel({
    name: 'DM Chat',
    channelType: 'DM',
    users: [session.user.id, newUser._id]
  });
  await channel.save();

  return NextResponse.json({ channel }, { status: 200 });
}
