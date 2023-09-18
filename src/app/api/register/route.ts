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

  try {
    await dbConnect();

    const [emailExists, usernameExists] = await Promise.all([User.findOne<UserDocument>({ email: email }), User.findOne<UserDocument>({ username: username })]);

    if (emailExists || usernameExists) {
      return new NextResponse('User already exists', { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
      email,
      username,
      password: hashedPassword
    });
    await user.save();

    return NextResponse.json(user, { status: 200 });
  } catch (err) {
    console.log(err);
    return NextResponse.json({ err }, { status: 400 });
  }
}
