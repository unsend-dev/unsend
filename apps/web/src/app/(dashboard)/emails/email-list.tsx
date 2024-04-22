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
import {
  Mail,
  MailCheck,
  MailOpen,
  MailSearch,
  MailWarning,
  MailX,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { EmailStatus } from "@prisma/client";
import { EmailStatusBadge } from "./email-status-badge";
import EmailDetails from "./email-details";
import dynamic from "next/dynamic";
import { useUrlState } from "~/hooks/useUrlState";
import { Button } from "@unsend/ui/src/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@unsend/ui/src/select";

/* Stupid hydrating error. And I so stupid to understand the stupid NextJS docs. Because they stupid change it everyday */
const DynamicSheetWithNoSSR = dynamic(
  () => import("@unsend/ui/src/sheet").then((mod) => mod.Sheet),
  { ssr: false }
);

const DynamicSheetContentWithNoSSR = dynamic(
  () => import("@unsend/ui/src/sheet").then((mod) => mod.SheetContent),
  { ssr: false }
);

export default function EmailsList() {
  const [selectedEmail, setSelectedEmail] = useUrlState("emailId");
  const [page, setPage] = useUrlState("page", "1");
  const [status, setStatus] = useUrlState("status");

  const pageNumber = Number(page);

  const emailsQuery = api.email.emails.useQuery({
    page: pageNumber,
    status: status?.toUpperCase() as EmailStatus,
  });

  const handleSelectEmail = (emailId: string) => {
    setSelectedEmail(emailId);
  };

  const handleSheetChange = (isOpen: boolean) => {
    if (!isOpen) {
      setSelectedEmail(null);
    }
  };

  return (
    <div className="mt-10 flex flex-col gap-4">
      <div className="flex justify-end">
        <Select
          value={status ?? "All statuses"}
          onValueChange={(val) =>
            setStatus(val === "All statuses" ? null : val)
          }
        >
          <SelectTrigger className="w-[180px] capitalize">
            {status ? status.toLowerCase().replace("_", " ") : "All statuses"}
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All statuses" className=" capitalize">
              All statuses
            </SelectItem>
            {Object.values(EmailStatus).map((status) => (
              <SelectItem value={status} className=" capitalize">
                {status.toLowerCase().replace("_", " ")}
              </SelectItem>
            ))}
            {/* <SelectItem value="light">Light</SelectItem>
            <SelectItem value="dark">Dark</SelectItem>
            <SelectItem value="system">System</SelectItem> */}
          </SelectContent>
        </Select>
      </div>
      <div className="flex flex-col rounded-xl border shadow">
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
            {emailsQuery.data?.emails.length ? (
              emailsQuery.data?.emails.map((email) => (
                <TableRow
                  key={email.id}
                  onClick={() => handleSelectEmail(email.id)}
                  className=" cursor-pointer"
                >
                  <TableCell className="font-medium">
                    <div className="flex gap-4 items-center">
                      <EmailIcon status={email.latestStatus ?? "Send"} />
                      <p>{email.to}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <EmailStatusBadge status={email.latestStatus ?? "Sent"} />
                  </TableCell>
                  <TableCell>{email.subject}</TableCell>
                  <TableCell className="text-right">
                    {formatDistanceToNow(email.createdAt, { addSuffix: true })}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow className="h-32">
                <TableCell colSpan={4} className="text-center">
                  No emails found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        <DynamicSheetWithNoSSR
          open={!!selectedEmail}
          onOpenChange={handleSheetChange}
        >
          <DynamicSheetContentWithNoSSR className=" sm:max-w-3xl">
            {selectedEmail ? <EmailDetails emailId={selectedEmail} /> : null}
          </DynamicSheetContentWithNoSSR>
        </DynamicSheetWithNoSSR>
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
          disabled={pageNumber >= (emailsQuery.data?.totalPage ?? 0)}
        >
          Next
        </Button>
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
