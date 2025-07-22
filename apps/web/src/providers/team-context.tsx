"use client";

import { useQueryClient } from "@tanstack/react-query";
import { getQueryClient } from "@trpc/react-query/shared";
import Cookies from "js-cookie";
import { createContext, useContext, useState, useEffect } from "react";
import { api } from "~/trpc/react";

// Define the Team type based on the Prisma schema
type Team = {
  id: number;
  name: string;
  createdAt: Date;
  updatedAt: Date;
  plan: "FREE" | "BASIC";
  stripeCustomerId?: string | null;
  billingEmail?: string | null;
  teamUsers: {
    role: "ADMIN" | "MEMBER";
  }[]
};

interface TeamContextType {
  currentTeam: Team | null;
  teams: Team[];
  isLoading: boolean;
  currentRole: "ADMIN" | "MEMBER";
  currentIsAdmin: boolean;
  selectTeam: (teamId: number) => void
}

const TeamContext = createContext<TeamContextType | undefined>(undefined);

export function TeamProvider({ children }: { children: React.ReactNode }) {
  const { data: teams, status } = api.team.getTeams.useQuery();
  const client = useQueryClient()

  const [currentTeam, setCurrentTeam] = useState<Team | null>(null)

  function selectTeam(teamId: number){
    const teamFounded = teams?.find(team => team.id === teamId);

    Cookies.set('unsendTeamId', String(teamId), { expires: 7, path: "/", sameSite: "lax"  })
    client.resetQueries();

    if(teamFounded) setCurrentTeam(teamFounded)
  }

  useEffect(() => {
    if (teams && teams.length > 0) {
      const savedTeamId = Cookies.get("unsendTeamId");

      if (savedTeamId) {
        const teamFromCookie = teams.find((team) => team.id === parseInt(savedTeamId));
        setCurrentTeam(teamFromCookie ?? teams[0] ?? null);
      } else {
        setCurrentTeam(teams[0] ?? null);
      }
    }
  }, [teams]);

  const value = {
    currentTeam,
    teams: teams || [],
    isLoading: status === "pending",
    currentRole: currentTeam?.teamUsers[0]?.role ?? "MEMBER",
    currentIsAdmin: currentTeam?.teamUsers[0]?.role === "ADMIN",
    selectTeam
  };

  return <TeamContext.Provider value={value}>{children}</TeamContext.Provider>;
}

export function useTeam() {
  const context = useContext(TeamContext);
  if (context === undefined) {
    throw new Error("useTeam must be used within a TeamProvider");
  }
  return context;
}
