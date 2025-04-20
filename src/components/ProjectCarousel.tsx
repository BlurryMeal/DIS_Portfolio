import React, { useState, useEffect } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { motion, AnimatePresence } from "framer-motion";
import { ExternalLink, Heart, Share2 } from "lucide-react";
import { toast } from "sonner";

interface Project {
  id: number;
  title: string;
  description: string;
  image: string;
  tags: string[];
  demoUrl: string;
  websiteUrl: string;
  client?: string;
}

interface ProjectCarouselProps {
  projects: Project[];
  setApi?: (api: any) => void;
}

export function ProjectCarousel({ projects, setApi }: ProjectCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);
  const [api, setApiInternal] = useState<any>(null);
  const [favorites, setFavorites] = useState<number[]>([]);

  // Pass API to parent component if requested
  useEffect(() => {
    if (api && setApi) {
      setApi(api);
    }
  }, [api, setApi]);

  // Updated handler to work with Embla Carousel API
  const handleSelectChange = (api: any) => {
    if (!api) return;
    const index = api.selectedScrollSnap();
    setActiveIndex(index || 0);
    
    // Create subtle movement effect on page change
    const moveElements = document.querySelectorAll('.move-on-carousel-change');
    moveElements.forEach(el => {
      el.classList.add('animate-slight-move');
      setTimeout(() => el.classList.remove('animate-slight-move'), 500);
    });
  };

  // Update active index whenever the API changes slides
  useEffect(() => {
    if (!api) return;
    
    api.on("select", handleSelectChange);
    
    // Initial setting
    handleSelectChange(api);
    
    return () => {
      api.off("select", handleSelectChange);
    };
  }, [api]);

  // Calculate the number of sections for the indicators
  const totalSections = Math.ceil(projects.length / 3);
  
  // Toggle favorite status
  const toggleFavorite = (projectId: number, e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    
    if (favorites.includes(projectId)) {
      setFavorites(favorites.filter(id => id !== projectId));
      toast.info("Removed from favorites", { position: "bottom-right" });
    } else {
      setFavorites([...favorites, projectId]);
      toast.success("Added to favorites", { position: "bottom-right" });
    }
  };
  
  // Simulate sharing
  const shareProject = (project: Project, e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    
    // Copy URL to clipboard simulation
    navigator.clipboard.writeText(project.demoUrl)
      .then(() => {
        toast.success(`Link for ${project.title} copied to clipboard!`, {
          position: "bottom-right",
          duration: 3000,
        });
      })
      .catch(() => {
        toast.error("Failed to copy link", { position: "bottom-right" });
      });
  };
  
  // Add a subtle hover sound effect
  const playHoverSound = () => {
    const audio = new Audio();
    audio.volume = 0.05;
    try {
      audio.play();
    } catch (e) {
      // Browser may block autoplay without user interaction
    }
  };

  return (
    <div className="h-[calc(100vh-14rem)] flex items-center overflow-hidden">
      <Carousel
        className="w-full"
        opts={{
          loop: true,
          align: "start",
          dragFree: false,
        }}
        setApi={setApiInternal}
      >
        <CarouselContent className="-ml-4">
          {projects.map((project, index) => (
            <CarouselItem 
              key={project.id} 
              className="pl-4 md:basis-1/3 lg:basis-1/3"
            >
              <motion.div
                className="relative h-[60vh] w-full rounded-sm overflow-hidden group"
                onMouseEnter={() => {
                  setHoverIndex(index);
                  playHoverSound();
                }}
                onMouseLeave={() => setHoverIndex(null)}
                whileHover={{ 
                  y: -5,
                  transition: { type: "spring", stiffness: 300, damping: 20 }
                }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                <motion.img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover transition-all duration-500"
                  whileHover={{ scale: 1.05 }}
                />
                
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent transition-opacity duration-300"></div>

                <div className="absolute inset-x-0 bottom-0 p-6 text-white z-10">
                  <div className="mb-2 flex justify-between items-end">
                    <h2 className="font-mono uppercase tracking-wider text-xs">
                      Website:
                    </h2>
                    <p className="font-mono text-xs">{project.websiteUrl}</p>
                  </div>
                  
                  {project.client && (
                    <div className="mb-4 flex justify-between items-center">
                      <h3 className="font-mono uppercase tracking-wider text-xs">Client:</h3>
                      <p className="font-mono text-xs">{project.client}</p>
                    </div>
                  )}
                </div>

                <motion.div
                  className="absolute inset-0 flex flex-col justify-center items-center text-white p-8 z-20"
                  initial={{ opacity: 0 }}
                  animate={{ 
                    opacity: hoverIndex === index ? 1 : 0,
                    y: hoverIndex === index ? 0 : 20
                  }}
                  transition={{ duration: 0.3 }}
                >
                  <h2 className="text-4xl font-mono uppercase tracking-wider mb-4 text-center move-on-carousel-change">
                    {project.title}
                  </h2>
                  <p className="text-sm text-center max-w-md mb-6 move-on-carousel-change">
                    {project.description}
                  </p>
                  
                  <div className="flex gap-3">
                    <motion.a 
                      href={project.demoUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-colors rounded-sm font-mono uppercase tracking-widest text-xs"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      View Project <ExternalLink size={14} />
                    </motion.a>
                    
                    <motion.button
                      className={`p-2 rounded-full ${
                        favorites.includes(project.id) 
                        ? "bg-red-500/80 text-white" 
                        : "bg-white/10 text-white hover:bg-white/20"
                      }`}
                      onClick={(e) => toggleFavorite(project.id, e)}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <Heart size={16} fill={favorites.includes(project.id) ? "white" : "none"} />
                    </motion.button>
                    
                    <motion.button
                      className="p-2 rounded-full bg-white/10 text-white hover:bg-white/20"
                      onClick={(e) => shareProject(project, e)}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <Share2 size={16} />
                    </motion.button>
                  </div>
                </motion.div>
              </motion.div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </div>
  );
}
