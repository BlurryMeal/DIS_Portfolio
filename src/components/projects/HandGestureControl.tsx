
import React from 'react';
import { useHandGestureControl } from '@/hooks/useHandGestureControl';
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Camera, CameraOff, Hand } from "lucide-react";

interface HandGestureControlProps {
  onLeftGesture: () => void;
  onRightGesture: () => void;
  enabled: boolean;
  onToggle: () => void;
}

export function HandGestureControl({ 
  onLeftGesture, 
  onRightGesture, 
  enabled,
  onToggle
}: HandGestureControlProps) {
  const { videoRef, canvasRef, isActive } = useHandGestureControl({
    onLeftGesture,
    onRightGesture,
    enabled
  });

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className="flex flex-col items-end space-y-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          className="relative bg-black/20 backdrop-blur-md p-2 rounded-lg shadow-lg"
          style={{ display: enabled ? 'block' : 'none' }}
        >
          <div className="relative w-[160px] h-[120px] overflow-hidden rounded-md">
            <video 
              ref={videoRef} 
              autoPlay 
              playsInline 
              muted 
              className="absolute inset-0 w-full h-full object-cover"
            />
            <canvas 
              ref={canvasRef} 
              className="absolute inset-0 w-full h-full"
            />
            {!isActive && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/50 text-white text-sm">
                Waiting for camera...
              </div>
            )}
          </div>
          <div className="absolute top-1 right-1">
            <div className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground">
              <Hand size={12} />
            </div>
          </div>
        </motion.div>
        
        <Button 
          variant="outline" 
          size="icon" 
          className="rounded-full shadow-md"
          onClick={onToggle}
        >
          {enabled ? <CameraOff size={18} /> : <Camera size={18} />}
        </Button>
      </div>
    </div>
  );
}
