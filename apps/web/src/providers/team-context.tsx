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
}

const TeamContext = createContext<TeamContextType | undefined>(undefined);

export function TeamProvider({ children }: { children: React.ReactNode }) {
  const { data: teams, status } = api.team.getTeams.useQuery();

  const value = {
    currentTeam: teams?.[0] ?? null,
    teams: teams || [],
    isLoading: status === "pending",
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
