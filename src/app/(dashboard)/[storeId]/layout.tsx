import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

import prisma from "@/lib/db";
import Navbar from "@/components/Navbar";

interface DashboardLayoutProps {
  children: React.ReactNode;
  params: {
    storeId: string;
  };
}

const DashboardLayout = async ({
  children,
  params: { storeId },
}: DashboardLayoutProps) => {
  const { userId } = auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const store = await prisma.store.findFirst({
    where: {
      id: storeId,
      userId,
    },
  });

  if (!store) {
    redirect("/");
  }

  return (
    <>
      <Navbar />
      {children}
    </>
  );
};

export default DashboardLayout;
