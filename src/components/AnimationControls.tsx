
import React from 'react';
import { Button } from "@/components/ui/button";
import { Rocket, Zap, CircleSlash } from "lucide-react";
import { motion } from "framer-motion";
import { useIsMobile } from "@/hooks/use-mobile";

interface AnimationControlsProps {
  onMeteorStrike: () => void;
  onPulseWave: () => void;
  onOrbitReversal: () => void;
}

export const AnimationControls = ({ onMeteorStrike, onPulseWave, onOrbitReversal }: AnimationControlsProps) => {
  const isMobile = useIsMobile();
  
  return (
    <motion.div 
      className="fixed bottom-8 left-0 right-0 flex justify-center w-full px-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className={`flex ${isMobile ? 'flex-col' : 'flex-row'} gap-3 justify-center items-center max-w-sm mx-auto`}>
        <Button
          variant="outline"
          size={isMobile ? "default" : "lg"}
          onClick={onMeteorStrike}
          className="bg-background/20 backdrop-blur-sm border-primary/20 hover:bg-background/30 w-full"
        >
          <Rocket className="mr-2" />
          {isMobile ? "Meteor" : "Meteor Strike"}
        </Button>
        
        <Button
          variant="outline"
          size={isMobile ? "default" : "lg"}
          onClick={onPulseWave}
          className="bg-background/20 backdrop-blur-sm border-primary/20 hover:bg-background/30 w-full"
        >
          <Zap className="mr-2" />
          {isMobile ? "Pulse" : "Energy Pulse"}
        </Button>
        
        <Button
          variant="outline"
          size={isMobile ? "default" : "lg"}
          onClick={onOrbitReversal}
          className="bg-background/20 backdrop-blur-sm border-primary/20 hover:bg-background/30 w-full"
        >
          <CircleSlash className="mr-2" />
          {isMobile ? "Chaos" : "Orbit Chaos"}
        </Button>
      </div>
    </motion.div>
  );
};
