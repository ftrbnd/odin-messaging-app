import dbConnect from '@/lib/dbConnect';
import User, { UserDocument } from '@/models/User';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const searchInput = request.nextUrl.searchParams.get('search');
  if (!searchInput) return new NextResponse('Search query must not be empty.', { status: 400 });

  try {
    await dbConnect();

    const regex = new RegExp(searchInput, 'i');
    const users = await User.find<UserDocument>(
      {
        username: regex
      },
      'username image'
    )
      .limit(5)
      .sort({ username: 1 });

    return NextResponse.json({ users }, { status: 200 });
  } catch (err) {
    console.log(err);
    return NextResponse.json({ err }, { status: 400 });
  }
}
