import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET() {
  const messages = prisma.message.findMany();

  return NextResponse.json({ messages }, { status: 200 });
}
