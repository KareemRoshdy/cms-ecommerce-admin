import { format } from "date-fns";

import { SizeClient } from "./_components/client";
import prisma from "@/lib/db";
import { SizeColumn } from "./_components/columns";

interface SizesClientProps {
  params: {
    storeId: string;
  };
}

const SizesPage: React.FC<SizesClientProps> = async ({
  params: { storeId },
}) => {
  const sizes = await prisma.size.findMany({
    where: {
      storeId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const formattedSizes: SizeColumn[] = sizes.map((item) => ({
    id: item.id,
    name: item.name,
    value: item.value,
    createdAt: format(item.createdAt, "MMMM do, yyyy"),
  }));

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <SizeClient data={formattedSizes} />
      </div>
    </div>
  );
};

export default SizesPage;
