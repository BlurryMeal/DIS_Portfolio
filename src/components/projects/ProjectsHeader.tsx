
import React from "react";
import { motion } from "framer-motion";
import { Separator } from "@/components/ui/separator";
import { ArrowDownCircle, Palette, Sparkles, Hand } from "lucide-react";
import { toast } from "sonner";

interface ProjectsHeaderProps {
  isGlowEnabled: boolean;
  toggleGlowEffect: () => void;
  theme: string;
  gestureControlEnabled: boolean;
  toggleGestureControl: () => void;
}

export function ProjectsHeader({ 
  isGlowEnabled, 
  toggleGlowEffect, 
  theme, 
  gestureControlEnabled,
  toggleGestureControl 
}: ProjectsHeaderProps) {
  return (
    <header className="pt-24 pb-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-mono uppercase tracking-wider text-sm">
          Selected Projects
        </h1>
        
        <div className="flex items-center gap-2">
          
          <motion.button 
            className="p-2 bg-primary/10 hover:bg-primary/20 rounded-full transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={toggleGestureControl}
            title={gestureControlEnabled ? "Disable hand gesture control" : "Enable hand gesture control"}
          >
            <Hand size={18} className="text-primary" />
          </motion.button>
          
          <motion.button 
            className="p-2 bg-primary/10 hover:bg-primary/20 rounded-full transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              const colorNames = {
                dark: "Dark",
                light: "Light",
                spring: "Spring"
              };
              toast.success(`Currently in ${colorNames[theme as keyof typeof colorNames]} mode. Try the theme toggle in the navbar!`, { 
                position: "bottom-right",
                duration: 3000
              });
            }}
            title="Theme info"
          >
            <Palette size={18} className="text-primary" />
          </motion.button>
        </div>
      </div>
      
      <Separator className="my-4 opacity-50" />
    </header>
  );
}
