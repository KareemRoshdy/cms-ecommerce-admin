import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

import prisma from "@/lib/db";

interface Props {
  params: {
    billboardId: string;
    storeId: string;
  };
}

export async function GET(
  _req: NextRequest,
  { params: { billboardId } }: Props
) {
  try {
    if (!billboardId) {
      return NextResponse.json(
        { message: "Billboard ID is required" },
        { status: 400 }
      );
    }

    const billboard = await prisma.billboard.findUnique({
      where: {
        id: billboardId,
      },
    });

    return NextResponse.json(billboard, { status: 200 });
  } catch (error) {
    console.log("[BILLBOARD_ID_GET]", error);
    return NextResponse.json({ message: "Internal error" }, { status: 500 });
  }
}

export async function PATCH(
  req: NextRequest,
  { params: { billboardId, storeId } }: Props
) {
  try {
    const { userId } = auth();
    const values = await req.json();

    if (!userId) {
      return NextResponse.json({ message: "Unauthenticated" }, { status: 401 });
    }

    if (!billboardId) {
      return NextResponse.json(
        { message: "Billboard ID is required" },
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

    const billboard = await prisma.billboard.updateMany({
      where: {
        id: billboardId,
      },
      data: {
        ...values,
      },
    });

    return NextResponse.json(billboard, { status: 201 });
  } catch (error) {
    console.log("[BILLBOARD_ID_PATCH]", error);
    return NextResponse.json({ message: "Internal error" }, { status: 500 });
  }
}

export async function DELETE(
  _req: NextRequest,
  { params: { billboardId, storeId } }: Props
) {
  try {
    const { userId } = auth();

    if (!userId) {
      return NextResponse.json({ message: "Unauthenticated" }, { status: 401 });
    }

    if (!billboardId) {
      return NextResponse.json(
        { message: "Billboard ID is required" },
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

    await prisma.billboard.delete({
      where: {
        id: billboardId,
      },
    });

    return NextResponse.json({ message: "Billboard deleted" }, { status: 200 });
  } catch (error) {
    console.log("[BILLBOARD_ID_DELETE]", error);
    return NextResponse.json({ message: "Internal error" }, { status: 500 });
  }
}
