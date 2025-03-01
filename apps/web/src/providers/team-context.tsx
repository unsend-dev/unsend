"use client";

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
};

interface TeamContextType {
  currentTeam: Team | null;
  teams: Team[];
  isLoading: boolean;
  setCurrentTeam: (team: Team) => void;
}

const TeamContext = createContext<TeamContextType | undefined>(undefined);

export function TeamProvider({ children }: { children: React.ReactNode }) {
  const [currentTeam, setCurrentTeam] = useState<Team | null>(null);
  const { data: teams, status } = api.team.getTeams.useQuery();

  // Set the first team as the current team by default when teams are loaded
  useEffect(() => {
    if (teams && teams.length > 0 && !currentTeam) {
      setCurrentTeam(teams[0] ?? null);
    }
  }, [teams, currentTeam]);

  const value = {
    currentTeam,
    teams: teams || [],
    isLoading: status === "pending",
    setCurrentTeam,
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
