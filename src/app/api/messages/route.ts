import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET() {
  const messages = await prisma.message.findMany();

  return NextResponse.json({ messages }, { status: 200 });
}
