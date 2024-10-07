import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

import prisma from "@/lib/db";

interface Props {
  params: {
    productId: string;
    storeId: string;
  };
}

export async function GET(_req: NextRequest, { params: { productId } }: Props) {
  try {
    if (!productId) {
      return NextResponse.json(
        { message: "Product ID is required" },
        { status: 400 }
      );
    }

    const product = await prisma.product.findUnique({
      where: {
        id: productId,
      },
      include: {
        images: true,
        category: true,
        color: true,
        size: true,
      },
    });

    return NextResponse.json(product, { status: 200 });
  } catch (error) {
    console.log("[PRODUCT_ID_GET]", error);
    return NextResponse.json({ message: "Internal error" }, { status: 500 });
  }
}

export async function PATCH(
  req: NextRequest,
  { params: { productId, storeId } }: Props
) {
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
      return NextResponse.json({ message: "Unauthenticated" }, { status: 401 });
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

    if (!productId) {
      return NextResponse.json(
        { message: "Product ID is required" },
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

    await prisma.product.update({
      where: {
        id: productId,
      },
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
          deleteMany: {},
        },
      },
    });

    const product = await prisma.product.update({
      where: {
        id: productId,
      },
      data: {
        images: {
          createMany: {
            data: [...images.map((img: { url: string }) => img)],
          },
        },
      },
    });

    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    console.log("[PRODUCT_ID_PATCH]", error);
    return NextResponse.json({ message: "Internal error" }, { status: 500 });
  }
}

export async function DELETE(
  _req: NextRequest,
  { params: { productId, storeId } }: Props
) {
  try {
    const { userId } = auth();

    if (!userId) {
      return NextResponse.json({ message: "Unauthenticated" }, { status: 401 });
    }

    if (!productId) {
      return NextResponse.json(
        { message: "Product ID is required" },
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

    await prisma.product.deleteMany({
      where: {
        id: productId,
      },
    });

    return NextResponse.json({ message: "Product deleted" }, { status: 200 });
  } catch (error: any) {
    console.log("[PRODUCT_ID_DELETE]", error.message);
    return NextResponse.json({ message: "Internal error" }, { status: 500 });
  }
}
