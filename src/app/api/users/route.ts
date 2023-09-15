import dbConnect from '@/lib/dbConnect';
import User, { UserDocument } from '@/models/User';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const searchInput = request.nextUrl.searchParams.get('search');
  if (!searchInput) return new NextResponse('Search query must not be empty.', { status: 400 });
  console.log('search input: ', searchInput);

  await dbConnect();
  // const users = await User.aggregate().search({
  //   text: {
  //     query: searchInput,
  //     path: 'username'
  //   }
  // });
  const users = await User.find({
    $text: { $search: searchInput }
  });

  console.log('Search results: ', users);

  return NextResponse.json({ users }, { status: 200 });
}
