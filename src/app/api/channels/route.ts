import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET() {
  const channels = prisma.channel.findMany();

  return NextResponse.json({ channels }, { status: 200 });
}
