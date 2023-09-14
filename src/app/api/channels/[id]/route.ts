import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET(_request: Request, { params }: { params: { id: string } }) {
  const { id } = params;

  const channel = await prisma.channel.findUnique({
    where: {
      id: id
    }
  });

  return NextResponse.json({ channel }, { status: 200 });
}
