import { prisma } from '@/prisma/prismaClient';
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id') as string;

  try {
    const prompt = await prisma.prompts.findUnique({
      where: {
        id,
      },
    });

    return NextResponse.json({
      response: 200,
      data: prompt,
    });
  } catch {
    return NextResponse.json({
      response: 404,
      data: null,
    });
  }
}
