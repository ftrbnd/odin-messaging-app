import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET(_request: Request, { params }: { params: { id: string } }) {
  const { id } = params;

  const channel = await prisma.channel.findUnique({
    where: {
      id: id
    }
  });

  return NextResponse.json({ channel }, { status: 200 });
}
