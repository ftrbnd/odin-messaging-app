import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET(_request: Request, { params }: { params: { id: string } }) {
  const { id } = params;

  const message = await prisma.message.findUnique({
    where: {
      id: id
    }
  });

  return NextResponse.json({ message }, { status: 200 });
}
