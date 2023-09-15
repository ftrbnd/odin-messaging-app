import dbConnect from '@/lib/dbConnect';
import { ChannelDocument } from '@/models/Channel';
import User from '@/models/User';
import { NextResponse } from 'next/server';

export async function GET(_request: Request, { params }: { params: { id: string } }) {
  const { id } = params;

  await dbConnect();
  const channel = await User.findById<ChannelDocument>(id);

  return NextResponse.json({ channel }, { status: 200 });
}
