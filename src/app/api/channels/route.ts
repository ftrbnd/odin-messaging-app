import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET() {
  const channels = await prisma.channel.findMany();

  return NextResponse.json({ channels }, { status: 200 });
}
