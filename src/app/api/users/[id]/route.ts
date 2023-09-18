import dbConnect from '@/lib/dbConnect';
import User, { UserDocument } from '@/models/User';
import { getToken } from 'next-auth/jwt';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(_request: Request, { params }: { params: { id: string } }) {
  const { id } = params;

  await dbConnect();
  const user = await User.findById<UserDocument>(id);

  return NextResponse.json({ user }, { status: 200 });
}

// add or remove friend
export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  const token = await getToken({ req: request });

  const { id: friendId } = params;
  const { adding }: { adding: boolean } = await request.json();

  try {
    await dbConnect();

    const friend = await User.findById(friendId);
    const me = await User.findById(token?.id);

    if (adding) {
      friend.friends.push(token?.id);
      me.friends.push(friendId);
    } else {
      friend.friends.pull(token?.id);
      me.friends.pull(friendId);
    }

    await friend.save();
    await me.save();

    return NextResponse.json({ message: adding ? 'Added friend' : 'Removed friend' }, { status: 200 });
  } catch (err) {
    console.log(err);
    return NextResponse.json({ err }, { status: 400 });
  }
}
