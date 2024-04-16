"use client";

import Link from "next/link";
import {
  Table,
  TableCaption,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@unsend/ui/src/table";
import { Badge } from "@unsend/ui/src/badge";
import { api } from "~/trpc/react";
import {
  Mail,
  MailCheck,
  MailOpen,
  MailSearch,
  MailWarning,
  MailX,
} from "lucide-react";
import { formatDistance, formatDistanceToNow } from "date-fns";
import { EmailStatus } from "@prisma/client";

export default function EmailsList() {
  const emailsQuery = api.email.emails.useQuery();

  return (
    <div className="mt-10">
      <div className="flex rounded-xl border shadow">
        <Table className="">
          <TableHeader className="">
            <TableRow className=" bg-muted/30">
              <TableHead className="rounded-tl-xl">To</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Subject</TableHead>
              <TableHead className="text-right rounded-tr-xl">
                Sent at
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {emailsQuery.data?.map((email) => (
              <TableRow key={email.id}>
                <TableCell className="font-medium flex gap-4 items-center">
                  <EmailIcon status={email.latestStatus ?? "Send"} />
                  <p>{email.to}</p>
                </TableCell>
                <TableCell>
                  <EmailStatusBadge status={email.latestStatus ?? "Sent"} />
                  {/* <Badge className="w-[100px] flex py-1 justify-center text-emerald-400 hover:bg-emerald-500/10 bg-emerald-500/10 rounded">
                    {email.latestStatus ?? "Sent"}
                  </Badge> */}
                </TableCell>
                <TableCell>{email.subject}</TableCell>
                <TableCell className="text-right">
                  {formatDistanceToNow(email.createdAt, { addSuffix: true })}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

const EmailIcon: React.FC<{ status: EmailStatus }> = ({ status }) => {
  switch (status) {
    case "SENT":
      return (
        // <div className="border border-gray-400/60 p-2 rounded-lg bg-gray-400/10">
        <Mail className="w-6 h-6 text-gray-500 " />
        // </div>
      );
    case "DELIVERED":
      return (
        // <div className="border border-emerald-600/60 p-2 rounded-lg bg-emerald-500/10">
        <MailCheck className="w-6 h-6 text-emerald-800" />
        // </div>
      );
    case "BOUNCED":
      return (
        // <div className="border border-red-600/60 p-2 rounded-lg bg-red-500/10">
        <MailX className="w-6 h-6 text-red-900" />
        // </div>
      );
    case "CLICKED":
      return (
        // <div className="border border-cyan-600/60 p-2 rounded-lg bg-cyan-500/10">
        <MailSearch className="w-6 h-6 text-cyan-700" />
        // </div>
      );
    case "OPENED":
      return (
        // <div className="border border-indigo-600/60 p-2 rounded-lg bg-indigo-500/10">
        <MailOpen className="w-6 h-6 text-indigo-700" />
        // </div>
      );
    case "DELIVERY_DELAYED":
    case "COMPLAINED":
      return (
        // <div className="border border-yellow-600/60 p-2 rounded-lg bg-yellow-500/10">
        <MailWarning className="w-6 h-6 text-yellow-700" />
        // </div>
      );
    default:
      return (
        // <div className="border border-gray-400/60 p-2 rounded-lg">
        <Mail className="w-6 h-6" />
        // </div>
      );
  }
};

const EmailStatusBadge: React.FC<{ status: EmailStatus }> = ({ status }) => {
  let badgeColor = "bg-gray-400/10 text-gray-500 border-gray-400/10"; // Default color
  switch (status) {
    case "SENT":
      badgeColor = "bg-gray-400/10 text-gray-500 border-gray-400/10";
      break;
    case "DELIVERED":
      badgeColor = "bg-emerald-500/10 text-emerald-500 border-emerald-600/10";
      break;
    case "BOUNCED":
      badgeColor = "bg-red-500/10 text-red-800 border-red-600/10";
      break;
    case "CLICKED":
      badgeColor = "bg-cyan-500/10 text-cyan-600 border-cyan-600/10";
      break;
    case "OPENED":
      badgeColor = "bg-indigo-500/10 text-indigo-600 border-indigo-600/10";
      break;
    case "DELIVERY_DELAYED":
      badgeColor = "bg-yellow-500/10 text-yellow-600 border-yellow-600/10";
    case "COMPLAINED":
      badgeColor = "bg-yellow-500/10 text-yellow-600 border-yellow-600/10";
      break;
    default:
      badgeColor = "bg-gray-400/10 text-gray-500 border-gray-400/10";
  }

  return (
    <div
      className={` text-center w-[130px] rounded capitalize py-0.5 text-xs ${badgeColor}`}
    >
      {status.toLowerCase().split("_").join(" ")}
    </div>
  );
};
