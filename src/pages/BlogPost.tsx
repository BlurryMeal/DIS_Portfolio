import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { PageTransition } from "@/components/PageTransition";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
} from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";

export default function BlogPost() {
  const navigate = useNavigate();

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [volume, setVolume] = useState(0.7);
  const [isMuted, setIsMuted] = useState(false);
  const [showVolumeSlider, setShowVolumeSlider] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [audioSrc, setAudioSrc] = useState<string | null>(null);

  // 👇 Put your actual blog title and full text content here
  const blogTitle = "Harnessing AR/VR for Natural Disaster Preparedness: A Unity 3D Approach";
  const blogDate = "April 20, 2025";
  const blogCategory = "Technology";
  const blogReadTime = "6 min read";

  const blogContent = `
  The use of AR and VR technologies for disaster preparedness offers a transformative shift in how we train, educate, and prepare for natural disasters. Traditional methods, like printed materials and physical drills, are limited in their ability to recreate the chaos and unpredictability that accompanies disasters. AR and VR, on the other hand, provide a highly immersive experience that can simulate real-life conditions, helping users to interact with their environment and make decisions based on realistic scenarios.

Some notable ways AR/VR is transforming disaster management include:

Training First Responders: VR can create fully immersive training environments where firefighters, police, and paramedics can practice their response strategies without the risk of real-life consequences. In Unity 3D, developers can simulate environments like burning buildings, collapsed structures, and hazardous terrains, allowing responders to practice search and rescue operations in highly realistic scenarios.

Simulating Evacuations: AR can help in simulating the evacuation process, guiding individuals through emergency exits, routes, and assembly areas. Through smartphones or AR glasses, real-time information can be projected onto the physical environment to help people make decisions in crisis situations.

Disaster Education for the Public: Virtual reality applications can educate the public about natural disasters like earthquakes, floods, hurricanes, and wildfires by immersing them in realistic environments. Users can experience a disaster scenario firsthand, learning about safety measures and emergency procedures in a controlled, yet impactful way.
  `;

  const getAudioFromText = async (text: string): Promise<string | null> => {
    const voiceId = "JBFqnCBsd6RMkjVDRZzb";
    const apiKey = "sk_c8889d172cc814e227961e22c1c96d245386d0c06ab51d26"; // Replace securely in production

    const url = `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`;

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "xi-api-key": apiKey,
          "Content-Type": "application/json",
          Accept: "audio/mpeg",
        },
        body: JSON.stringify({
          text,
          model_id: "eleven_multilingual_v2",
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.5,
          },
        }),
      });

      const blob = await response.blob();
      console.log("Audio Blob:", blob); // Debugging line to check blob

      if (blob.size > 0) {
        const audioUrl = URL.createObjectURL(blob);
        console.log("Generated Audio URL:", audioUrl); // Debugging line to check audio URL
        return audioUrl;
      } else {
        throw new Error("Audio generation failed");
      }
    } catch (error) {
      console.error("Error generating audio:", error);
      toast.error("Failed to load audio.");
      return null;
    }
  };

  useEffect(() => {
    const initAudio = async () => {
      const audio = await getAudioFromText(blogContent);
      if (audio) {
        setAudioSrc(audio);
        toast.success("Audio loaded!");
      }
    };

    initAudio();
  }, []);

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleSkip = (seconds: number) => {
    if (!audioRef.current) return;
    audioRef.current.currentTime += seconds;
  };

  const handleSpeedChange = () => {
    if (!audioRef.current) return;
    const speeds = [1, 1.25, 1.5, 1.75, 2];
    const currentIndex = speeds.indexOf(playbackRate);
    const nextIndex = (currentIndex + 1) % speeds.length;
    const newSpeed = speeds[nextIndex];
    audioRef.current.playbackRate = newSpeed;
    setPlaybackRate(newSpeed);
    toast.info(`Playback speed: ${newSpeed}x`);
  };

  const handleVolumeChange = (newVolume: number[]) => {
    if (!audioRef.current) return;
    const volume = newVolume[0];
    audioRef.current.volume = volume;
    setVolume(volume);
    setIsMuted(volume === 0);
  };

  const toggleMute = () => {
    if (!audioRef.current) return;
    audioRef.current.volume = isMuted ? volume : 0;
    setIsMuted(!isMuted);
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  return (
    <PageTransition>
      <div className="page-container max-w-4xl mx-auto">
        <Button
          variant="ghost"
          className="mb-6 hover:bg-accent"
          onClick={() => navigate("/blog")}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Blog
        </Button>

        <article className="prose prose-lg dark:prose-invert max-w-none">
          <h1 className="text-3xl sm:text-4xl font-bold mb-4">{blogTitle}</h1>

          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-8">
            <span>{blogDate}</span>
            <span>•</span>
            <span>{blogReadTime}</span>
            <span>•</span>
            <span>{blogCategory}</span>
          </div>

          {/* 🎧 Audio Player */}
          <Card className="mb-8">
            <CardContent className="p-4">
              <div className="flex flex-wrap items-center gap-4">
                <Button variant="outline" size="icon" onClick={togglePlay}>
                  {isPlaying ? <Pause /> : <Play />}
                </Button>

                <Button variant="ghost" size="icon" onClick={() => handleSkip(-5)}>
                  <SkipBack />
                </Button>

                <div className="flex-1 flex items-center gap-2">
                  <span className="text-sm min-w-[40px]">
                    {formatTime(currentTime)}
                  </span>
                  <Slider
                    value={[currentTime]}
                    max={duration}
                    step={1}
                    className="flex-1"
                    onValueChange={(value) => {
                      if (audioRef.current) {
                        audioRef.current.currentTime = value[0];
                      }
                    }}
                  />
                  <span className="text-sm min-w-[40px]">
                    {formatTime(duration)}
                  </span>
                </div>

                <Button variant="ghost" size="icon" onClick={() => handleSkip(5)}>
                  <SkipForward />
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleSpeedChange}
                  className="text-xs"
                >
                  {playbackRate}x
                </Button>

                <div
                  className="relative"
                  onMouseEnter={() => setShowVolumeSlider(true)}
                  onMouseLeave={() => setShowVolumeSlider(false)}
                >
                  <Button variant="ghost" size="icon" onClick={toggleMute}>
                    {isMuted ? <VolumeX /> : <Volume2 />}
                  </Button>

                  {showVolumeSlider && (
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-24 bg-background rounded-lg shadow-lg p-4">
                      <Slider
                        value={[isMuted ? 0 : volume]}
                        max={1}
                        step={0.1}
                        orientation="vertical"
                        className="h-24"
                        onValueChange={handleVolumeChange}
                      />
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 📝 Blog Content */}
          <div className="leading-relaxed space-y-6">
            {blogContent
              .trim()
              .split("\n")
              .filter((line) => line.trim() !== "")
              .map((para, index) => (
                <p key={index}>{para.trim()}</p>
              ))}
          </div>
        </article>

        {/* 🔊 Audio Element */}
        {audioSrc && (
          <audio
            ref={audioRef}
            src={audioSrc}
            controls
            onTimeUpdate={handleTimeUpdate}
            onLoadedMetadata={handleLoadedMetadata}
            onEnded={() => setIsPlaying(false)}
          />
        )}
      </div>
    </PageTransition>
  );
}
