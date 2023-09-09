import Message from '@/models/Message';
import dbConnect from '@/utils/dbConnect';
import { NextResponse } from 'next/server';

export async function GET() {
  await dbConnect();
  const messages = await Message.find();

  return NextResponse.json({ messages }, { status: 200 });
}
