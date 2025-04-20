import { PageTransition } from "@/components/PageTransition";
import { useState } from "react";
import { ChevronDown, ChevronUp, Sparkles, Laugh, Music, Volume2, VolumeX } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Checkbox } from "@/components/ui/checkbox";

export default function About() {
  const [skillLevels, setSkillLevels] = useState({
    "Full Stack Development": 85,
    "UX Design": 80,
    "Unity 3D": 75,
    "VR/AR": 70,
    "Product Design": 90,
    "Graphic Design": 65,
  });
  
  const [playingSoundtrack, setPlayingSoundtrack] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [activeBadges, setActiveBadges] = useState<string[]>([]);
  
  const { toast } = useToast();
  
  const toggleSoundtrack = () => {
    if (!soundEnabled) {
      toast({
        title: "Sound is disabled",
        description: "Enable sound first to play the soundtrack",
      });
      return;
    }
    
    setPlayingSoundtrack(!playingSoundtrack);
    
    const audio = new Audio("/ambient-sound.mp3");
    
    if (!playingSoundtrack) {
      audio.volume = 0.1;
      audio.loop = true;
      audio.play().catch((err) => {
        console.error("Error playing audio:", err);
        toast({
          title: "Couldn't play audio",
          description: "Your browser might be blocking autoplay",
          variant: "destructive",
        });
      });
    } else {
      audio.pause();
    }
  };
  
  const toggleSound = () => {
    setSoundEnabled(!soundEnabled);
    
    if (!soundEnabled) {
      const testSound = new Audio("/click-sound.mp3");
      testSound.volume = 0.2;
      testSound.play().catch((err) => {
        console.error("Error playing test sound:", err);
        toast({
          title: "Sound test failed",
          description: "Your browser might be blocking audio playback",
          variant: "destructive",
        });
      });
    }
    
    toast({
      title: soundEnabled ? "Sound disabled" : "Sound enabled",
      description: soundEnabled ? "All sound effects are now off" : "You'll now hear sound effects",
    });
  };
  
  const playClickSound = () => {
    if (!soundEnabled) return;
    
    const clickSound = new Audio("/click-sound.mp3");
    clickSound.volume = 0.2;
    clickSound.play().catch(() => {
      // Silent catch - we already warned the user if audio fails
    });
  };
  
  const incrementLike = () => {
    setLikeCount(likeCount + 1);
    playClickSound();
    
    if (likeCount === 0) {
      toast({
        title: "Thanks for the like!",
        description: "I appreciate your support",
      });
    } else if (likeCount === 4) {
      toast({
        title: "Wow, 5 likes!",
        description: "You must really like my profile 💖",
      });
    } else if (likeCount === 9) {
      toast({
        title: "10 likes milestone!",
        description: "You've unlocked a secret: I love pineapple on pizza 🍕",
      });
    }
  };
  
  const handleSkillChange = (skill: string, value: number[]) => {
    setSkillLevels({
      ...skillLevels,
      [skill]: value[0],
    });
    playClickSound();
  };
  
  const toggleBadge = (badge: string) => {
    setActiveBadges((prev) => 
      prev.includes(badge) 
        ? prev.filter(b => b !== badge) 
        : [...prev, badge]
    );
    playClickSound();
  };
  
  return (
    <PageTransition>
      <div className="page-container">
        <h1 className="section-title">About Me</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-4 animate-slide-in">
            <p>
              Hello! I'm Sagar, a passionate UX Designer with 3+ years of experience
              building exceptional digital experiences. I enjoy creating elegant solutions
              that combine clean interactions with beautiful interfaces.
            </p>
            
            <p>
            Ambitious and detail-oriented Computer Science and Design student with a strong foundation in UX/UI design, coding, and graphic design. 
            Experienced in working on freelance projects, internships, and collaborative designathons. 
            </p>
            
            <div className="mt-6 flex items-center justify-between">
              <h2 className="text-xl font-semibold">My Skills</h2>
              
              <div className="flex items-center gap-3">
                <button 
                  onClick={toggleSound}
                  className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  {soundEnabled ? (
                    <Volume2 className="h-4 w-4" />
                  ) : (
                    <VolumeX className="h-4 w-4" />
                  )}
                  <span>{soundEnabled ? "Sound On" : "Sound Off"}</span>
                </button>
                
                <button 
                  onClick={toggleSoundtrack}
                  disabled={!soundEnabled}
                  className={`flex items-center gap-2 text-sm ${
                    !soundEnabled 
                      ? "text-muted-foreground opacity-50" 
                      : playingSoundtrack 
                        ? "text-primary" 
                        : "text-muted-foreground hover:text-foreground"
                  } transition-colors`}
                >
                  <Music className="h-4 w-4" />
                  <span>{playingSoundtrack ? "Stop Music" : "Play Music"}</span>
                </button>
              </div>
            </div>
            
            <div className="mt-4 space-y-5">
              {Object.entries(skillLevels).map(([skill, level]) => (
                <div key={skill} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">{skill}</span>
                    <span className="text-sm text-muted-foreground">{level}%</span>
                  </div>
                  <div className="w-full bg-secondary h-2 rounded-full">
                    <div 
                      className="bg-primary h-full rounded-full" 
                      style={{ width: `${level}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
            
            <Collapsible className="mt-6 border rounded-lg p-4">
              <CollapsibleTrigger asChild>
                <Button variant="ghost" className="flex justify-between w-full p-0 h-auto">
                  <span className="text-xl font-semibold">Fun Facts</span>
                  <ChevronDown className="h-5 w-5 text-muted-foreground" />
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent className="mt-4 space-y-2">
                <p className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-yellow-500" />
                  I'm a huge Manchester United fan!
                </p>
                <p className="flex items-center gap-2">
                  <Laugh className="h-4 w-4 text-green-500" />
                  I am addicted to sudoku.
                </p>
                <p className="flex items-center gap-2">
                  <Music className="h-4 w-4 text-blue-500" />
                  I love to 70s 80s rock music.
                </p>
              </CollapsibleContent>
            </Collapsible>
            
            <h2 className="text-xl font-semibold mt-6">Experience</h2>
            
            <Accordion type="single" collapsible className="border rounded-lg">
              <AccordionItem value="item-1" className="border-b-0 px-4">
                <AccordionTrigger onClick={playClickSound} className="py-4">
                  <div>
                    <h3 className="font-medium text-left">Chair</h3>
                    <p className="text-sm text-muted-foreground text-left">ACM SIGCHI IIITD • 2024 - Present</p>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pb-4">
                  <ul className="list-disc pl-5 space-y-2">
                    <li>Led the inauguration of the SIGCHI Chapter at IIITD</li>
                    <li>Led a team of likeminded enthusiasts.</li>
                    <li>Worked on UX, Graphic and Brand Design</li>
                    <li>Collaborated with UI/UX team to improve user experience</li>
                  </ul>
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="item-2" className="border-t px-4">
                <AccordionTrigger onClick={playClickSound} className="py-4">
                  <div>
                    <h3 className="font-medium text-left">Graphic Designer</h3>
                    <p className="text-sm text-muted-foreground text-left">IIIT Delhi • 2024 - 2024</p>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pb-4">
                  <ul className="list-disc pl-5 space-y-2">
                    <li>Worked on designing the B.Tech Brochure 2024</li>
                    <li>Created a modern cover design.</li>
                    <li>Collaborated with admin and academics to bring this to life.</li>
                  </ul>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-3" className="border-t px-4">
                <AccordionTrigger onClick={playClickSound} className="py-4">
                  <div>
                    <h3 className="font-medium text-left">UI/UX Designer</h3>
                    <p className="text-sm text-muted-foreground text-left">Neurobridge • 2024 - 2024</p>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pb-4">
                  <ul className="list-disc pl-5 space-y-2">
                    <li>Worked as a freelance UX Designer to create their website and dashboard.</li>
                    <li>Created a modern, futuristic design for an AI based platform.</li>
                    <li>Collaborated with developers to bring this to life.</li>
                  </ul>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-4" className="border-t px-4">
                <AccordionTrigger onClick={playClickSound} className="py-4">
                  <div>
                    <h3 className="font-medium text-left">UI/UX Design Intern</h3>
                    <p className="text-sm text-muted-foreground text-left">BugBase • 2023 - 2023</p>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pb-4">
                  <ul className="list-disc pl-5 space-y-2">
                  <li>Worked as a freelance UX Designer to create their website and dashboard.</li>
                    <li>Created a modern, futuristic design for an AI based platform.</li>
                    <li>Collaborated with developers to bring this to life.</li>
                  </ul>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          
          </div>
          
          <div className="animate-slide-in animation-delay-150">
            <motion.div 
              className="aspect-square bg-secondary rounded-xl overflow-hidden cursor-pointer relative"
              whileHover={{ scale: 1.03 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
              drag
              dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
              dragElastic={0.1}
              onClick={incrementLike}
            >
              <img 
                src= "../blurrymeal.png" 
                alt="Profile" 
                className="w-full h-full object-cover"
              />
              {likeCount > 0 && (
                <div className="absolute top-3 right-3 bg-primary text-primary-foreground text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center">
                  {likeCount}
                </div>
              )}
              <div className="absolute bottom-3 right-3 opacity-70 text-xs">
                <span className="bg-black/50 text-white px-2 py-1 rounded-md backdrop-blur-sm">
                  Click & Drag Me!
                </span>
              </div>
            </motion.div>
            
            <div className="mt-6 space-y-3">
              <h3 className="font-medium">Contact Details</h3>
              <p className="text-sm">sagarg2606@gmail.com</p>
              <p className="text-sm">Based in New Delhi, India</p>
              
              <Card className="mt-4">
                <CardContent className="p-4">
                  <h4 className="font-medium mb-2">Skills Badge Collection</h4>
                  <p className="text-xs text-muted-foreground mb-3">Click to toggle the badges you identify with:</p>
                  
                  <div className="flex flex-wrap gap-2">
                    {["Problem Solver", "Team Player", "Fast Learner", "Creative", "Detail-Oriented"].map((badge) => (
                      <div
                        key={badge}
                        onClick={() => toggleBadge(badge)}
                        className={`px-3 py-1.5 text-xs rounded-full cursor-pointer transition-all ${
                          activeBadges.includes(badge)
                            ? "bg-primary text-primary-foreground"
                            : "bg-secondary text-secondary-foreground"
                        }`}
                      >
                        {badge}
                      </div>
                    ))}
                  </div>
                  
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
