"use client"

import Heading from "@/components/ui/Heading"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Billboard } from "@prisma/client"
import { Plus } from "lucide-react"
import { useParams, useRouter } from "next/navigation"
import { BillboardColumn, columns } from "./column"
import { DataTable } from "@/components/ui/data-table"
import ApiList from "@/components/ui/api-list"

interface BillboardsClientProps {
    data: BillboardColumn[];
}

export const BillboardsClient: React.FC<BillboardsClientProps> = ({
    data
}) => {

    const params = useParams();
    const router = useRouter();
    // console.log(data)

    return (
        <>
            <div className="flex items-center justify-between">
                <Heading
                    title={`Billboards (${data.length})`}
                    description="Manage billboards"
                />
                <Button
                    onClick={() => router.push(`/${params.storeId}/billboards/new`)}
                >
                    <Plus className="mr-2 w-4 h-4" />
                    Add New
                </Button>

            </div>
            <Separator />
            <DataTable data={data} columns={columns} searchKey="label"/>
            <Heading 
                title="API"
                description="API calls for billboards"
            />
            <Separator />
            <ApiList entityName="billboards" entityIdName="billboardId"/>
        </>
    )
}
