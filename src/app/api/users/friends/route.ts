import dbConnect from '@/lib/dbConnect';
import User, { UserDocument } from '@/models/User';
import { getToken } from 'next-auth/jwt';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const token = await getToken({ req: request });
  if (!token) return new NextResponse('No active session/token to create a new channel', { status: 404 });

  try {
    await dbConnect();
    const user = await User.findById<UserDocument>(token?.id).populate('friends').sort();

    const friends = user?.friends?.sort((a, b) => a.username.localeCompare(b.username));

    return NextResponse.json({ friends: friends }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ err }, { status: 400 });
  }
}
