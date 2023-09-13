import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET(_request: Request, { params }: { params: { id: string } }) {
  const { id } = params;

  const user = prisma.user.findUnique({
    where: {
      id: id
    }
  });

  return NextResponse.json({ user }, { status: 200 });
}
