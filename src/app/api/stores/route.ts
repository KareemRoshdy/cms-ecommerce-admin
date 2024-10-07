import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

import prisma from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const { userId } = auth();

    const { name } = await req.json();

    if (!userId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    if (!name) {
      return NextResponse.json(
        { message: "Name is required" },
        { status: 400 }
      );
    }

    const store = await prisma.store.create({
      data: {
        name,
        userId,
      },
    });

    return NextResponse.json(
      { store },
      { status: 201 }
    );
  } catch (error) {
    console.log("[STORES_POST]", error);
    return NextResponse.json({ message: "Internal error" }, { status: 500 });
  }
}
