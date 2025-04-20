
import { useState, useEffect, useRef } from 'react';
import { toast } from 'sonner';

interface UseHandGestureControlProps {
  onLeftGesture?: () => void;
  onRightGesture?: () => void;
  enabled?: boolean;
}

const DETECTION_INTERVAL = 1000; // Check for gestures every 1 second
const MOVEMENT_THRESHOLD = 50; // Minimum pixel movement to detect a gesture

export const useHandGestureControl = ({
  onLeftGesture,
  onRightGesture,
  enabled = true
}: UseHandGestureControlProps) => {
  const [isActive, setIsActive] = useState(false);
  const [permission, setPermission] = useState<boolean | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const lastPositionRef = useRef<{ x: number, y: number } | null>(null);
  const processingRef = useRef(false);

  const startCamera = async () => {
    try {
      if (!enabled) return;
      
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          width: 320, 
          height: 240,
          facingMode: 'user'
        } 
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setIsActive(true);
        setPermission(true);
        toast.success("Hand gesture control activated", { duration: 3000 });
      }
    } catch (err) {
      console.error("Error accessing camera:", err);
      setPermission(false);
      toast.error("Unable to access camera for gesture controls", { duration: 3000 });
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      const tracks = stream.getTracks();
      
      tracks.forEach(track => track.stop());
      videoRef.current.srcObject = null;
      setIsActive(false);
      toast.info("Hand gesture control deactivated", { duration: 3000 });
    }
  };

  // Process video frame to detect hand gestures
  const processFrame = () => {
    if (processingRef.current || !isActive || !videoRef.current || !canvasRef.current) return;
    
    processingRef.current = true;
    
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    
    if (!context) return;
    
    // Set canvas size to match video
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    // Draw the current video frame to the canvas
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    
    // Get image data for processing
    const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    
    // Simplified hand detection by looking for skin-colored pixels
    // This is a very basic implementation - real hand tracking would use more sophisticated methods
    let sumX = 0;
    let sumY = 0;
    let count = 0;
    
    // Look for skin-colored pixels (very simplified)
    for (let y = 0; y < canvas.height; y += 4) {
      for (let x = 0; x < canvas.width; x += 4) {
        const index = (y * canvas.width + x) * 4;
        const r = data[index];
        const g = data[index + 1];
        const b = data[index + 2];
        
        // Very simple skin detection
        if (r > 95 && g > 40 && b > 20 && 
            r > g && r > b && 
            r - Math.min(g, b) > 15 && 
            Math.abs(r - g) > 15) {
          sumX += x;
          sumY += y;
          count++;
          
          // Highlight detected pixels for visualization
          context.fillStyle = 'rgba(0, 255, 0, 0.5)';
          context.fillRect(x, y, 4, 4);
        }
      }
    }
    
    // If we found enough pixels that might be skin
    if (count > 100) {
      const centerX = sumX / count;
      const centerY = sumY / count;
      
      // Draw the estimated center of the hand
      context.beginPath();
      context.arc(centerX, centerY, 10, 0, 2 * Math.PI);
      context.fillStyle = 'red';
      context.fill();
      
      // Check if we have a previous position to compare with
      if (lastPositionRef.current) {
        const deltaX = centerX - lastPositionRef.current.x;
        
        // Detect horizontal hand movement
        if (Math.abs(deltaX) > MOVEMENT_THRESHOLD) {
          if (deltaX > 0 && onRightGesture) {
            onRightGesture();
            toast.info("→ Right gesture detected", { duration: 1500 });
          } else if (deltaX < 0 && onLeftGesture) {
            onLeftGesture();
            toast.info("← Left gesture detected", { duration: 1500 });
          }
          
          // Reset the position after a gesture to avoid repeated triggers
          lastPositionRef.current = null;
          setTimeout(() => {
            lastPositionRef.current = { x: centerX, y: centerY };
          }, 1000);
        } else {
          // Update position if no significant movement
          lastPositionRef.current = { x: centerX, y: centerY };
        }
      } else {
        // Initialize position
        lastPositionRef.current = { x: centerX, y: centerY };
      }
    }
    
    processingRef.current = false;
  };

  // Set up the processing interval
  useEffect(() => {
    if (!enabled) return;
    
    if (isActive) {
      const intervalId = setInterval(processFrame, DETECTION_INTERVAL);
      return () => clearInterval(intervalId);
    }
  }, [isActive, enabled]);

  // Clean up resources when component unmounts
  useEffect(() => {
    if (enabled) {
      startCamera();
    }
    
    return () => {
      stopCamera();
    };
  }, [enabled]);

  return {
    videoRef,
    canvasRef,
    isActive,
    permission,
    startCamera,
    stopCamera
  };
};
