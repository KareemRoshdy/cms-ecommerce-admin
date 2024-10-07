import { format } from "date-fns";

import { ColorClient } from "./_components/client";
import prisma from "@/lib/db";
import { ColorColumn } from "./_components/columns";

interface ColorClientProps {
  params: {
    storeId: string;
  };
}

const ColorsPage: React.FC<ColorClientProps> = async ({
  params: { storeId },
}) => {
  const colors = await prisma.color.findMany({
    where: {
      storeId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const formattedColors: ColorColumn[] = colors.map((item) => ({
    id: item.id,
    name: item.name,
    value: item.value,
    createdAt: format(item.createdAt, "MMMM do, yyyy"),
  }));

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <ColorClient data={formattedColors} />
      </div>
    </div>
  );
};

export default ColorsPage;
