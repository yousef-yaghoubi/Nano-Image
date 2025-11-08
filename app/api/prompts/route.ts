import { prisma } from "@/prisma/prismaClient";
import { NextResponse } from "next/server";
export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const limit = (Number(searchParams.get("limit")) as number) || 24;
  const page = (Number(searchParams.get("page")) as number) || 1;

  const skip = (page - 1) * Number(limit);
  try {
    const total = await prisma.prompts.count({
      where: {
        isPremium: false,
      },
    });

    const prompts = await prisma.prompts.findMany({
      take: Number(limit),
      skip: skip,
      where: {
        isPremium: false,
      },
    });

    const totalPages = Math.ceil(total / Number(limit));

    return NextResponse.json({
      success: true,
      message: "Prompts fetched successfully 🚀",
      data: prompts,
      pagination: {
        total,
        totalPages,
        currentPage: page,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: "Error fetching prompts",
      error,
      data: null,
      pagination: null,
    });
  }
}
