import React, { useState, useEffect } from "react";
import { PageTransition } from "@/components/PageTransition";
import { motion } from "framer-motion";
import { ProjectCarousel } from "@/components/ProjectCarousel";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { useTheme } from "@/components/ThemeProvider";
import { ProjectFilters } from "@/components/projects/ProjectFilters";
import { ProjectsHeader } from "@/components/projects/ProjectsHeader";
import { ProjectScrollPrompt } from "@/components/projects/ProjectScrollPrompt";
import { CarouselNavigation } from "@/components/projects/CarouselNavigation";
import { HandGestureControl } from "@/components/projects/HandGestureControl";

const projects = [
  {
    id: 1,
    title: "CiPD UX Research",
    description: "Centre of Intelligent Product Development Course Design",
    image: "/6.png",
    tags: ["Research", "UX", "Design"],
    demoUrl: "https://www.behance.net/gallery/216658499/Design-Research-for-CiPD",
    websiteUrl: "behance.net/sagargupta7",
    client: "CiPD IIITD"
  },
  {
    id: 2,
    title: "Public Spitting Research",
    description: "Explored the socio-cultural dynamics and environmental impact of the spitting problem in India and designed solutions to tackle the issue.",
    image: "/7.png",
    tags: ["Research", "UX", "Design"],
    demoUrl: "https://www.behance.net/gallery/216658753/Research-on-Indian-Public-Spitting-Crisis",
    websiteUrl: "behance.net/sagargupta7"
  },
  {
    id: 3,
    title: "Roadway UX Research",
    description: "The Project had the goal to identify problems faced by different stakeholders while traversing the road by conducting qualitative and quantitative methods of data collection",
    image: "/8.png",
    tags: ["Research", "UX", "Ideation"],
    demoUrl: "https://www.behance.net/gallery/209302063/College-Roadway-Research-Project",
    websiteUrl: "behance.net/sagargupta7"
  },
  {
    id: 4,
    title: "HomeBound UX Design",
    description: "HomeBound is an application which allows users to find a safe path from their  current location to their destination by avoiding low network areas, low lighting areas and danger zones.",
    image: "/10.png",
    tags: ["Design", "UX", "Figma", "App"],
    demoUrl: "https://www.behance.net/gallery/185461555/HomeBound",
    websiteUrl: "behance.net/sagargupta7"
  },
  {
    id: 5,
    title: "NeuroBridge UX Design",
    description: "Designed an intuitive interface for Neurobridge Minsky’s Gen AI platform, enabling organizations to transform data into secure knowledge bases and streamline decision-making processes.",
    image: "/11.png",
    tags: ["Design", "UX", "Figma", "Website"],
    demoUrl: "https://neurobridge.tech/",
    websiteUrl: "neurobridge.tech",
    client: "NeuroBridge"
  },
  {
    id: 6,
    title: "App UI Designs",
    description: "A collection of App UI Designs that i have worked on over the years.",
    image: "/12.png",
    tags: ["Design", "UI", "Figma", "App"],
    demoUrl: "https://www.instagram.com/pica.ui/",
    websiteUrl: "instagram.com/pica.ui"
  },
  {
    id: 7,
    title: "L.Ink Brand Profile",
    description: "L.ink is an application that empowers tattoo artists around the world to showcase their different designs and styles.",
    image: "/13.png",
    tags: ["Hackathon", "Design", "Branding"],
    demoUrl: "https://www.behance.net/gallery/156207173/LInk-Expressing-yourself-Differently",
    websiteUrl: "behance.net/sagargupta7"
  },
  {
    id: 8,
    title: "Sanskriti Brand Profile",
    description: "Our aim is to empower talented individuals via an app to earn a livelihood independently and gain access to the opportunities that they may have missed out.",
    image: "/14.png",
    tags: ["Hackathon", "Design", "Branding"],
    demoUrl: "https://www.behance.net/gallery/150292813/Sanskrti-Becho-Seekho-Badho",
    websiteUrl: "behance.net/sagargupta7"
  },
  {
    id: 9,
    title: "Susta Brand Profile",
    description: "Japan-inspired shoe manufacturing company following the idea of creating affordable yet comfortable and sustainable products.",
    image: "/15.png",
    tags: ["Hackathon", "Design", "Branding"],
    demoUrl: "https://www.behance.net/gallery/150087403/SusTa-Sustainable-Joota",
    websiteUrl: "behance.net/sagargupta7"
  },
];

export default function Projects() {
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [isGlowEnabled, setIsGlowEnabled] = useState(false);
  const { theme } = useTheme();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [currentSection, setCurrentSection] = useState(0);
  const [carouselApi, setCarouselApi] = useState<any>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [gestureControlEnabled, setGestureControlEnabled] = useState(false);
  
  const handleMouseMove = (e: React.MouseEvent) => {
    setMousePosition({ x: e.clientX, y: e.clientY });
  };

  const allTags = Array.from(
    new Set(projects.flatMap(project => project.tags))
  ).sort();

  const toggleGlowEffect = () => {
    setIsGlowEnabled(!isGlowEnabled);
    toast.success(
      isGlowEnabled ? "Glow effect disabled" : "Glow effect enabled",
      { position: "bottom-right" }
    );
  };
  
  const toggleGestureControl = () => {
    const newState = !gestureControlEnabled;
    setGestureControlEnabled(newState);
    toast.success(
      newState ? "Hand gesture control enabled" : "Hand gesture control disabled", 
      { position: "bottom-right" }
    );
  };

  useEffect(() => {
    if (carouselApi) {
      const handleSelect = () => {
        setActiveIndex(carouselApi.selectedScrollSnap());
      };
      
      carouselApi.on("select", handleSelect);
      handleSelect();
      
      (window as any).carouselApi = carouselApi;
      
      return () => {
        carouselApi.off("select", handleSelect);
        if ((window as any).carouselApi === carouselApi) {
          (window as any).carouselApi = undefined;
        }
      };
    }
  }, [carouselApi]);

  const totalSections = Math.ceil(projects.length / 3);

  const goToPrevSection = () => {
    setCurrentSection(prev => {
      const newSection = prev > 0 ? prev - 1 : totalSections - 1;
      if (carouselApi) {
        carouselApi.scrollTo(newSection * 3);
      }
      return newSection;
    });
  };

  const goToNextSection = () => {
    setCurrentSection(prev => {
      const newSection = prev < totalSections - 1 ? prev + 1 : 0;
      if (carouselApi) {
        carouselApi.scrollTo(newSection * 3);
      }
      return newSection;
    });
  };

  const filteredProjects = selectedTag 
    ? projects.filter(project => project.tags.includes(selectedTag)) 
    : projects;

  return (
    <PageTransition>
      <div 
        className="min-h-screen bg-background text-foreground overflow-hidden"
        onMouseMove={handleMouseMove}
      >
        {isGlowEnabled && (
          <motion.div 
            className="fixed h-64 w-64 rounded-full bg-primary/5 backdrop-blur-3xl pointer-events-none z-10" 
            animate={{
              x: mousePosition.x - 128,
              y: mousePosition.y - 128,
            }}
            transition={{ type: "spring", damping: 15 }}
          />
        )}
        
        <div className="container mx-auto flex flex-col h-screen relative">
          <ProjectsHeader 
            isGlowEnabled={isGlowEnabled}
            toggleGlowEffect={toggleGlowEffect}
            theme={theme}
            gestureControlEnabled={gestureControlEnabled}
            toggleGestureControl={toggleGestureControl}
          />
          
          <ProjectFilters 
            allTags={allTags}
            selectedTag={selectedTag}
            onSelectTag={setSelectedTag}
          />
          
          <ProjectScrollPrompt />
          
          <div className="flex-1 overflow-hidden relative">
            <div className="absolute inset-0 bg-grid-pattern opacity-5 pointer-events-none"></div>
            
            <ProjectCarousel 
              projects={filteredProjects} 
              setApi={setCarouselApi}
            />
            
            <CarouselNavigation 
              currentSection={currentSection}
              totalSections={totalSections}
              goToPrevSection={goToPrevSection}
              goToNextSection={goToNextSection}
              activeIndex={activeIndex}
              api={carouselApi}
            />
          </div>
        </div>
        
        <HandGestureControl
          onLeftGesture={goToPrevSection}
          onRightGesture={goToNextSection}
          enabled={gestureControlEnabled}
          onToggle={toggleGestureControl}
        />
      </div>
    </PageTransition>
  );
}
