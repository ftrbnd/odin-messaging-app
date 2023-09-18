import dbConnect from '@/lib/dbConnect';
import Message, { MessageDocument } from '@/models/Message';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    await dbConnect();
    const messages = await Message.find<MessageDocument>({});

    return NextResponse.json({ messages }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ err }, { status: 400 });
  }
}
