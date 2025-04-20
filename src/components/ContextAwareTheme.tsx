
import { useEffect, useState } from "react";
import { useTheme } from "@/components/ThemeProvider";
import { toast } from "sonner";

export function ContextAwareTheme() {
  const { theme, setTheme } = useTheme();
  const [hasAdjusted, setHasAdjusted] = useState(false);
  
  useEffect(() => {
    // Check if user has explicitly set a theme preference
    const userPreference = localStorage.getItem("theme-preference");
    
    // If the user has explicitly chosen a theme (not auto-adjusted), respect that choice
    if (userPreference && userPreference !== "auto-adjusted") {
      console.log("Respecting user theme preference:", userPreference);
      return; 
    }
    
    // Only apply auto-adjustment if we haven't done it yet
    if (hasAdjusted) return;
    
    // Auto adjust theme based on time of day
    const hour = new Date().getHours();
    let suggestedTheme;
    
    // Morning/Day: 6 AM - 4 PM (Light mode)
    if (hour >= 6 && hour < 16) {
      suggestedTheme = "light";
      toast.info("Day mode activated", {
        id: "theme-context",
        duration: 3000,
      });
    }
    // Evening: 4 PM - 7 PM (Spring mode)
    else if (hour >= 16 && hour < 19) {
      suggestedTheme = "spring";
      toast.info("Evening mode activated", {
        id: "theme-context",
        duration: 3000,
      });
    }
    // Night: 7 PM - 6 AM (Dark mode)
    else {
      suggestedTheme = "dark";
      toast.info("Night mode activated", {
        id: "theme-context",
        duration: 3000,
      });
    }
    
    setTheme(suggestedTheme);
    setHasAdjusted(true);
    
    // Mark that we've made an auto-adjustment, but preserve ability to change
    localStorage.setItem("theme-preference", "auto-adjusted");
    
  }, [setTheme, hasAdjusted]);
  
  return null; // This component doesn't render anything
}
