
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export function CustomCursor() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [clicked, setClicked] = useState(false);
  const [linkHovered, setLinkHovered] = useState(false);
  const [hidden, setHidden] = useState(true); // Hide cursor until mouse moves
  
  useEffect(() => {
    // Show cursor when mouse first moves
    const onFirstMouseMove = () => {
      setHidden(false);
      window.removeEventListener('mousemove', onFirstMouseMove);
    };
    
    window.addEventListener('mousemove', onFirstMouseMove);
    
    // Track mouse position
    const onMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };
    
    // Mouse events for animation states
    const onMouseDown = () => setClicked(true);
    const onMouseUp = () => setClicked(false);
    
    // Handle link and button hovers
    const onLinkHoverStart = () => setLinkHovered(true);
    const onLinkHoverEnd = () => setLinkHovered(false);
    
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mouseup', onMouseUp);
    
    // Find all interactive elements and add hover listeners
    const interactiveElements = document.querySelectorAll('a, button, [role="button"], input, textarea, select, .hover-effect');
    
    interactiveElements.forEach((el) => {
      el.addEventListener('mouseenter', onLinkHoverStart);
      el.addEventListener('mouseleave', onLinkHoverEnd);
    });
    
    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mouseup', onMouseUp);
      window.removeEventListener('mousemove', onFirstMouseMove);
      
      interactiveElements.forEach((el) => {
        el.removeEventListener('mouseenter', onLinkHoverStart);
        el.removeEventListener('mouseleave', onLinkHoverEnd);
      });
    };
  }, []);
  
  // Hide cursor on mobile devices
  useEffect(() => {
    const checkMobile = () => {
      if (window.innerWidth < 768) {
        setHidden(true);
      } else {
        setHidden(false);
      }
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  
  if (hidden) return null;
  
  return (
    <>
      {/* Outer cursor (larger circle) */}
      <motion.div
        className={cn(
          "fixed top-0 left-0 w-10 h-10 rounded-full pointer-events-none z-[9999] mix-blend-difference",
          linkHovered ? "bg-white/0 border-2 border-white w-14 h-14" : "bg-white/30 backdrop-blur-sm",
          clicked ? "scale-90" : "scale-100"
        )}
        animate={{
          x: position.x - 20, // Center the 40px cursor
          y: position.y - 20,
          transition: { 
            type: "spring", 
            damping: 25, 
            stiffness: 300,
            mass: 0.5
          }
        }}
      />
      
      {/* Inner cursor (small dot) */}
      <motion.div
        className={cn(
          "fixed top-0 left-0 w-3 h-3 bg-white rounded-full pointer-events-none z-[9999] mix-blend-difference",
          clicked ? "scale-150 opacity-70" : "scale-100 opacity-100"
        )}
        animate={{
          x: position.x - 6, // Center the 12px dot
          y: position.y - 6,
          transition: { 
            type: "spring", 
            damping: 40, 
            stiffness: 500,
            mass: 0.3
          }
        }}
      />
    </>
  );
}
