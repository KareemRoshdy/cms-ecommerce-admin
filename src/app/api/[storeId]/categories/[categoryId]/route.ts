import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

import prisma from "@/lib/db";

interface Props {
  params: {
    categoryId: string;
    storeId: string;
  };
}

export async function GET(
  _req: NextRequest,
  { params: { categoryId } }: Props
) {
  try {
    if (!categoryId) {
      return NextResponse.json(
        { message: "Category ID is required" },
        { status: 400 }
      );
    }

    const category = await prisma.category.findUnique({
      where: {
        id: categoryId,
      },
      include: {
        billboard: true,
      },
    });

    return NextResponse.json(category, { status: 200 });
  } catch (error) {
    console.log("[CATEGORY_ID_GET]", error);
    return NextResponse.json({ message: "Internal error" }, { status: 500 });
  }
}

export async function PATCH(
  req: NextRequest,
  { params: { categoryId, storeId } }: Props
) {
  try {
    const { userId } = auth();
    const values = await req.json();

    if (!userId) {
      return NextResponse.json({ message: "Unauthenticated" }, { status: 401 });
    }

    if (!categoryId) {
      return NextResponse.json(
        { message: "Category ID is required" },
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

    const category = await prisma.category.updateMany({
      where: {
        id: categoryId,
      },
      data: {
        ...values,
      },
    });

    return NextResponse.json(category, { status: 201 });
  } catch (error) {
    console.log("[CATEGORY_ID_PATCH]", error);
    return NextResponse.json({ message: "Internal error" }, { status: 500 });
  }
}

export async function DELETE(
  _req: NextRequest,
  { params: { categoryId, storeId } }: Props
) {
  try {
    const { userId } = auth();

    if (!userId) {
      return NextResponse.json({ message: "Unauthenticated" }, { status: 401 });
    }

    if (!categoryId) {
      return NextResponse.json(
        { message: "Category ID is required" },
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

    await prisma.category.delete({
      where: {
        id: categoryId,
      },
    });

    return NextResponse.json({ message: "Category deleted" }, { status: 200 });
  } catch (error: any) {
    console.log("[CATEGORY_ID_DELETE]", error.message);
    return NextResponse.json({ message: "Internal error" }, { status: 500 });
  }
}
