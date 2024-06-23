"use client";

import { UAParser } from "ua-parser-js";
import { api } from "~/trpc/react";
import { Separator } from "@unsend/ui/src/separator";
import { EmailStatusBadge, EmailStatusIcon } from "./email-status-badge";
import { formatDate } from "date-fns";
import { EmailStatus } from "@prisma/client";
import { JsonValue } from "@prisma/client/runtime/library";
import {
  SesBounce,
  SesClick,
  SesComplaint,
  SesDeliveryDelay,
  SesOpen,
} from "~/types/aws-types";
import {
  BOUNCE_ERROR_MESSAGES,
  COMPLAINT_ERROR_MESSAGES,
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
          <div className=" dark:bg-slate-200 h-[250px] overflow-auto text-black rounded">
            <div
              className="px-4 py-4 overflow-auto"
              dangerouslySetInnerHTML={{ __html: emailQuery.data?.html ?? "" }}
            />
          </div>
        </div>
        <div className=" border rounded-lg w-full ">
          <div className="  p-4 flex flex-col gap-8 w-full">
            <div className="font-medium">Events History</div>
            <div className="flex items-stretch px-4 w-full">
              <div className="border-r border-dashed" />
              <div className="flex flex-col gap-12 w-full">
                {emailQuery.data?.emailEvents.map((evt) => (
                  <div
                    key={evt.status}
                    className="flex gap-5 items-start w-full"
                  >
                    <div className=" -ml-2.5">
                      <EmailStatusIcon status={evt.status} />
                    </div>
                    <div className="-mt-[0.125rem] w-full">
                      <div className=" capitalize font-medium">
                        <EmailStatusBadge status={evt.status} />
                      </div>
                      <div className="text-xs text-muted-foreground mt-2">
                        {formatDate(evt.createdAt, "MMM dd, hh:mm a")}
                      </div>
                      <div className="mt-1 text-primary/80">
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

    return (
      <div className="flex flex-col gap-4 w-full">
        <p>{getErrorMessage(_errorData)}</p>
        <div className="rounded-xl p-4 bg-muted/20 flex flex-col gap-4">
          <div className="flex gap-2 w-full">
            <div className="w-1/2">
              <p className="text-sm text-muted-foreground">Type</p>
              <p>{_errorData.bounceType}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Sub Type</p>
              <p>{_errorData.bounceSubType}</p>
            </div>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">SMTP response</p>
            <p>{_errorData.bouncedRecipients[0]?.diagnosticCode}</p>
          </div>
        </div>
      </div>
    );
  } else if (status === "FAILED") {
    const _errorData = data as unknown as { error: string };
    return <div>{_errorData.error}</div>;
  } else if (status === "OPENED") {
    const _data = data as unknown as SesOpen;
    const userAgent = getUserAgent(_data.userAgent);

    return (
      <div className="w-full rounded-xl p-4 bg-muted/20 mt-4">
        <div className="flex  w-full ">
          {userAgent.os.name ? (
            <div className="w-1/2">
              <p className="text-sm text-muted-foreground">OS</p>
              <p>{userAgent.os.name}</p>
            </div>
          ) : null}
          {userAgent.browser.name ? (
            <div>
              <p className="text-sm text-muted-foreground">Browser</p>
              <p>{userAgent.browser.name}</p>
            </div>
          ) : null}
        </div>
      </div>
    );
  } else if (status === "CLICKED") {
    const _data = data as unknown as SesClick;
    const userAgent = getUserAgent(_data.userAgent);

    return (
      <div className="w-full mt-4 flex flex-col gap-4  rounded-xl p-4 bg-muted/20">
        <div className="flex  w-full ">
          {userAgent.os.name ? (
            <div className="w-1/2">
              <p className="text-sm text-muted-foreground">OS </p>
              <p>{userAgent.os.name}</p>
            </div>
          ) : null}
          {userAgent.browser.name ? (
            <div>
              <p className="text-sm text-muted-foreground">Browser </p>
              <p>{userAgent.browser.name}</p>
            </div>
          ) : null}
        </div>
        <div className="w-full">
          <p className="text-sm text-muted-foreground">URL</p>
          <p>{_data.link}</p>
        </div>
      </div>
    );
  } else if (status === "COMPLAINED") {
    const _errorData = data as unknown as SesComplaint;

    return (
      <div className="flex flex-col gap-4 w-full">
        <p>{getComplaintMessage(_errorData.complaintFeedbackType)}</p>
      </div>
    );
  }

  return <div className="w-full">{status}</div>;
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

const getComplaintMessage = (errorType: string) => {
  return COMPLAINT_ERROR_MESSAGES[
    errorType as keyof typeof COMPLAINT_ERROR_MESSAGES
  ];
};

const getUserAgent = (userAgent: string) => {
  const parser = new UAParser(userAgent);
  return {
    browser: parser.getBrowser(),
    os: parser.getOS(),
    device: parser.getDevice(),
  };
};
