
import { motion } from "framer-motion";
import { ReactNode, useEffect } from "react";
import { useLocation } from "react-router-dom";

interface PageTransitionProps {
  children: ReactNode;
}

export function PageTransition({ children }: PageTransitionProps) {
  const location = useLocation();
  
  // Play subtle page transition sound
  useEffect(() => {
    const audio = new Audio("/page-transition.mp3");
    audio.volume = 0.1;
    audio.play().catch(() => {
      // Silent catch - browsers may block autoplay
    });
  }, [location.pathname]);

  return (
    <motion.div
      key={location.pathname}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ 
        duration: 0.4,
        ease: [0.22, 1, 0.36, 1]
      }}
      className="min-h-screen pt-16"
    >
      {children}
    </motion.div>
  );
}
