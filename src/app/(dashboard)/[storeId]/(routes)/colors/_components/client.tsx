"use client";

import { useParams, useRouter } from "next/navigation";
import { Plus } from "lucide-react";

import Heading from "@/components/Heading";
import { DataTable } from "@/components/data-table";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import ApiList from "@/components/api-list";

import { ColorColumn, columns } from "./columns";

interface ColorClientProps {
  data: ColorColumn[];
}

export const ColorClient: React.FC<ColorClientProps> = ({ data }) => {
  const router = useRouter();
  const params = useParams();

  return (
    <>
      <div className="flex items-center justify-between">
        <Heading
          title={`Colors (${data.length})`}
          description="Manage colors for your store"
        />

        <Button onClick={() => router.push(`/${params.storeId}/colors/new`)}>
          <Plus className="size-4 mr-2" />
          Add New
        </Button>
      </div>

      <Separator />

      <DataTable columns={columns} data={data} searchKey="name" />

      <Heading title="API" description="API calls for Colors" />

      <Separator />

      <ApiList entityIdName="colorId" entityName="colors" />
    </>
  );
};
