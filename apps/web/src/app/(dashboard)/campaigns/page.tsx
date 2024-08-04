"use client";

import CampaignList from "./campaign-list";
import CreateCampaign from "./create-campaign";

export default function ContactsPage() {
  return (
    <div>
      <div className="flex justify-between items-center">
        <h1 className="font-bold text-lg">Campaigns</h1>
        <CreateCampaign />
      </div>
      <CampaignList />
    </div>
  );
}
