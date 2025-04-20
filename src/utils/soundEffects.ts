
const soundEffects = {
  meteorImpact: "/meteor-impact.mp3",
  energyPulse: "/energy-pulse.mp3",
  orbitChaos: "/orbit-chaos.mp3",
};

export const playSound = (soundName: keyof typeof soundEffects) => {
  try {
    const audio = new Audio(soundEffects[soundName]);
    audio.volume = 0.3;
    const playPromise = audio.play();
    
    if (playPromise !== undefined) {
      playPromise.catch(error => {
        console.error(`Error playing ${soundName} sound:`, error);
      });
    }
  } catch (error) {
    console.error(`Failed to play ${soundName} sound:`, error);
  }
};
