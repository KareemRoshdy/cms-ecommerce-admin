import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

import prisma from "@/lib/db";

interface Props {
  params: {
    sizeId: string;
    storeId: string;
  };
}

export async function GET(_req: NextRequest, { params: { sizeId } }: Props) {
  try {
    if (!sizeId) {
      return NextResponse.json(
        { message: "Size ID is required" },
        { status: 400 }
      );
    }

    const size = await prisma.size.findUnique({
      where: {
        id: sizeId,
      },
    });

    return NextResponse.json(size, { status: 200 });
  } catch (error) {
    console.log("[SIZE_ID_GET]", error);
    return NextResponse.json({ message: "Internal error" }, { status: 500 });
  }
}

export async function PATCH(
  req: NextRequest,
  { params: { sizeId, storeId } }: Props
) {
  try {
    const { userId } = auth();
    const values = await req.json();

    if (!userId) {
      return NextResponse.json({ message: "Unauthenticated" }, { status: 401 });
    }

    if (!sizeId) {
      return NextResponse.json(
        { message: "Size ID is required" },
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

    const size = await prisma.size.updateMany({
      where: {
        id: sizeId,
      },
      data: {
        ...values,
      },
    });

    return NextResponse.json(size, { status: 201 });
  } catch (error) {
    console.log("[SIZE_ID_PATCH]", error);
    return NextResponse.json({ message: "Internal error" }, { status: 500 });
  }
}

export async function DELETE(
  _req: NextRequest,
  { params: { sizeId, storeId } }: Props
) {
  try {
    const { userId } = auth();

    if (!userId) {
      return NextResponse.json({ message: "Unauthenticated" }, { status: 401 });
    }

    if (!sizeId) {
      return NextResponse.json(
        { message: "Size ID is required" },
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

    await prisma.size.delete({
      where: {
        id: sizeId,
      },
    });

    return NextResponse.json({ message: "Size deleted" }, { status: 200 });
  } catch (error) {
    console.log("[SIZE_ID_DELETE]", error);
    return NextResponse.json({ message: "Internal error" }, { status: 500 });
  }
}
