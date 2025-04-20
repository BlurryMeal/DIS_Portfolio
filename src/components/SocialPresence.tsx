
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { User } from "lucide-react";

// Avatar generation utility
const generateAvatar = (userId: string) => {
  return `https://api.dicebear.com/7.x/personas/svg?seed=${userId}`;
};

// Generate a random name based on userId
const generateName = (userId: string) => {
  const firstNames = ["Alex", "Jamie", "Taylor", "Jordan", "Casey", "Riley", "Quinn", "Morgan", "Avery", "Skyler"];
  // Use the userId to deterministically select a name
  const nameIndex = parseInt(userId.substring(0, 8), 16) % firstNames.length;
  return firstNames[nameIndex];
};

interface Visitor {
  id: string;
  name: string;
  avatar: string;
  timestamp: number;
}

export function SocialPresence() {
  const [currentVisitors, setCurrentVisitors] = useState<Visitor[]>([]);
  const [showTooltip, setShowTooltip] = useState(false);
  
  useEffect(() => {
    // Generate a unique visitor ID if not already present
    const getOrCreateVisitorId = () => {
      let visitorId = localStorage.getItem('visitorId');
      if (!visitorId) {
        // Generate a random ID
        visitorId = Math.random().toString(36).substring(2, 15);
        localStorage.setItem('visitorId', visitorId);
      }
      return visitorId;
    };
    
    // Get current visitor ID
    const currentVisitorId = getOrCreateVisitorId();
    
    // Get existing visitors from sessionStorage
    const getExistingVisitors = (): Visitor[] => {
      const storedVisitors = sessionStorage.getItem('activeVisitors');
      return storedVisitors ? JSON.parse(storedVisitors) : [];
    };
    
    // Save current visitor info
    const visitorInfo: Visitor = {
      id: currentVisitorId,
      name: generateName(currentVisitorId),
      avatar: generateAvatar(currentVisitorId),
      timestamp: Date.now()
    };
    
    // Add the current visitor to the list and filter out outdated ones (inactive for more than 2 minutes)
    const updateVisitorsList = () => {
      const existingVisitors = getExistingVisitors();
      const currentTime = Date.now();
      const activeVisitors = existingVisitors
        .filter(visitor => currentTime - visitor.timestamp < 120000); // 2 minutes timeout
      
      // Update current visitor's timestamp
      const currentVisitorIndex = activeVisitors.findIndex(v => v.id === currentVisitorId);
      
      if (currentVisitorIndex >= 0) {
        activeVisitors[currentVisitorIndex].timestamp = currentTime;
      } else {
        activeVisitors.push(visitorInfo);
      }
      
      // Store the updated list
      sessionStorage.setItem('activeVisitors', JSON.stringify(activeVisitors));
      
      // Filter out the current user from the displayed list
      const otherVisitors = activeVisitors.filter(visitor => visitor.id !== currentVisitorId);
      setCurrentVisitors(otherVisitors);
    };
    
    // Initial update
    updateVisitorsList();
    
    // Set up periodic updates
    const interval = setInterval(updateVisitorsList, 15000); // Update every 15 seconds
    
    // Cleanup
    return () => clearInterval(interval);
  }, []);

  return (
    <div 
      className="fixed bottom-4 left-4 z-40 flex items-center gap-1"
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      <div className="bg-card border shadow-sm rounded-full p-1.5">
        <User className="h-4 w-4 text-muted-foreground" />
      </div>
      
      {currentVisitors.map((visitor, index) => (
        <motion.div
          key={visitor.id}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.1 }}
          className="relative"
        >
          <img 
            src={visitor.avatar} 
            alt={visitor.name}
            className="h-7 w-7 rounded-full border-2 border-background"
          />
        </motion.div>
      ))}
      
      <AnimatePresence>
        {showTooltip && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute bottom-full left-0 mb-2 bg-card shadow-md rounded-md p-2 text-xs w-40"
          >
            {currentVisitors.length > 0 ? (
              <>
                <p className="font-medium mb-1">Also viewing:</p>
                <ul>
                  {currentVisitors.map(visitor => (
                    <li key={visitor.id} className="flex items-center gap-1.5 text-muted-foreground">
                      <div className="h-1.5 w-1.5 bg-green-500 rounded-full"></div>
                      {visitor.name}
                    </li>
                  ))}
                </ul>
              </>
            ) : (
              <p className="text-muted-foreground">No other viewers right now</p>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
