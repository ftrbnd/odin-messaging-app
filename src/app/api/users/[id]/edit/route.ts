import dbConnect from '@/lib/dbConnect';
import User, { UserDocument } from '@/models/User';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;
  if (!id) return new NextResponse('No id found to edit User profile', { status: 404 });

  const { newUsername, newEmail, newImage }: { newUsername: string; newEmail: string; newImage: string } = await request.json();

  try {
    await dbConnect();

    const [emailExists, usernameExists] = await Promise.all([User.findOne<UserDocument>({ email: newEmail }), User.findOne<UserDocument>({ username: newUsername })]);

    if (emailExists) {
      return new NextResponse('Email already exists', { status: 400 });
    } else if (usernameExists) {
      return new NextResponse('Username already exists', { status: 400 });
    }

    const user = await User.findById(id);
    if (!user) return new NextResponse(`No user found with id ${id} to edit User profile`, { status: 404 });

    if (newEmail) user.email = newEmail;
    if (newUsername) user.username = newUsername;
    if (newImage) user.image = newImage;

    await user.save();

    return NextResponse.json({ message: 'Updated account' }, { status: 200 });
  } catch (err) {
    console.log(err);
    return NextResponse.json({ err }, { status: 400 });
  }
}
