"use client";

import JoinTeam from "~/components/team/JoinTeam";

export default function CreateTeam() {
  return (
    <div className="flex items-center justify-center min-h-screen ">
      <div className=" w-[300px] flex flex-col gap-8">
        <JoinTeam />
      </div>
    </div>
  );
}
