"use client";

import axios from "axios";
import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Copy, Edit, MoreHorizontal, Trash } from "lucide-react";
import toast from "react-hot-toast";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

import { ProductColumn } from "./columns";
import AlertModal from "@/components/modals/alert-modal";

interface CellActionProps {
  data: ProductColumn;
}

const CellAction = ({ data }: CellActionProps) => {
  const router = useRouter();
  const params = useParams();

  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const onCopy = (id: string) => {
    window.navigator.clipboard.writeText(id);
    toast.success("Product ID copied");
  };

  const onDelete = async () => {
    try {
      setLoading(true);
      await axios.delete(`/api/${params.storeId}/products/${data.id}`);
      router.refresh();
      toast.success("Product deleted");
    } catch (error) {
      toast.error("Something went wrong.");
    } finally {
      setLoading(false);
      setOpen(false);
    }
  };

  return (
    <>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={onDelete}
        loading={loading}
      />

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="p-0 size-8">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="size-4" />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => onCopy(data.id)}>
            <Copy className="size-4 mr-2" />
            Copy Id
          </DropdownMenuItem>

          <DropdownMenuItem
            onClick={() =>
              router.push(`/${params.storeId}/products/${data.id}`)
            }
          >
            <Edit className="size-4 mr-2" />
            Update
          </DropdownMenuItem>

          <DropdownMenuItem
            onClick={() => setOpen(true)}
            className="!text-red-500"
          >
            <Trash className="size-4 mr-2" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};

export default CellAction;
