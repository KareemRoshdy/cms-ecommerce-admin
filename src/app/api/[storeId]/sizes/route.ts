import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

import prisma from "@/lib/db";

interface Props {
  params: {
    storeId: string;
  };
}

export async function POST(req: NextRequest, { params: { storeId } }: Props) {
  try {
    const { userId } = auth();

    const { name, value } = await req.json();

    if (!userId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    if (!name) {
      return NextResponse.json(
        { message: "Name is required" },
        { status: 400 }
      );
    }

    if (!value) {
      return NextResponse.json(
        { message: "Value is required" },
        { status: 400 }
      );
    }

    if (!storeId) {
      return NextResponse.json(
        { message: "Store ID is required" },
        { status: 400 }
      );
    }

    const storeByUserId = await prisma.store.findFirst({
      where: {
        id: storeId,
        userId,
      },
    });

    if (!storeByUserId) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    const size = await prisma.size.create({
      data: {
        name,
        value,
        storeId,
      },
    });

    return NextResponse.json(size, { status: 201 });
  } catch (error) {
    console.log("[SIZES_POST]", error);
    return NextResponse.json({ message: "Internal error" }, { status: 500 });
  }
}

export async function GET(_req: NextRequest, { params: { storeId } }: Props) {
  try {
    if (!storeId) {
      return NextResponse.json(
        { message: "Store ID is required" },
        { status: 400 }
      );
    }

    const sizes = await prisma.size.findMany({
      where: {
        storeId,
      },
    });

    return NextResponse.json(sizes, { status: 200 });
  } catch (error) {
    console.log("[SIZES_GET]", error);
    return NextResponse.json({ message: "Internal error" }, { status: 500 });
  }
}
