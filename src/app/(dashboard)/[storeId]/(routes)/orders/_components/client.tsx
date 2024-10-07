"use client";

import Heading from "@/components/Heading";
import { DataTable } from "@/components/data-table";
import { Separator } from "@/components/ui/separator";

import { OrderColumn, columns } from "./columns";

interface OrderClientProps {
  data: OrderColumn[];
}

export const OrderClient: React.FC<OrderClientProps> = ({ data }) => {
  return (
    <>
      <Heading
        title={`Orders (${data.length})`}
        description="Manage orders for your store"
      />

      <Separator />

      <DataTable columns={columns} data={data} searchKey="products" />
    </>
  );
};
