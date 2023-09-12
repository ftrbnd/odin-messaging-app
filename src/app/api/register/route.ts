import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import dbConnect from '@/utils/dbConnect';
import User from '@/models/User';

export async function POST(req: Request) {
  try {
    const { email, username, password } = await req.json();
    const hashedPassword = await bcrypt.hash(password, 10);

    await dbConnect();
    const user = await User.create({ email, username, password: hashedPassword });

    return NextResponse.json({ message: 'User registered!', user }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ message: 'An error occurred while registering the user.' }, { status: 500 });
  }
}
