import { Select, SelectContent, SelectItem, SelectTrigger } from "@unsend/ui/src/select";
import { Group } from "lucide-react";
import { useTeam } from "~/providers/team-context";

export const ChangeTeam = () => {
    const { currentTeam, teams, selectTeam } = useTeam()

    return (
    <>
      <Select
      value={String(currentTeam?.id || teams[0]?.id || 0)}
      onValueChange={(val) => {
        selectTeam(Number(val));
      }}
    >
      <SelectTrigger className="w-full">
      <Group className="h-4 w-4" /> {currentTeam?.name ?? 'Change Team'}
      </SelectTrigger>
      <SelectContent>
        {teams?.map((team) => (
          <SelectItem key={team.id} value={String(team.id)}>
            {team.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select></>
    );
  };