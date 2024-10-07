import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { auth } from "@clerk/nextjs/server";

interface Props {
  params: {
    storeId: string;
  };
}

export async function PATCH(req: NextRequest, { params: { storeId } }: Props) {
  try {
    const { userId } = auth();

    const values = await req.json();

    if (!userId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const store = await prisma.store.findFirst({
      where: {
        id: storeId,
        userId,
      },
    });

    if (!store) {
      return NextResponse.json({ message: "Store not found" }, { status: 404 });
    }

    await prisma.store.update({
      where: { id: storeId, userId },
      data: { ...values },
    });

    return NextResponse.json(store, { status: 200 });
  } catch (error) {
    console.log("[PATCH_STORE_ID_ERROR]", error);
    return NextResponse.json({ message: "Internal error" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params: { storeId } }: Props) {
  try {
    const { userId } = auth();

    if (!userId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const store = await prisma.store.findFirst({
      where: {
        id: storeId,
        userId,
      },
    });

    if (!store) {
      return NextResponse.json({ message: "Store not found" }, { status: 404 });
    }

    await prisma.store.delete({
      where: { id: storeId, userId },
    });

    return NextResponse.json({ message: "Store deleted" }, { status: 200 });
  } catch (error) {
    console.log("[DELETE_STORE_ID_ERROR]", error);
    return NextResponse.json({ message: "Internal error" }, { status: 500 });
  }
}
