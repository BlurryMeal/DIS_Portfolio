
import React from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CarouselNavigationProps {
  currentSection: number;
  totalSections: number;
  goToPrevSection: () => void;
  goToNextSection: () => void;
  activeIndex: number;
  api: any;
}

export function CarouselNavigation({ 
  currentSection, 
  totalSections, 
  goToPrevSection, 
  goToNextSection,
  activeIndex,
  api
}: CarouselNavigationProps) {
  return (
    <div className="flex flex-col items-center gap-6 mt-4 pb-6">
      {/* Carousel indicators */}
      <div className="flex items-center">
        {Array.from({ length: totalSections }).map((_, index) => (
          <motion.button 
            key={index}
            onClick={() => api?.scrollTo(index * 3)}
            className={`carousel-indicator h-1 w-6 mx-1 rounded-full transition-all ${
              Math.floor(activeIndex / 3) === index ? "bg-primary" : "bg-primary/30"
            }`}
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
            aria-label={`Go to section ${index + 1}`}
          />
        ))}
      </div>
      
      {/* Carousel navigation arrows (more prominent below) */}
      <div className="flex gap-8 items-center">
        <motion.div
          whileHover={{ scale: 1.1, x: -3 }}
          whileTap={{ scale: 0.9 }}
          className="cursor-pointer"
        >
          <Button 
            variant="outline" 
            onClick={goToPrevSection}
            className="h-12 w-12 rounded-full border-primary/20 shadow-sm"
            aria-label="Previous projects"
          >
            <ArrowLeft className="text-primary h-6 w-6" />
          </Button>
        </motion.div>
        
        <motion.div
          whileHover={{ scale: 1.1, x: 3 }}
          whileTap={{ scale: 0.9 }}
          className="cursor-pointer"
        >
          <Button 
            variant="outline" 
            onClick={goToNextSection}
            className="h-12 w-12 rounded-full border-primary/20 shadow-sm"
            aria-label="Next projects"
          >
            <ArrowRight className="text-primary h-6 w-6" />
          </Button>
        </motion.div>
      </div>
    </div>
  );
}
