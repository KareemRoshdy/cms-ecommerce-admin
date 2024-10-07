import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

import prisma from "@/lib/db";

interface Props {
  params: {
    colorId: string;
    storeId: string;
  };
}

export async function GET(_req: NextRequest, { params: { colorId } }: Props) {
  try {
    if (!colorId) {
      return NextResponse.json(
        { message: "Color ID is required" },
        { status: 400 }
      );
    }

    const color = await prisma.color.findUnique({
      where: {
        id: colorId,
      },
    });

    return NextResponse.json(color, { status: 200 });
  } catch (error) {
    console.log("[COLOR_ID_GET]", error);
    return NextResponse.json({ message: "Internal error" }, { status: 500 });
  }
}

export async function PATCH(
  req: NextRequest,
  { params: { colorId, storeId } }: Props
) {
  try {
    const { userId } = auth();
    const values = await req.json();

    if (!userId) {
      return NextResponse.json({ message: "Unauthenticated" }, { status: 401 });
    }

    if (!colorId) {
      return NextResponse.json(
        { message: "Color ID is required" },
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

    const color = await prisma.color.updateMany({
      where: {
        id: colorId,
      },
      data: {
        ...values,
      },
    });

    return NextResponse.json(color, { status: 201 });
  } catch (error) {
    console.log("[COLOR_ID_PATCH]", error);
    return NextResponse.json({ message: "Internal error" }, { status: 500 });
  }
}

export async function DELETE(
  _req: NextRequest,
  { params: { colorId, storeId } }: Props
) {
  try {
    const { userId } = auth();

    if (!userId) {
      return NextResponse.json({ message: "Unauthenticated" }, { status: 401 });
    }

    if (!colorId) {
      return NextResponse.json(
        { message: "Color ID is required" },
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

    await prisma.color.delete({
      where: {
        id: colorId,
      },
    });

    return NextResponse.json({ message: "Color deleted" }, { status: 200 });
  } catch (error) {
    console.log("[COLOR_ID_DELETE]", error);
    return NextResponse.json({ message: "Internal error" }, { status: 500 });
  }
}
