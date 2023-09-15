import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import User, { UserDocument } from '@/models/User';
import dbConnect from '@/lib/dbConnect';

export async function POST(req: Request) {
  const body = await req.json();
  const { email, username, password } = body.data;

  if (!email || !username || !password) {
    return new NextResponse('Missing email, username, or password', { status: 400 });
  }

  await dbConnect();
  const userExists = await User.findOne<UserDocument>({ email: email });

  if (userExists) {
    return new NextResponse('User already exists', { status: 400 });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = new User({
    email,
    username,
    password: hashedPassword
  });
  await user.save();

  return NextResponse.json(user);
}