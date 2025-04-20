
import { Moon, Sun, Flower } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/components/ThemeProvider";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  
  // Only show the toggle after component mounts to avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  const handleThemeChange = (newTheme: "light" | "dark" | "spring") => {
    console.log("Current theme:", theme);
    console.log("New theme:", newTheme);
    
    // Set user's explicit preference
    localStorage.setItem("theme-preference", newTheme);
    
    setTheme(newTheme);
    
    // Show a toast notification for better user feedback
    toast(`Switched to ${newTheme} mode`, {
      position: "bottom-right",
      duration: 2000,
    });
  };

  // Don't render anything until component has mounted
  if (!mounted) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full transition-colors duration-300"
          aria-label="Toggle theme"
        >
          <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all duration-300 dark:scale-0 spring:scale-0" />
          <Moon className="absolute h-[1.2rem] w-[1.2rem] scale-0 transition-all duration-300 dark:rotate-0 dark:scale-100 spring:scale-0" />
          <Flower className="absolute h-[1.2rem] w-[1.2rem] scale-0 transition-all duration-300 spring:rotate-0 spring:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => handleThemeChange("light")}>
          <Sun className="mr-2 h-4 w-4" />
          <span>Light</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleThemeChange("dark")}>
          <Moon className="mr-2 h-4 w-4" />
          <span>Dark</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleThemeChange("spring")}>
          <Flower className="mr-2 h-4 w-4" />
          <span>Spring</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
