import { cn, useTheme } from "@unsend/ui";
import { Button } from "@unsend/ui/src/button";
import { Monitor, Sun, Moon, SunMoonIcon } from "lucide-react";

export const ThemeSwitcher = () => {
  const { theme, setTheme, systemTheme } = useTheme();

  return (
    <div className="flex gap-2 items-center justify-between w-full">
      <p className="text-sm text-muted-foreground flex items-center gap-2">
        <SunMoonIcon className="h-4 w-4" />
        Theme
      </p>
      <div className="flex gap-2 border rounded-md p-0.5 ">
        <Button
          variant="ghost"
          size="sm"
          className={cn("p-0.5  h-5 w-5", theme === "system" ? "bg-muted" : "")}
          onClick={() => setTheme("system")}
        >
          <Monitor className="h-3 w-3" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className={cn(
            "p-0.5  h-5 w-5",
            theme === "light" ? " bg-gray-200" : ""
          )}
          onClick={() => setTheme("light")}
        >
          <Sun className="h-3 w-3" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className={cn("p-0.5  h-5 w-5", theme === "dark" ? "bg-muted" : "")}
          onClick={() => setTheme("dark")}
        >
          <Moon className="h-3 w-3" />
        </Button>
      </div>
    </div>
  );
};
