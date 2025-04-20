import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Volume2, VolumeX, Send, Mic, MicOff, Navigation } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLocation, useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

export function Avatar() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [muted, setMuted] = useState(true);
  const [userInput, setUserInput] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [conversation, setConversation] = useState<{text: string, isUser: boolean}[]>([]);
  const [soundsLoaded, setSoundsLoaded] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isNavigationMode, setIsNavigationMode] = useState(false);

  const soundFiles = {
    soundOn: "/sound-on.mp3",
    messageSent: "/message-sent.mp3",
    messageReceived: "/message-received.mp3"
  };

  useEffect(() => {
    const preloadSounds = async () => {
      try {
        await Promise.all(
          Object.values(soundFiles).map(async (src) => {
            const response = await fetch(src);
            if (!response.ok) throw new Error(`Sound file ${src} not found`);
            return src;
          })
        );
        setSoundsLoaded(true);
        console.log("All sound files loaded successfully");
      } catch (error) {
        console.error("Failed to preload sounds:", error);
        toast({
          title: "Sound issue",
          description: "Some sound files couldn't be loaded. Sound might not work properly.",
          variant: "destructive",
          duration: 3000,
        });
      }
    };
    
    preloadSounds();
  }, [toast]);

  const playSound = (soundName: keyof typeof soundFiles) => {
    if (muted || !soundsLoaded) return;
    
    try {
      const audio = new Audio(soundFiles[soundName]);
      audio.volume = 0.3;
      
      const playPromise = audio.play();
      
      if (playPromise !== undefined) {
        playPromise.catch(error => {
          console.error(`Error playing ${soundName} sound:`, error);
          if (error.name === "NotAllowedError") {
            toast({
              title: "Sound blocked",
              description: "Your browser blocked sound playback. Try clicking the sound button again.",
              duration: 3000,
            });
          }
        });
      }
    } catch (error) {
      console.error(`Failed to create audio for ${soundName}:`, error);
    }
  };

  const welcomeMessages = {
    "/": "Welcome to my portfolio! I'm here to help you navigate. Try exploring my projects section.",
    "/about": "This is where you can learn more about my background, skills, and experience.",
    "/projects": "Here you'll find my featured projects. Hover over each card for a 3D interaction!",
    "/blog": "Check out my latest thoughts and insights on design and development.",
    "/contact": "Feel free to reach out! I'd love to hear from you."
  };

  const getTimeBasedGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning! ";
    if (hour < 18) return "Good afternoon! ";
    return "Good evening! ";
  };

  const handleNavigation = (input: string) => {
    const text = input.toLowerCase();
    
    if (text.includes("projects") || text.includes("project page")) {
      navigate("/projects");
      return "Taking you to the Projects page.";
    } else if (text.includes("blog") || text.includes("blog page")) {
      navigate("/blog");
      return "Navigating to the Blog page.";
    } else if (text.includes("about") || text.includes("about page")) {
      navigate("/about");
      return "Heading to the About page.";
    } else if (text.includes("contact") || text.includes("contact page")) {
      navigate("/contact");
      return "Going to the Contact page.";
    } else if (text.includes("home") || text.includes("main page")) {
      navigate("/");
      return "Returning to the Home page.";
    }
    return null;
  };

  const startVoiceRecognition = () => {
    if (!('webkitSpeechRecognition' in window)) {
      toast({
        title: "Voice Recognition Not Supported",
        description: "Your browser doesn't support voice recognition. Please try using Chrome.",
        variant: "destructive",
      });
      return;
    }

    const recognition = new (window as any).webkitSpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => {
      setIsListening(true);
      toast({
        title: "Listening...",
        description: "Speak your command",
      });
    };

    recognition.onresult = (event: any) => {
      const text = event.results[0][0].transcript;
      setUserInput(text);
      handleSendMessage(text);
    };

    recognition.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error);
      setIsListening(false);
      toast({
        title: "Error",
        description: "Failed to recognize speech. Please try again.",
        variant: "destructive",
      });
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  };

  useEffect(() => {
    const pathname = location.pathname;
    const initialMessage = getTimeBasedGreeting() + (welcomeMessages[pathname as keyof typeof welcomeMessages] || "How can I help you?");
    setMessage(initialMessage);
    
    if (pathname !== "/" && conversation.length === 0) {
      setConversation([{text: initialMessage, isUser: false}]);
    }
    
    if (pathname !== "/") {
      setIsOpen(true);
      const timer = setTimeout(() => setIsOpen(false), 4000);
      return () => clearTimeout(timer);
    }
  }, [location, conversation.length]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [conversation]);

  const toggleSound = () => {
    setMuted(!muted);
    
    if (muted) {
      const audio = new Audio(soundFiles.soundOn);
      audio.volume = 0.4;
      
      const playPromise = audio.play();
      
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            console.log("Sound test successful");
            toast({
              title: "Sound enabled",
              description: "You will now hear notification sounds",
              duration: 2000,
            });
          })
          .catch(err => {
            console.error("Failed to play sound:", err);
            toast({
              title: "Sound permission denied",
              description: "Your browser blocked sound playback. You may need to interact with the page first.",
              variant: "destructive",
              duration: 3000,
            });
            setMuted(true);
          });
      }
    } else {
      toast({
        title: "Sound disabled",
        description: "Notification sounds are now muted",
        duration: 2000,
      });
    }
  };

  const handleSendMessage = (inputText?: string) => {
    const textToProcess = inputText || userInput;
    if (!textToProcess.trim()) return;

    setConversation([...conversation, {text: textToProcess, isUser: true}]);
    playSound('messageSent');
    
    setTimeout(() => {
      let response = "";
      
      if (isNavigationMode) {
        const navigationResponse = handleNavigation(textToProcess);
        
        if (navigationResponse) {
          response = navigationResponse;
        } else {
          response = "I understand you want to navigate. Try saying something like 'take me to the projects page' or 'go to contact page'.";
        }
      } else {
        if (textToProcess.toLowerCase().includes("project") || textToProcess.toLowerCase().includes("projects")) {
          response = "I showcase various projects demonstrating my skills in web development, UI/UX design, and software engineering. Each project includes detailed information about the technologies used and challenges overcome. Would you like me to show you the Projects page?";
        } else if (textToProcess.toLowerCase().includes("skill") || textToProcess.toLowerCase().includes("experience")) {
          response = "My skill set includes React, TypeScript, Node.js, and various modern web technologies. I have experience in both frontend and backend development. You can find more details in the About page. Would you like me to take you there?";
        } else if (textToProcess.toLowerCase().includes("contact") || textToProcess.toLowerCase().includes("reach")) {
          response = "You can reach out through the contact form, or connect with me on various social platforms. Would you like to see the contact options?";
        } else if (textToProcess.toLowerCase().includes("blog") || textToProcess.toLowerCase().includes("article")) {
          response = "I write about web development, design patterns, and technology trends. My blog posts include detailed tutorials and insights from my experience. Would you like to browse the articles?";
        } else if (textToProcess.toLowerCase().includes("hello") || textToProcess.toLowerCase().includes("hi")) {
          response = `${getTimeBasedGreeting()} How can I assist you today? I can help you learn about my projects, skills, or help you get in touch.`;
        } else if (textToProcess.toLowerCase().includes("voice") || textToProcess.toLowerCase().includes("speak")) {
          response = "You can use voice commands by clicking the microphone icon. Try saying 'Take me to the projects page' or ask me about my experience!";
        } else if (textToProcess.toLowerCase().includes("navigate") || textToProcess.toLowerCase().includes("go to") || textToProcess.toLowerCase().includes("take me")) {
          response = "It seems you want to navigate to a page. You can switch to Navigation Mode using the button below, or simply tell me which page you'd like to learn about.";
        } else {
          response = "I'm here to help you learn more about my portfolio. Feel free to ask about my projects, skills, experience, or use voice commands to navigate. What would you like to know?";
        }
      }
      
      setConversation(prev => [...prev, {text: response, isUser: false}]);
      playSound('messageReceived');
    }, 800);
    
    setUserInput("");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: 20, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.8 }}
            className="bg-card p-4 rounded-lg shadow-lg mb-2"
            style={{ width: "300px" }}
          >
            <div className="flex justify-between items-start mb-2">
              <span className="text-sm font-medium">Portfolio Assistant</span>
              <Button variant="ghost" size="icon" className="h-5 w-5" onClick={() => setIsOpen(false)}>
                <X className="h-3 w-3" />
              </Button>
            </div>
            
            <div className="max-h-60 overflow-y-auto mb-3 space-y-2">
              {conversation.length > 0 ? (
                conversation.map((msg, index) => (
                  <div 
                    key={index} 
                    className={`${
                      msg.isUser 
                        ? "ml-auto bg-primary text-primary-foreground" 
                        : "mr-auto bg-muted"
                    } p-2 rounded-lg text-sm max-w-[90%]`}
                  >
                    {msg.text}
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">{message}</p>
              )}
              <div ref={messagesEndRef} />
            </div>
            
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <Input 
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  onKeyDown={handleKeyPress}
                  placeholder={isNavigationMode ? "Enter navigation command..." : "Type your message..."}
                  className="text-sm h-8"
                />
                <Button 
                  size="icon" 
                  className="h-8 w-8 shrink-0" 
                  onClick={() => handleSendMessage()}
                >
                  <Send className="h-4 w-4" />
                </Button>
                <Button
                  size="icon"
                  className="h-8 w-8 shrink-0"
                  onClick={startVoiceRecognition}
                  disabled={isListening}
                >
                  {isListening ? (
                    <Mic className="h-4 w-4 text-primary animate-pulse" />
                  ) : (
                    <MicOff className="h-4 w-4" />
                  )}
                </Button>
              </div>
              
              <div className="flex justify-between items-center">
                <Button 
                  variant={isNavigationMode ? "default" : "ghost"}
                  size="sm"
                  className="h-7 text-xs gap-1"
                  onClick={() => setIsNavigationMode(!isNavigationMode)}
                >
                  <Navigation className="h-3 w-3" />
                  {isNavigationMode ? "Navigation Mode" : "Chat Mode"}
                </Button>
                
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-6 w-6" 
                  onClick={toggleSound}
                  title={muted ? "Enable sounds" : "Mute sounds"}
                >
                  {muted ? <VolumeX className="h-3 w-3" /> : <Volume2 className="h-3 w-3" />}
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      <motion.div 
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="bg-primary text-primary-foreground rounded-full p-3 shadow-lg cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        <MessageCircle className="h-6 w-6" />
      </motion.div>
    </div>
  );
}
