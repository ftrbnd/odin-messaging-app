import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET(_request: Request, { params }: { params: { id: string } }) {
  const { id } = params;

  const user = await prisma.user.findUnique({
    where: {
      id: id
    },
    select: {
      channels: {
        select: {
          name: true
        }
      }
    }
  });
  const channels = user?.channels;

  return NextResponse.json({ channels }, { status: 200 });
}
