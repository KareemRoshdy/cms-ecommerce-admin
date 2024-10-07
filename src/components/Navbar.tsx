import prisma from "@/lib/db";
import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";

import { UserButton } from "@clerk/nextjs";
import MainNav from "@/components/MainNav";
import StoreSwitcher from "@/components/store-switcher";
import { ThemeToggle } from "@/components/theme-toggle";

const Navbar = async () => {
  const { userId } = auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const stores = await prisma.store.findMany({
    where: {
      userId,
    },
  });

  return (
    <div className="border-b">
      <div className="flex items-center p-4 h-16">
        <StoreSwitcher items={stores} />

        <MainNav className="mx-6" />

        <div className="ml-auto flex items-center space-x-4">
          <ThemeToggle />
          <UserButton afterSignOutUrl="/" />
        </div>
      </div>
    </div>
  );
};

export default Navbar;
