import { format } from "date-fns";

import { CategoryClient } from "./_components/client";
import prisma from "@/lib/db";
import { CategoryColumn } from "./_components/columns";

interface CategoriesClientProps {
  params: {
    categoryId: string;
  };
}

const CategoriesPage: React.FC<CategoriesClientProps> = async ({
  params: { categoryId },
}) => {
  const categories = await prisma.category.findMany({
    where: {
      id: categoryId,
    },
    include: {
      billboard: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const formattedCategories: CategoryColumn[] = categories.map((item) => ({
    id: item.id,
    name: item.name,
    billboardLabel: item.billboard.label,
    createdAt: format(item.createdAt, "MMMM do, yyyy"),
  }));

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <CategoryClient data={formattedCategories} />
      </div>
    </div>
  );
};

export default CategoriesPage;
