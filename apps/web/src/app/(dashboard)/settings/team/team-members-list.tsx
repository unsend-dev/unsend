"use client";

import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@unsend/ui/src/table";
import { api } from "~/trpc/react";
import { Button } from "@unsend/ui/src/button";
import Spinner from "@unsend/ui/src/spinner";
import { formatDistanceToNow } from "date-fns";
import { Role } from "@prisma/client";
import { EditTeamMember } from "./edit-team-member";
import { DeleteTeamMember } from "./delete-team-member";
import { ResendTeamInvite } from "./resend-team-invite";
import { DeleteTeamInvite } from "./delete-team-invite";

export default function TeamMembersList() {
  const teamUsersQuery = api.team.getTeamUsers.useQuery();
  const teamInvitesQuery = api.team.getTeamInvites.useQuery();

  // Combine team users and invites for display
  const teamMembers = teamUsersQuery.data || [];
  const pendingInvites = teamInvitesQuery.data || [];

  const isLoading = teamUsersQuery.isLoading || teamInvitesQuery.isLoading;

  return (
    <div className="mt-10 flex flex-col gap-4">
      <div className="flex flex-col rounded-xl border border-border shadow">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/30">
              <TableHead className="rounded-tl-xl">User</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Joined</TableHead>
              <TableHead className="rounded-tr-xl">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow className="h-32">
                <TableCell colSpan={5} className="text-center py-4">
                  <Spinner
                    className="w-6 h-6 mx-auto"
                    innerSvgClass="stroke-primary"
                  />
                </TableCell>
              </TableRow>
            ) : teamMembers.length > 0 ? (
              teamMembers.map((member) => (
                <TableRow key={member.userId} className="">
                  <TableCell className="font-medium">
                    {member.user?.email || "Unknown user"}
                  </TableCell>
                  <TableCell>
                    <div className=" rounded capitalize py-1 text-xs">
                      {member.role.toLowerCase()}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-center w-[100px] rounded capitalize py-1 text-xs bg-green-500/15 dark:bg-green-600/10 text-green-700 dark:text-green-600/90 border border-green-500/25 dark:border-green-700/25">
                      Active
                    </div>
                  </TableCell>
                  <TableCell>
                    {formatDistanceToNow(new Date(member.user.createdAt), {
                      addSuffix: true,
                    })}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <EditTeamMember
                        teamUser={{ ...member, userId: String(member.userId) }}
                      />
                      <DeleteTeamMember
                        teamUser={{
                          userId: String(member.userId),
                          role: member.role,
                          email: member.user?.email || "Unknown user",
                        }}
                      />
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow className="h-32">
                <TableCell colSpan={5} className="text-center py-4">
                  No team members found
                </TableCell>
              </TableRow>
            )}

            {/* Pending invites section */}
            {pendingInvites.length > 0 && (
              <>
                {pendingInvites.map((invite) => (
                  <TableRow key={invite.id} className="">
                    <TableCell className="font-medium">
                      {invite.email}
                    </TableCell>
                    <TableCell>
                      <div className=" w-[100px] rounded capitalize py-1 text-xs">
                        {invite.role.toLowerCase()}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-center w-[100px] rounded capitalize py-1 text-xs bg-yellow-500/15 dark:bg-yellow-600/10 text-yellow-700 dark:text-yellow-600/90 border border-yellow-500/25 dark:border-yellow-700/25">
                        Pending
                      </div>
                    </TableCell>
                    <TableCell>
                      {formatDistanceToNow(new Date(invite.createdAt), {
                        addSuffix: true,
                      })}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <ResendTeamInvite invite={invite} />
                        <DeleteTeamInvite invite={invite} />
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
