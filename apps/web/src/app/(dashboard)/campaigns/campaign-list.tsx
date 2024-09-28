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
import Spinner from "@unsend/ui/src/spinner";
import { formatDistanceToNow } from "date-fns";
import { CampaignStatus } from "@prisma/client";
import DeleteCampaign from "./delete-campaign";
import Link from "next/link";
import DuplicateCampaign from "./duplicate-campaign";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
} from "@unsend/ui/src/select";

export default function CampaignList() {
  const [page, setPage] = useUrlState("page", "1");
  const [status, setStatus] = useUrlState("status");

  const pageNumber = Number(page);

  const campaignsQuery = api.campaign.getCampaigns.useQuery({
    page: pageNumber,
    status: status as CampaignStatus | null,
  });

  return (
    <div className="mt-10 flex flex-col gap-4">
      <div className="flex justify-end">
        <Select
          value={status ?? "all"}
          onValueChange={(val) => setStatus(val === "all" ? null : val)}
        >
          <SelectTrigger className="w-[180px] capitalize">
            {status ? status.toLowerCase() : "All statuses"}
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all" className=" capitalize">
              All statuses
            </SelectItem>
            <SelectItem value={CampaignStatus.DRAFT} className=" capitalize">
              Draft
            </SelectItem>
            <SelectItem
              value={CampaignStatus.SCHEDULED}
              className=" capitalize"
            >
              Scheduled
            </SelectItem>
            <SelectItem value={CampaignStatus.SENT} className=" capitalize">
              Sent
            </SelectItem>
          </SelectContent>
        </Select>
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
                      className="underline underline-offset-4 decoration-dashed text-foreground hover:text-primary"
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
                          ? "bg-gray-500/15 dark:bg-gray-400/15 text-gray-700 dark:text-gray-400/90 border border-gray-500/25 dark:border-gray-700/25"
                          : campaign.status === CampaignStatus.SENT
                            ? "bg-green-500/15 dark:bg-green-600/10 text-green-700 dark:text-green-600/90 border border-green-500/25 dark:border-green-700/25"
                            : "bg-yellow-500/15 dark:bg-yellow-600/10 text-yellow-700 dark:text-yellow-600/90 border border-yellow-500/25 dark:border-yellow-700/25"
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
                      <DuplicateCampaign campaign={campaign} />
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

// "use client";

// import {
//   Table,
//   TableHeader,
//   TableRow,
//   TableHead,
//   TableBody,
//   TableCell,
// } from "@unsend/ui/src/table";
// import { api } from "~/trpc/react";
// import { useUrlState } from "~/hooks/useUrlState";
// import { Button } from "@unsend/ui/src/button";
// import Spinner from "@unsend/ui/src/spinner";
// import { formatDistanceToNow } from "date-fns";
// import { CampaignStatus } from "@prisma/client";
// import DeleteCampaign from "./delete-campaign";
// import Link from "next/link";
// import DuplicateCampaign from "./duplicate-campaign";
// import { motion } from "framer-motion";
// import { useRouter } from "next/navigation";
// import {
//   Select,
//   SelectTrigger,
//   SelectContent,
//   SelectItem,
// } from "@unsend/ui/src/select";

// export default function CampaignList() {
//   const [page, setPage] = useUrlState("page", "1");
//   const [status, setStatus] = useUrlState("status");

//   const pageNumber = Number(page);

//   const campaignsQuery = api.campaign.getCampaigns.useQuery({
//     page: pageNumber,
//     status: status as CampaignStatus | null,
//   });

//   const router = useRouter();

//   return (
//     <div className="mt-10 flex flex-col gap-4">
//       <div className="flex justify-end">
//         <Select
//           value={status ?? "all"}
//           onValueChange={(val) => setStatus(val === "all" ? null : val)}
//         >
//           <SelectTrigger className="w-[180px] capitalize">
//             {status ? status.toLowerCase() : "All statuses"}
//           </SelectTrigger>
//           <SelectContent>
//             <SelectItem value="all" className=" capitalize">
//               All statuses
//             </SelectItem>
//             <SelectItem value={CampaignStatus.DRAFT} className=" capitalize">
//               Draft
//             </SelectItem>
//             <SelectItem
//               value={CampaignStatus.SCHEDULED}
//               className=" capitalize"
//             >
//               Scheduled
//             </SelectItem>
//             <SelectItem value={CampaignStatus.SENT} className=" capitalize">
//               Sent
//             </SelectItem>
//           </SelectContent>
//         </Select>
//       </div>

//       {campaignsQuery.isLoading ? (
//         <div className="flex justify-center items-center mt-20">
//           <Spinner
//             className="w-5 h-5 text-primary"
//             innerSvgClass="stroke-primary"
//           />
//         </div>
//       ) : (
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 ">
//           {campaignsQuery.data?.campaigns.map((campaign) => (
//             <motion.div
//               whileHover={{ scale: 1.01 }}
//               transition={{ type: "spring", stiffness: 600, damping: 10 }}
//               whileTap={{ scale: 0.99 }}
//               className="border rounded-xl shadow hover:shadow-lg"
//               key={campaign.id}
//             >
//               <div className="flex flex-col">
//                 <Link
//                   href={
//                     campaign.status === CampaignStatus.DRAFT
//                       ? `/campaigns/${campaign.id}/edit`
//                       : `/campaigns/${campaign.id}`
//                   }
//                 >
//                   <div className="h-40 overflow-hidden flex justify-center  rounded-t-xl  bg-muted/10">
//                     <div
//                       className="transform scale-[0.5] "
//                       dangerouslySetInnerHTML={{ __html: campaign.html ?? "" }}
//                     />
//                   </div>
//                 </Link>

//                 <div className="flex justify-between items-center  shadow-[0px_-5px_25px_-8px_rgba(0,0,0,0.3)] rounded-xl -mt-2 z-10 bg-background">
//                   <div
//                     className="cursor-pointer w-full py-3 pl-4 flex gap-2 items-start"
//                     onClick={() => router.push(`/campaigns/${campaign.id}`)}
//                   >
//                     <div className="flex flex-col gap-2">
//                       <div className="flex  gap-4">
//                         <div className="font-semibold text-sm">
//                           {campaign.name}
//                         </div>
//                         <div
//                           className={`text-center px-4  rounded capitalize py-0.5 text-xs ${
//                             campaign.status === CampaignStatus.DRAFT
//                               ? "bg-gray-500/15 dark:bg-gray-600/10 text-gray-700 dark:text-gray-600/90 border border-gray-500/25 dark:border-gray-700/25"
//                               : campaign.status === CampaignStatus.SENT
//                                 ? "bg-green-500/15 dark:bg-green-600/10 text-green-700 dark:text-green-600/90 border border-green-500/25 dark:border-green-700/25"
//                                 : "bg-yellow-500/15 dark:bg-yellow-600/10 text-yellow-700 dark:text-yellow-600/90 border border-yellow-500/25 dark:border-yellow-700/25"
//                           }`}
//                         >
//                           {campaign.status.toLowerCase()}
//                         </div>
//                       </div>
//                       <div className="text-muted-foreground text-xs">
//                         {formatDistanceToNow(campaign.createdAt, {
//                           addSuffix: true,
//                         })}
//                       </div>
//                     </div>
//                   </div>

//                   <div className="flex gap-2  pr-4">
//                     <DuplicateCampaign campaign={campaign} />
//                     <DeleteCampaign campaign={campaign} />
//                   </div>
//                 </div>
//               </div>
//             </motion.div>
//           ))}
//         </div>
//       )}

//       {campaignsQuery.data?.totalPage && campaignsQuery.data.totalPage > 1 ? (
//         <div className="flex gap-4 justify-end">
//           <Button
//             size="sm"
//             onClick={() => setPage((pageNumber - 1).toString())}
//             disabled={pageNumber === 1}
//           >
//             Previous
//           </Button>
//           <Button
//             size="sm"
//             onClick={() => setPage((pageNumber + 1).toString())}
//             disabled={pageNumber >= (campaignsQuery.data?.totalPage ?? 0)}
//           >
//             Next
//           </Button>
//         </div>
//       ) : null}
//     </div>
//   );
// }
