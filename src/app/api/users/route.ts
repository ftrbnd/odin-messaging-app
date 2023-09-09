import User from '@/models/User';
import dbConnect from '@/utils/dbConnect';
import { NextResponse } from 'next/server';

export async function GET() {
  await dbConnect();
  const users = await User.find();

  return NextResponse.json({ users }, { status: 200 });
}
