import dbConnect from '@/lib/dbConnect';
import User, { UserDocument } from '@/models/User';
import { NextRequest, NextResponse } from 'next/server';

// TODO: this only updates the user in mongodb, need to update auth session as well
export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;
  if (!id) return new NextResponse('No id found to edit User profile', { status: 404 });

  const { newUsername, newEmail }: { newUsername: string; newEmail: string } = await request.json();

  try {
    await dbConnect();

    const user = await User.findById<UserDocument>(id, {
      username: newUsername,
      email: newEmail
    });
    if (!user) return new NextResponse(`No user found with id ${id} to edit User profile`, { status: 404 });

    user.username = newUsername;
    user.email = newEmail;

    await user.save();

    return NextResponse.json({ user }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ err }, { status: 400 });
  }
}
