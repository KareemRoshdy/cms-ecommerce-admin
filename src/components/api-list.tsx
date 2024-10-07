"use client";

import useOrigin from "@/hooks/use-origin";

import { useParams } from "next/navigation";
import ApiAlert from "./ui/api-alert";

interface ApiListProps {
  entityName: string;
  entityIdName: string;
}

const ApiList = ({ entityIdName, entityName }: ApiListProps) => {
  const params = useParams();
  const origin = useOrigin();

  const url = `${origin}/api/${params.storeId}`;

  return (
    <>
      <ApiAlert
        title="GET"
        variant="public"
        description={`${url}/${entityName}`}
      />

      <ApiAlert
        title="GET"
        variant="public"
        description={`${url}/${entityName}/{${entityIdName}}`}
      />

      <ApiAlert
        title="POST"
        variant="admin"
        description={`${url}/${entityName}`}
      />

      <ApiAlert
        title="PATCH"
        variant="admin"
        description={`${url}/${entityName}/{${entityIdName}}`}
      />

      <ApiAlert
        title="DELETE"
        variant="admin"
        description={`${url}/${entityName}/{${entityIdName}}`}
      />
    </>
  );
};

export default ApiList;
