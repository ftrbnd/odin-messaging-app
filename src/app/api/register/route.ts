import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import dbConnect from '@/utils/dbConnect';
import User from '@/models/User';

export async function POST(req: Request) {
  try {
    const { email, username, password, avatar, authMethod } = await req.json();
    let hashedPassword;
    if (password) hashedPassword = await bcrypt.hash(password, 10);

    await dbConnect();

    const user = password ? await User.create({ email, username, password: hashedPassword, authMethod }) : await User.create({ email, username, avatar, authMethod });

    return NextResponse.json({ message: 'User registered!', user }, { status: 201 });
  } catch (err) {
    console.log('Registering error: ', err);

    return NextResponse.json({ message: 'An error occurred while registering the user.' }, { status: 500 });
  }
}
