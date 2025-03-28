"use client";

import { isCloud } from "~/utils/common";
import UsagePage from "./usage/usage";
import InviteTeamMember from "./team/invite-team-member";
import TeamMembersList from "./team/team-members-list";

export default function SettingsPage() {
  if (!isCloud()) {
    return (
      <div>
        <div>
          <div className="flex justify-end ">
            <InviteTeamMember />
          </div>
          <TeamMembersList />
        </div>
      </div>
    );
  }

  return (
    <div>
      <UsagePage />
    </div>
  );
}
