import User from '@/models/User';
import dbConnect from '@/utils/dbConnect';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    await dbConnect();

    const { email } = await req.json();
    const user = await User.findOne({ email }).select('_id');

    return NextResponse.json({ user });
  } catch (err) {
    console.log(err);
  }
}
