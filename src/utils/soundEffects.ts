
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
        console.log(`Note: Sound ${soundName} couldn't play. This is normal on mobile devices with autoplay restrictions.`);
      });
    }
  } catch (error) {
    console.log("Audio playback not supported on this device");
  }
};
