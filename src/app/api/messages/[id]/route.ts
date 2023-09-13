import Message from '@/models/Message';
import dbConnect from '@/utils/dbConnect';
import { NextResponse } from 'next/server';

export async function GET(_request: Request, { params }: { params: { id: string } }) {
  const { id } = params;

  await dbConnect();
  const message = await Message.findById(id);

  return NextResponse.json({ message }, { status: 200 });
}
