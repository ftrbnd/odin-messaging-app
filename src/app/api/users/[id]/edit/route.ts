import dbConnect from '@/lib/dbConnect';
import User, { UserDocument } from '@/models/User';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;
  if (!id) return new NextResponse('No id found to edit User profile', { status: 404 });

  const { newUsername, newEmail }: { newUsername: string; newEmail: string } = await request.json();

  try {
    await dbConnect();

    const [emailExists, usernameExists] = await Promise.all([User.findOne<UserDocument>({ email: newEmail }), User.findOne<UserDocument>({ username: newUsername })]);

    if (emailExists) {
      return new NextResponse('Email already exists', { status: 400 });
    } else if (usernameExists) {
      return new NextResponse('Username already exists', { status: 400 });
    }

    let user;
    if (!newUsername) {
      user = await User.findByIdAndUpdate(id, {
        email: newEmail
      });
    } else if (!newEmail) {
      user = await User.findByIdAndUpdate(id, {
        username: newUsername
      });
    } else {
      user = await User.findByIdAndUpdate(id, {
        email: newEmail,
        username: newUsername
      });
    }

    if (!user) return new NextResponse(`No user found with id ${id} to edit User profile`, { status: 404 });

    return NextResponse.json({ message: 'Updated account' }, { status: 200 });
  } catch (err) {
    console.log(err);
    return NextResponse.json({ err }, { status: 400 });
  }
}
