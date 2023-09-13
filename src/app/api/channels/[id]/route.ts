import Channel from '@/models/Channel';
import dbConnect from '@/utils/dbConnect';
import { NextResponse } from 'next/server';

export async function GET(_request: Request, { params }: { params: { id: string } }) {
  const { id } = params;

  await dbConnect();
  const channel = await Channel.findById(id);

  return NextResponse.json({ channel }, { status: 200 });
}
