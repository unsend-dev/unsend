"use client";

import { api } from "~/trpc/react";
import { Separator } from "@unsend/ui/src/separator";
import { EmailStatusBadge, EmailStatusIcon } from "./email-status-badge";
import { formatDate } from "date-fns";
import { EmailStatus } from "@prisma/client";
import { JsonValue } from "@prisma/client/runtime/library";
import { SesBounce, SesDeliveryDelay } from "~/types/aws-types";
import {
  BOUNCE_ERROR_MESSAGES,
  DELIVERY_DELAY_ERRORS,
} from "~/lib/constants/ses-errors";

export default function EmailDetails({ emailId }: { emailId: string }) {
  const emailQuery = api.email.getEmail.useQuery({ id: emailId });

  return (
    <div className="h-full overflow-auto">
      <div className="flex justify-between items-center">
        <div className="flex gap-4 items-center">
          <h1 className="font-bold text-lg">{emailQuery.data?.to}</h1>
          <EmailStatusBadge status={emailQuery.data?.latestStatus ?? "SENT"} />
        </div>
      </div>
      <div className="flex flex-col gap-8 mt-10 items-start ">
        <div className="p-2 rounded-lg border  flex flex-col gap-4 w-full">
          <div className="flex gap-2">
            <span className="w-[65px] text-muted-foreground ">From</span>
            <span>{emailQuery.data?.from}</span>
          </div>
          <Separator />
          <div className="flex gap-2">
            <span className="w-[65px] text-muted-foreground ">To</span>
            <span>{emailQuery.data?.to}</span>
          </div>
          <Separator />
          <div className="flex gap-2">
            <span className="w-[65px] text-muted-foreground ">Subject</span>
            <span>{emailQuery.data?.subject}</span>
          </div>
          <div className=" dark:bg-slate-200 h-[350px] overflow-auto text-black rounded">
            <div
              className="px-4 py-4 overflow-auto"
              dangerouslySetInnerHTML={{ __html: emailQuery.data?.html ?? "" }}
            />
          </div>
        </div>
        <div className=" border rounded-lg w-full ">
          <div className="  p-4 flex flex-col gap-8">
            <div className="font-medium">Events History</div>
            <div className="flex items-stretch px-4">
              <div className="border-r border-dashed" />
              <div className="flex flex-col gap-12">
                {emailQuery.data?.emailEvents.map((evt) => (
                  <div key={evt.status} className="flex gap-5 items-start">
                    <div className=" -ml-2.5">
                      <EmailStatusIcon status={evt.status} />
                    </div>
                    <div className="-mt-1">
                      <div className=" capitalize font-medium">
                        <EmailStatusBadge status={evt.status} />
                      </div>
                      <div className="text-xs text-muted-foreground mt-2">
                        {formatDate(evt.createdAt, "MMM dd, hh:mm a")}
                      </div>
                      <div className="mt-1 text-primary/70">
                        <EmailStatusText status={evt.status} data={evt.data} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const EmailStatusText = ({
  status,
  data,
}: {
  status: EmailStatus;
  data: JsonValue;
}) => {
  if (status === "SENT") {
    return (
      <div>
        We received your request and sent the email to recipient's server.
      </div>
    );
  } else if (status === "DELIVERED") {
    return <div>Mail is successfully delivered to the recipient.</div>;
  } else if (status === "DELIVERY_DELAYED") {
    const _errorData = data as unknown as SesDeliveryDelay;
    const errorMessage = DELIVERY_DELAY_ERRORS[_errorData.delayType];

    return <div>{errorMessage}</div>;
  } else if (status === "BOUNCED") {
    const _errorData = data as unknown as SesBounce;
    _errorData.bounceType;

    return <div>{getErrorMessage(_errorData)}</div>;
  }
  return <div>{status}</div>;
};

const getErrorMessage = (data: SesBounce) => {
  if (data.bounceType === "Permanent") {
    return BOUNCE_ERROR_MESSAGES[data.bounceType][
      data.bounceSubType as
        | "General"
        | "NoEmail"
        | "Suppressed"
        | "OnAccountSuppressionList"
    ];
  } else if (data.bounceType === "Transient") {
    return BOUNCE_ERROR_MESSAGES[data.bounceType][
      data.bounceSubType as
        | "General"
        | "MailboxFull"
        | "MessageTooLarge"
        | "ContentRejected"
        | "AttachmentRejected"
    ];
  } else if (data.bounceType === "Undetermined") {
    return BOUNCE_ERROR_MESSAGES.Undetermined;
  }
};
