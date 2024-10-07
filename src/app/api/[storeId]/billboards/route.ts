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

    const { label, imageUrl } = await req.json();

    if (!userId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    if (!label) {
      return NextResponse.json(
        { message: "Label is required" },
        { status: 400 }
      );
    }

    if (!imageUrl) {
      return NextResponse.json(
        { message: "Image is required" },
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

    const billboard = await prisma.billboard.create({
      data: {
        label,
        imageUrl,
        storeId,
      },
    });

    return NextResponse.json(billboard, { status: 201 });
  } catch (error) {
    console.log("[BILLBOARDS_POST]", error);
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

    const billboards = await prisma.billboard.findMany({
      where: {
        storeId,
      },
    });

    return NextResponse.json(billboards, { status: 200 });
  } catch (error) {
    console.log("[BILLBOARDS_GET]", error);
    return NextResponse.json({ message: "Internal error" }, { status: 500 });
  }
}
