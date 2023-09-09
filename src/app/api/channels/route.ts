import Channel from '@/models/Channel';
import dbConnect from '@/utils/dbConnect';
import { NextResponse } from 'next/server';

export async function GET() {
  await dbConnect();
  const channels = await Channel.find();

  return NextResponse.json({ channels }, { status: 200 });
}
