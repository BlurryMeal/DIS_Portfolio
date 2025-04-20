
import { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink, Github, Volume2 } from "lucide-react";

interface ProjectCard3DProps {
  project: {
    id: number;
    title: string;
    description: string;
    image: string;
    tags: string[];
    demoUrl: string;
    githubUrl: string;
  };
}

export function ProjectCard3D({ project }: ProjectCard3DProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    
    const card = cardRef.current;
    const rect = card.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const mouseX = e.clientX;
    const mouseY = e.clientY;
    
    // Calculate rotation based on mouse position relative to card center
    const rotateY = ((mouseX - centerX) / (rect.width / 2)) * 10;
    const rotateX = ((centerY - mouseY) / (rect.height / 2)) * 10;
    
    setRotateX(rotateX);
    setRotateY(rotateY);
    
    // Play subtle hover sound on significant movement
    if (Math.abs(rotateX) > 5 || Math.abs(rotateY) > 5) {
      const audio = new Audio("/hover-sound.mp3");
      audio.volume = 0.05;
      audio.play().catch(() => {
        // Silent catch - browsers may block autoplay
      });
    }
  };
  
  const resetRotation = () => {
    setRotateX(0);
    setRotateY(0);
    setIsHovered(false);
  };

  useEffect(() => {
    // Create audio context for haptic feedback simulation on mobile
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    
    return () => {
      if (audioContext.state !== 'closed') {
        audioContext.close();
      }
    };
  }, []);

  // Optional: Generate QR code for physical/digital connection
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(project.demoUrl)}`;

  return (
    <motion.div
      ref={cardRef}
      className="perspective-1000"
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={resetRotation}
      whileHover={{ z: 20 }}
    >
      <motion.div
        style={{
          rotateX: rotateX,
          rotateY: rotateY,
          transformStyle: "preserve-3d",
        }}
        animate={{
          rotateX: rotateX,
          rotateY: rotateY,
          z: isHovered ? 20 : 0,
        }}
        transition={{
          type: "spring",
          stiffness: 300,
          damping: 20,
        }}
        className="w-full h-full"
      >
        <Card className="overflow-hidden transition-all hover:shadow-lg animate-fade-in h-full">
          <div className="relative aspect-video w-full overflow-hidden">
            <img 
              src={project.image} 
              alt={project.title} 
              className="w-full h-full object-cover transition-transform hover:scale-105 duration-500"
            />
            {isHovered && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="absolute bottom-2 right-2"
              >
                <div className="bg-black/70 text-white p-1 rounded-md text-xs flex items-center">
                  <Volume2 className="h-3 w-3 mr-1" />
                  <span>3D Enabled</span>
                </div>
              </motion.div>
            )}
          </div>
          
          <CardHeader>
            <CardTitle>{project.title}</CardTitle>
            <CardDescription>{project.description}</CardDescription>
          </CardHeader>
          
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {project.tags.map(tag => (
                <span key={tag} className="px-2 py-1 bg-secondary text-secondary-foreground rounded-md text-xs">
                  {tag}
                </span>
              ))}
            </div>
            {isHovered && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-3 p-2 border border-dashed border-muted-foreground/30 rounded flex justify-center"
              >
                <img src={qrCodeUrl} alt="QR Code" className="h-16 w-16" />
              </motion.div>
            )}
          </CardContent>
          
          <CardFooter className="flex gap-2">
            <Button asChild variant="outline" size="sm">
              <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                <Github className="mr-2 h-4 w-4" /> Code
              </a>
            </Button>
            <Button asChild size="sm">
              <a href={project.demoUrl} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="mr-2 h-4 w-4" /> Live Demo
              </a>
            </Button>
          </CardFooter>
        </Card>
      </motion.div>
    </motion.div>
  );
}
