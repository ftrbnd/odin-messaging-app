import dbConnect from '@/lib/dbConnect';
import User, { UserDocument } from '@/models/User';
import { NextResponse } from 'next/server';

export async function GET() {
  dbConnect();
  const users = await User.find<UserDocument>({});

  return NextResponse.json({ users }, { status: 200 });
}
