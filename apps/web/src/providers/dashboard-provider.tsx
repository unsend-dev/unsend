"use client";

import { FullScreenLoading } from "~/components/FullScreenLoading";
import CreateTeam from "~/components/team/CreateTeam";
import { api } from "~/trpc/react";

export const DashboardProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { data: teams, status } = api.team.getTeams.useQuery();

  if (status === "pending") {
    return <FullScreenLoading />;
  }

  if (!teams || teams.length === 0) {
    return <CreateTeam />;
  }

  return <>{children}</>;
};
