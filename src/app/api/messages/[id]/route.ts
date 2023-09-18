import dbConnect from '@/lib/dbConnect';
import Message, { MessageDocument } from '@/models/Message';
import { NextResponse } from 'next/server';

export async function GET(_request: Request, { params }: { params: { id: string } }) {
  const { id } = params;

  try {
    await dbConnect();
    const message = await Message.findById<MessageDocument>(id);

    return NextResponse.json({ message }, { status: 200 });
  } catch (err) {
    console.log(err);
    return NextResponse.json({ err }, { status: 400 });
  }
}
