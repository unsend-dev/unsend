"use client";

import InviteTeamMember from "./invite-team-member";
import TeamMembersList from "./team-members-list";

export default function TeamsPage() {
  return (
    <div>
      <div className="flex justify-end ">
        <InviteTeamMember />
      </div>
      <TeamMembersList />
    </div>
  );
}
