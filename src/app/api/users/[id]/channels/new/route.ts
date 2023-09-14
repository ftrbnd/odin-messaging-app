import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function POST(request: Request, { params }: { params: { id: string } }) {
  const { id } = params;
  console.log(`/users/${id}/channels/new`);
  console.log(request.body);

  return NextResponse.json({ message: 'hi' }, { status: 200 });
}
