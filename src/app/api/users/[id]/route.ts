import dbConnect from '@/lib/dbConnect';
import User, { UserDocument } from '@/models/User';
import { NextResponse } from 'next/server';

export async function GET(_request: Request, { params }: { params: { id: string } }) {
  const { id } = params;

  await dbConnect();
  const user = await User.findById<UserDocument>(id);

  return NextResponse.json({ user }, { status: 200 });
}
