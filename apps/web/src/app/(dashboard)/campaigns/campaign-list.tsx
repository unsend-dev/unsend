"use client";

import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@unsend/ui/src/table";
import { api } from "~/trpc/react";
import { useUrlState } from "~/hooks/useUrlState";
import { Button } from "@unsend/ui/src/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@unsend/ui/src/select";
import Spinner from "@unsend/ui/src/spinner";
import { formatDistanceToNow } from "date-fns";
import { CampaignStatus } from "@prisma/client";
import DeleteCampaign from "./delete-campaign";
import { Edit2 } from "lucide-react";
import Link from "next/link";

export default function CampaignList() {
  const [page, setPage] = useUrlState("page", "1");
  const [status, setStatus] = useUrlState("status");

  const pageNumber = Number(page);

  const campaignsQuery = api.campaign.getCampaigns.useQuery({
    page: pageNumber,
  });

  return (
    <div className="mt-10 flex flex-col gap-4">
      <div className="flex justify-end">
        {/* <Select
          value={status ?? "All"}
          onValueChange={(val) => setStatus(val === "All" ? null : val)}
        >
          <SelectTrigger className="w-[180px] capitalize">
            {status || "All statuses"}
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All" className=" capitalize">
              All statuses
            </SelectItem>
            <SelectItem value="Active" className=" capitalize">
              Active
            </SelectItem>
            <SelectItem value="Inactive" className=" capitalize">
              Inactive
            </SelectItem>
          </SelectContent>
        </Select> */}
      </div>
      <div className="flex flex-col rounded-xl border border-border shadow">
        <Table className="">
          <TableHeader className="">
            <TableRow className=" bg-muted/30">
              <TableHead className="rounded-tl-xl">Name</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="">Created At</TableHead>
              <TableHead className="rounded-tr-xl">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {campaignsQuery.isLoading ? (
              <TableRow className="h-32">
                <TableCell colSpan={4} className="text-center py-4">
                  <Spinner
                    className="w-6 h-6 mx-auto"
                    innerSvgClass="stroke-primary"
                  />
                </TableCell>
              </TableRow>
            ) : campaignsQuery.data?.campaigns.length ? (
              campaignsQuery.data?.campaigns.map((campaign) => (
                <TableRow key={campaign.id} className="">
                  <TableCell className="font-medium">
                    <Link
                      href={
                        campaign.status === CampaignStatus.DRAFT
                          ? `/campaigns/${campaign.id}/edit`
                          : `/campaigns/${campaign.id}`
                      }
                    >
                      {campaign.name}
                    </Link>
                  </TableCell>
                  <TableCell>
                    <div
                      className={`text-center w-[130px] rounded capitalize py-1 text-xs ${
                        campaign.status === CampaignStatus.DRAFT
                          ? "bg-gray-500/10 text-gray-500 border-gray-600/10"
                          : campaign.status === CampaignStatus.SENT
                            ? "bg-emerald-500/10 text-emerald-500 border-emerald-600/10"
                            : "bg-yellow-500/10 text-yellow-600 border-yellow-600/10"
                      }`}
                    >
                      {campaign.status.toLowerCase()}
                    </div>
                  </TableCell>
                  <TableCell className="">
                    {formatDistanceToNow(new Date(campaign.createdAt), {
                      addSuffix: true,
                    })}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      {/* <Link href={`/campaigns/${campaign.id}/edit`}>
                        <Button variant="ghost" size="sm">
                          <Edit2 className="w-4 h-4" />
                        </Button>
                      </Link> */}
                      <DeleteCampaign campaign={campaign} />
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow className="h-32">
                <TableCell colSpan={4} className="text-center py-4">
                  No campaigns found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex gap-4 justify-end">
        <Button
          size="sm"
          onClick={() => setPage((pageNumber - 1).toString())}
          disabled={pageNumber === 1}
        >
          Previous
        </Button>
        <Button
          size="sm"
          onClick={() => setPage((pageNumber + 1).toString())}
          disabled={pageNumber >= (campaignsQuery.data?.totalPage ?? 0)}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
