import { format } from "date-fns";

import { ProductClient } from "./_components/client";
import prisma from "@/lib/db";
import { ProductColumn } from "./_components/columns";
import { formatter } from "@/lib/utils";

interface ProductClientProps {
  params: {
    storeId: string;
  };
}

const ProductsPage: React.FC<ProductClientProps> = async ({
  params: { storeId },
}) => {
  const products = await prisma.product.findMany({
    where: {
      storeId,
    },
    include: {
      category: true,
      color: true,
      size: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const formattedProducts: ProductColumn[] = products.map((item) => ({
    id: item.id,
    name: item.name,
    isFeatured: item.isFeatured,
    isArchived: item.isArchived,
    price: formatter.format(item.price.toNumber()),
    category: item.category.name,
    size: item.size.name,
    color: item.color.value,
    createdAt: format(item.createdAt, "MMMM do, yyyy"),
  }));

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <ProductClient data={formattedProducts} />
      </div>
    </div>
  );
};

export default ProductsPage;
