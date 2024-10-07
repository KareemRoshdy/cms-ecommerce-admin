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

    const {
      name,
      price,
      categoryId,
      colorId,
      sizeId,
      images,
      isFeatured,
      isArchived,
    } = await req.json();

    if (!userId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    if (!name) {
      return NextResponse.json(
        { message: "Name is required" },
        { status: 400 }
      );
    }

    if (!sizeId) {
      return NextResponse.json(
        { message: "Size Id is required" },
        { status: 400 }
      );
    }

    if (!colorId) {
      return NextResponse.json(
        { message: "Color Id is required" },
        { status: 400 }
      );
    }

    if (!categoryId) {
      return NextResponse.json(
        { message: "Category Id is required" },
        { status: 400 }
      );
    }

    if (!price) {
      return NextResponse.json(
        { message: "Price is required" },
        { status: 400 }
      );
    }

    if (!images || !images.length) {
      return NextResponse.json(
        { message: "Images is required" },
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

    const product = await prisma.product.create({
      data: {
        name,
        price,
        isFeatured,
        isArchived,
        categoryId,
        colorId,
        sizeId,
        storeId,
        images: {
          createMany: {
            data: [...images.map((img: { url: string }) => img)],
          },
        },
      },
    });

    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    console.log("[PRODUCTS_POST]", error);
    return NextResponse.json({ message: "Internal error" }, { status: 500 });
  }
}

export async function GET(req: NextRequest, { params: { storeId } }: Props) {
  try {
    const { searchParams } = new URL(req.url);
    const categoryId = searchParams.get("categoryId") || undefined;
    const colorId = searchParams.get("colorId") || undefined;
    const sizeId = searchParams.get("sizeId") || undefined;
    const isFeatured = searchParams.get("isFeatured");

    if (!storeId) {
      return NextResponse.json(
        { message: "Store ID is required" },
        { status: 400 }
      );
    }

    const products = await prisma.product.findMany({
      where: {
        storeId,
        categoryId,
        colorId,
        sizeId,
        isFeatured: isFeatured ? true : undefined,
        isArchived: false,
      },
      include: {
        images: true,
        category: true,
        color: true,
        size: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(products, { status: 200 });
  } catch (error) {
    console.log("[PRODUCTS_GET]", error);
    return NextResponse.json({ message: "Internal error" }, { status: 500 });
  }
}
