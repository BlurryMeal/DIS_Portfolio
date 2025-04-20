
import { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Circle, Moon, Star, Sun, SatelliteDish } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";

interface OrbitingPlanetProps {
  orbitRadius: number;
  rotationDuration: number;
  color: string;
  icon: 'sun' | 'moon' | 'star' | 'circle' | 'satellite';
  fact: {
    title: string;
    description: string;
  };
  initialRotation: number;
  index: number;
}

export const OrbitingPlanet = ({
  orbitRadius,
  rotationDuration,
  color,
  icon,
  fact,
  initialRotation,
  index
}: OrbitingPlanetProps) => {
  const [currentRotation, setCurrentRotation] = useState(initialRotation);
  const [trailPositions, setTrailPositions] = useState<number[]>([]);
  const [explosionEffect, setExplosionEffect] = useState(false);
  const [isReversing, setIsReversing] = useState(false);
  const [pulseEffect, setPulseEffect] = useState(false);
  const [rotationDirection, setRotationDirection] = useState(1);
  const [rotationSpeed, setRotationSpeed] = useState(1.4);
  const rotationRef = useRef(initialRotation);
  const animationRef = useRef<number | null>(null);
  const [showDialog, setShowDialog] = useState(false);
  
  const iconComponents = {
    sun: Sun,
    moon: Moon,
    star: Star,
    circle: Circle,
    satellite: SatelliteDish
  };

  const IconComponent = iconComponents[icon];

  useEffect(() => {
    const updateRotation = () => {
      const rotationIncrement = (360 / rotationDuration) * 0.01 * rotationSpeed * rotationDirection;
      rotationRef.current = (rotationRef.current + rotationIncrement) % 360;
      setCurrentRotation(rotationRef.current);
      
      setTrailPositions(prev => {
        const newPositions = [...prev, rotationRef.current];
        return newPositions.slice(-15);
      });

      animationRef.current = requestAnimationFrame(updateRotation);
    };
    
    animationRef.current = requestAnimationFrame(updateRotation);
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [rotationDuration, rotationDirection, rotationSpeed]);

  useEffect(() => {
    const handleMeteorStrike = (e: CustomEvent) => {
      if (e.detail.targetPlanet === index) {
        setExplosionEffect(true);
        setTimeout(() => {
          setExplosionEffect(false);
        }, 1500);
      }
    };

    const handlePulseWave = () => {
      setPulseEffect(true);
      setTimeout(() => {
        setPulseEffect(false);
      }, 1500);
    };

    const handleOrbitChaos = () => {
      setIsReversing(true);
      setRotationDirection(Math.random() > 0.5 ? 1 : -1);
      setRotationSpeed(3 + Math.random() * 5);
      
      const chaosInterval = setInterval(() => {
        setRotationDirection(prev => prev * -1);
        setRotationSpeed(3 + Math.random() * 5);
      }, 1000);
      
      setTimeout(() => {
        setIsReversing(false);
        setRotationDirection(1);
        setRotationSpeed(1);
        clearInterval(chaosInterval);
      }, 5000);
    };

    document.addEventListener('meteorStrike', handleMeteorStrike as EventListener);
    document.addEventListener('pulseWave', handlePulseWave as EventListener);
    document.addEventListener('orbitChaos', handleOrbitChaos as EventListener);
    
    return () => {
      document.removeEventListener('meteorStrike', handleMeteorStrike as EventListener);
      document.removeEventListener('pulseWave', handlePulseWave as EventListener);
      document.removeEventListener('orbitChaos', handleOrbitChaos as EventListener);
    };
  }, [index]);

  const planetAngle = (currentRotation - 90) * (Math.PI / 180);
  const planetX = orbitRadius + (orbitRadius * Math.cos(planetAngle));
  const planetY = orbitRadius + (orbitRadius * Math.sin(planetAngle));

  const handlePlanetClick = () => {
    setShowDialog(true);
  };

  return (
    <>
      <svg
        className="absolute pointer-events-none"
        style={{
          width: orbitRadius * 2,
          height: orbitRadius * 2,
          left: '50%',
          top: '50%',
          marginLeft: -orbitRadius,
          marginTop: -orbitRadius,
          zIndex: 5
        }}
      >
        {trailPositions.map((rotation, index) => {
          const progress = index / trailPositions.length;
          const opacity = 0.7 * (1 - progress);
          
          const arcLength = 6 * (1 - progress);
          const startAngle = (rotation - 90) * (Math.PI / 180);
          const endAngle = (rotation - arcLength - 90) * (Math.PI / 180);
          
          const x1 = orbitRadius + (orbitRadius * Math.cos(startAngle));
          const y1 = orbitRadius + (orbitRadius * Math.sin(startAngle));
          const x2 = orbitRadius + (orbitRadius * Math.cos(endAngle));
          const y2 = orbitRadius + (orbitRadius * Math.sin(endAngle));
          
          const pathData = index === 0
            ? `M ${planetX} ${planetY} A ${orbitRadius} ${orbitRadius} 0 0 0 ${x2} ${y2}`
            : `M ${x1} ${y1} A ${orbitRadius} ${orbitRadius} 0 0 0 ${x2} ${y2}`;
          
          return (
            <path
              key={`trail-${index}`}
              d={pathData}
              fill="none"
              stroke={color}
              strokeWidth="1"
              strokeLinecap="round"
              opacity={opacity}
              style={{
                filter: `drop-shadow(0 0 3px ${color}) drop-shadow(0 0 5px ${color}80)`
              }}
            />
          );
        })}
      </svg>

      {explosionEffect && (
        <motion.div
          className="absolute pointer-events-none z-50"
          style={{
            left: planetX - 50 + orbitRadius,
            top: planetY - 50 + orbitRadius,
          }}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ 
            scale: [0, 5, 0], 
            opacity: [0, 1, 0] 
          }}
          transition={{ duration: 1.5, ease: "easeOut" }}
        >
          <div className="relative">
            <div 
              className="w-40 h-40 absolute rounded-full"
              style={{
                background: `radial-gradient(circle, ${color} 0%, transparent 70%)`,
                boxShadow: `0 0 60px ${color}, 0 0 120px ${color}80`,
                filter: 'blur(8px)',
                transform: 'translate(-50%, -50%)'
              }}
            />
            <div 
              className="w-20 h-20 absolute rounded-full"
              style={{
                background: `radial-gradient(circle, white 0%, transparent 70%)`,
                filter: 'blur(5px)',
                transform: 'translate(-50%, -50%)'
              }}
            />
          </div>
        </motion.div>
      )}

      <motion.div
        className="absolute"
        animate={{
          rotate: currentRotation,
          transition: {
            duration: 0,
            ease: "linear"
          }
        }}
        style={{
          width: orbitRadius * 2,
          height: orbitRadius * 2,
          left: '50%',
          top: '50%',
          marginLeft: -orbitRadius,
          marginTop: -orbitRadius,
          pointerEvents: "none",
          zIndex: 10
        }}
      >
        <motion.button
          id={`planet-${index}`}
          className="absolute rounded-full p-3 cursor-pointer transition-transform backdrop-blur-sm bg-background/10"
          style={{
            left: orbitRadius * 2 - 24,
            top: orbitRadius - 24,
            boxShadow: `0 0 20px ${color}, 0 0 40px ${color}50`,
            border: `2px solid ${color}`,
            zIndex: 20,
            pointerEvents: "auto",
          }}
          onClick={handlePlanetClick}
          animate={
            pulseEffect ? {
              scale: [1, 1.5, 1],
              boxShadow: [
                `0 0 20px ${color}, 0 0 40px ${color}50`,
                `0 0 80px ${color}, 0 0 160px ${color}90`,
                `0 0 20px ${color}, 0 0 40px ${color}50`
              ],
              filter: [
                'brightness(100%)',
                'brightness(150%)',
                'brightness(100%)'
              ],
              transition: { 
                duration: 1.5, 
                ease: "easeInOut" 
              }
            } : 
            explosionEffect ? {
              scale: [1, 2, 0],
              opacity: [1, 1, 0],
              boxShadow: [
                `0 0 20px ${color}, 0 0 40px ${color}50`,
                `0 0 100px ${color}, 0 0 200px ${color}`,
                `0 0 20px ${color}, 0 0 40px ${color}50`
              ],
              transition: { duration: 1.5 }
            } : 
            isReversing ? {
              rotateZ: [0, 360],
              scale: [1, 1.3, 1],
              transition: { duration: 1, repeat: 5 }
            } : {
              scale: 1,
              opacity: 1
            }
          }
        >
          <IconComponent className="w-6 h-6" style={{ color }} />
        </motion.button>
      </motion.div>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle style={{ color }}>{fact.title}</DialogTitle>
            <DialogDescription className="pt-2">
              {fact.description}
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </>
  );
};
