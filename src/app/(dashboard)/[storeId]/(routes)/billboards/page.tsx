import { format } from "date-fns";

import { BillboardClient } from "./_components/client";
import prisma from "@/lib/db";
import { BillboardColumn } from "./_components/columns";

interface BillboardClientProps {
  params: {
    storeId: string;
  };
}

const BillboardsPage: React.FC<BillboardClientProps> = async ({
  params: { storeId },
}) => {
  const billboards = await prisma.billboard.findMany({
    where: {
      storeId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const formattedBillboards: BillboardColumn[] = billboards.map((item) => ({
    id: item.id,
    label: item.label,
    createdAt: format(item.createdAt, "MMMM do, yyyy"),
  }));

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <BillboardClient data={formattedBillboards} />
      </div>
    </div>
  );
};

export default BillboardsPage;
