import { PageTransition } from "@/components/PageTransition";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { OrbitSystem } from "@/components/OrbitSystem";
import { AnimationControls } from "@/components/AnimationControls";
import { useToast } from "@/hooks/use-toast";
import { playSound } from "@/utils/soundEffects";

export default function Home() {
  const { toast } = useToast();

  const handleMeteorStrike = () => {
    // Get a random planet index (0-6)
    const randomPlanetId = Math.floor(Math.random() * 7);
    
    // Create and position the meteor
    const meteor = document.createElement('div');
    meteor.className = 'fixed z-50 pointer-events-none';
    meteor.style.cssText = `
      width: 48px;
      height: 48px;
      background: radial-gradient(circle, #f97316 0%, transparent 70%);
      box-shadow: 0 0 30px #f97316, 0 0 60px #f97316;
      filter: blur(2px);
      clip-path: polygon(50% 0%, 80% 50%, 50% 100%, 20% 50%);
      transform: rotate(-45deg);
    `;
    
    // Add meteor trail
    const trail = document.createElement('div');
    trail.style.cssText = `
      position: absolute;
      width: 80px;
      height: 24px;
      background: radial-gradient(circle, #fed7aa 0%, transparent 100%);
      filter: blur(5px);
      transform: rotate(-30deg) translateX(-100%);
      opacity: 0.6;
    `;
    meteor.appendChild(trail);
    
    document.body.appendChild(meteor);
    
    const targetPlanet = document.getElementById(`planet-${randomPlanetId}`);
    
    if (targetPlanet) {
      const rect = targetPlanet.getBoundingClientRect();
      const endX = rect.left + rect.width / 2;
      const endY = rect.top + rect.height / 2;
      
      // Start from top-right corner for better visual
      const startX = window.innerWidth;
      const startY = -100;
      
      meteor.style.left = `${startX}px`;
      meteor.style.top = `${startY}px`;
      
      meteor.animate(
        [
          { transform: 'rotate(-45deg) scale(1)', left: `${startX}px`, top: `${startY}px`, opacity: 0.5 },
          { transform: 'rotate(-45deg) scale(0.5)', left: `${endX}px`, top: `${endY}px`, opacity: 1, offset: 0.9 },
          { transform: 'rotate(-45deg) scale(0)', left: `${endX}px`, top: `${endY}px`, opacity: 0 }
        ],
        {
          duration: 1000,
          easing: 'ease-in'
        }
      ).onfinish = () => {
        meteor.remove();
        playSound('meteorImpact');
        document.dispatchEvent(new CustomEvent('meteorStrike', { 
          detail: { targetPlanet: randomPlanetId }
        }));
      };
    }
    
    toast({
      title: "Meteor Strike Launched",
      description: "Watch as the meteor impacts one of the orbiting planets!",
    });
  };

  const handlePulseWave = () => {
    // Create and position the energy pulse
    const pulse = document.createElement('div');
    pulse.className = 'fixed z-40 pointer-events-none rounded-full';
    pulse.style.cssText = `
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      width: 20px;
      height: 20px;
      background: radial-gradient(circle, rgba(255, 255, 255, 0.8) 0%, rgba(124, 58, 237, 0.6) 50%, transparent 70%);
      box-shadow: 0 0 20px rgba(124, 58, 237, 0.8);
    `;
    
    document.body.appendChild(pulse);
    
    // Animate pulse
    pulse.animate(
      [
        { transform: 'translate(-50%, -50%) scale(1)', opacity: 1 },
        { transform: 'translate(-50%, -50%) scale(30)', opacity: 0 }
      ],
      {
        duration: 2000,
        easing: 'ease-out'
      }
    ).onfinish = () => {
      pulse.remove();
      playSound('energyPulse');
      document.dispatchEvent(new CustomEvent('pulseWave'));
    };
    
    toast({
      title: "Energy Pulse Released",
      description: "Energy wave rippling through the system!",
    });
  };

  const handleOrbitChaos = () => {
    playSound('orbitChaos');
    document.dispatchEvent(new CustomEvent('orbitChaos'));
    toast({
      title: "Orbital Chaos Initiated",
      description: "The orbital paths are reversing and accelerating!",
    });
  };

  return (
    <PageTransition>
      <div className="container relative min-h-[100vh] flex items-center justify-center -translate-y-10">
        <div className="absolute inset-0">
          <OrbitSystem />
        </div>
        
        <div className="relative z-10 text-center max-w-3xl mx-auto px-4">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight animate-fade-in">
            Hello, I'm <span className="text-primary">Sagar G</span>.
          </h1>
          <p className="mt-6 text-xl sm:text-2xl text-muted-foreground animate-fade-in animation-delay-100">
            A passionate UX Designer creating seamless digital experiences with
            modern technologies.
          </p>
          
          <div className="mt-10 flex flex-wrap gap-4 justify-center animate-fade-in animation-delay-200">
            <Button asChild size="lg">
              <Link to="/projects">
                View Projects <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link to="/contact">Contact Me</Link>
            </Button>
          </div>
        </div>

        <AnimationControls 
          onMeteorStrike={handleMeteorStrike}
          onPulseWave={handlePulseWave}
          onOrbitReversal={handleOrbitChaos}
        />
      </div>
    </PageTransition>
  );
}
