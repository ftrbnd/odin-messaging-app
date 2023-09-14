import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import prisma from '@/lib/prisma';

export async function POST(req: Request) {
  const body = await req.json();
  const { email, username, password } = body.data;

  if (!email || !username || !password) {
    return new NextResponse('Missing email, username, or password', { status: 400 });
  }

  const userExists = await prisma.user.findUnique({
    where: {
      email: email
    }
  });

  if (userExists) {
    return new NextResponse('User already exists', { status: 400 });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: {
      email,
      username,
      password: hashedPassword
    }
  });

  return NextResponse.json(user);
}
