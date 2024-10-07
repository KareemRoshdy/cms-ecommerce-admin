"use client";

import { useParams, useRouter } from "next/navigation";
import { Plus } from "lucide-react";

import Heading from "@/components/Heading";
import { DataTable } from "@/components/data-table";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import ApiList from "@/components/api-list";

import { BillboardColumn, columns } from "./columns";

interface BillboardClientProps {
  data: BillboardColumn[];
}

export const BillboardClient: React.FC<BillboardClientProps> = ({ data }) => {
  const router = useRouter();
  const params = useParams();

  return (
    <>
      <div className="flex items-center justify-between">
        <Heading
          title={`Billboards (${data.length})`}
          description="Manage billboard for your store"
        />

        <Button
          onClick={() => router.push(`/${params.storeId}/billboards/new`)}
        >
          <Plus className="size-4 mr-2" />
          Add New
        </Button>
      </div>

      <Separator />

      <DataTable columns={columns} data={data} searchKey="label" />

      <Heading title="API" description="API calls for Billboards" />

      <Separator />

      <ApiList entityIdName="billboardId" entityName="billboards" />
    </>
  );
};
