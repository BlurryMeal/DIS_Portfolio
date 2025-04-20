
import { motion } from 'framer-motion';
import { OrbitingPlanet } from './OrbitingPlanet';

const orbits = [
  {
    radius: 150,
    duration: 20,
    color: 'rgb(249, 115, 22)', // Orange with full opacity
    icon: 'sun' as const,
    initialRotation: Math.random() * 360,
    fact: {
      title: "Technology Enthusiast",
      description: "I'm passionate about emerging technologies and their potential to transform our world."
    }
  },
  {
    radius: 250,
    duration: 23,
    color: 'rgb(139, 92, 246)', // Purple with full opacity
    icon: 'moon' as const,
    initialRotation: Math.random() * 360,
    fact: {
      title: "Problem Solver",
      description: "I love tackling complex challenges and finding elegant solutions through creative thinking."
    }
  },
  {
    radius: 350,
    duration: 26,
    color: 'rgb(14, 165, 233)', // Blue with full opacity
    icon: 'star' as const,
    initialRotation: Math.random() * 360,
    fact: {
      title: "Continuous Learner",
      description: "I believe in lifelong learning and constantly expanding my knowledge across different domains."
    }
  },
  {
    radius: 450,
    duration: 29,
    color: 'rgb(217, 70, 239)', // Pink with full opacity
    icon: 'satellite' as const,
    initialRotation: Math.random() * 360,
    fact: {
      title: "Creative Developer",
      description: "I combine technical expertise with creativity to build innovative and user-friendly solutions."
    }
  },
  {
    radius: 550,
    duration: 32,
    color: 'rgb(110, 231, 183)', // Teal with full opacity
    icon: 'circle' as const,
    initialRotation: Math.random() * 360,
    fact: {
      title: "Team Player",
      description: "I thrive in collaborative environments and enjoy working with diverse teams to achieve common goals."
    }
  },
  {
    radius: 650,
    duration: 35,
    color: 'rgb(236, 72, 153)', // Pink with full opacity
    icon: 'star' as const,
    initialRotation: Math.random() * 360,
    fact: {
      title: "Design Enthusiast",
      description: "I have a keen eye for design and enjoy creating beautiful, intuitive user experiences."
    }
  },
  {
    radius: 750,
    duration: 38,
    color: 'rgb(16, 185, 129)', // Green with full opacity
    icon: 'moon' as const,
    initialRotation: Math.random() * 360,
    fact: {
      title: "Innovation Driver",
      description: "I'm always looking for new ways to push boundaries and innovate in software development."
    }
  }
];

export const OrbitSystem = () => {
  return (
    <div className="absolute inset-0 flex items-center justify-center overflow-hidden -translate-y-10">
      {/* Orbit rings */}
      {orbits.map((orbit, index) => (
        <motion.div
          key={index}
          className="absolute rounded-full border"
          style={{
            width: orbit.radius * 2,
            height: orbit.radius * 2,
            borderColor: `${orbit.color}20` // Using the orbit color with 20% opacity for the ring
          }}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: index * 0.2 }}
        />
      ))}

      {/* Planets */}
      {orbits.map((orbit, index) => (
        <OrbitingPlanet
          key={index}
          orbitRadius={orbit.radius}
          rotationDuration={orbit.duration}
          color={orbit.color}
          icon={orbit.icon}
          fact={orbit.fact}
          initialRotation={orbit.initialRotation}
          index={index}
        />
      ))}
    </div>
  );
};
