"use client";

import { api } from "~/trpc/react";
import { Spinner } from "@unsend/ui/src/spinner";
import { Button } from "@unsend/ui/src/button";
import { Input } from "@unsend/ui/src/input";
import { Editor } from "@unsend/email-editor";
import { ReactNode, useEffect, useRef, useState } from "react";

interface ShadowDomWrapperProps {
  children: ReactNode;
}

export function ShadowDomWrapper({ children }: ShadowDomWrapperProps) {
  const hostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (hostRef.current) {
      const shadowRoot = hostRef.current.attachShadow({ mode: "open" });
      const wrapper = document.createElement("div");
      wrapper.innerHTML = (children as React.ReactElement).props.children;
      shadowRoot.appendChild(wrapper);
    }
  }, [children]);

  return <div ref={hostRef} />;
}

export default function EditCampaignPage({
  params,
}: {
  params: { campaignId: string };
}) {
  const {
    data: campaign,
    isLoading,
    error,
  } = api.campaign.getCampaign.useQuery(
    { campaignId: params.campaignId },
    {
      enabled: !!params.campaignId,
    }
  );

  const [json, setJson] = useState<Record<string, any> | undefined>();

  useEffect(() => {
    if (campaign?.content) {
      setJson(JSON.parse(campaign.content));
    }
  }, [campaign?.content]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full">
        <Spinner className="w-6 h-6" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-full">
        <p className="text-red-500">Failed to load campaign</p>
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="w-[600px] mx-auto">
        <div className="mb-4">
          <label className="block text-sm font-medium ">Subject</label>
          <Input
            type="text"
            value={campaign?.subject}
            readOnly
            className="mt-1 block w-full rounded-md  shadow-sm"
          />
        </div>
        <div className="mb-12">
          <label className="block text-sm font-medium ">From</label>
          <Input
            type="text"
            value={campaign?.from}
            readOnly
            className="mt-1 block w-full rounded-md  shadow-sm"
          />
        </div>
        {/* <ShadowDomWrapper> */}
        <Editor initialContent={json} />
        {/* </ShadowDomWrapper> */}
      </div>
    </div>
  );
}
