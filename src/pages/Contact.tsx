
import { useState, useRef, useEffect } from "react";
import { PageTransition } from "@/components/PageTransition";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Mail, MapPin, Phone, Sparkles, Send, CheckCircle2, Clock, X, ArrowRight } from "lucide-react";
import { motion, useMotionValue, useTransform } from "framer-motion";
import { Checkbox } from "@/components/ui/checkbox";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

export default function Contact() {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
    urgent: false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formStep, setFormStep] = useState(1);
  const [formSuccess, setFormSuccess] = useState(false);
  const [isInfoExpanded, setIsInfoExpanded] = useState(false);

  // For the card tilt effect
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useTransform(y, [-100, 100], [5, -5]);
  const rotateY = useTransform(x, [-100, 100], [-5, 5]);
  
  const formRef = useRef<HTMLFormElement>(null);
  const nameInputRef = useRef<HTMLInputElement>(null);
  
  // Focus the name input when the component mounts
  useEffect(() => {
    if (nameInputRef.current) {
      nameInputRef.current.focus();
    }
  }, []);

  // Handle mouse move for tilt effect
  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = (mouseX / width - 0.5) * 2;
    const yPct = (mouseY / height - 0.5) * 2;
    x.set(xPct * 50);
    y.set(yPct * 50);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (checked: boolean) => {
    setFormData((prev) => ({ ...prev, urgent: checked }));
  };

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    if (formStep === 1) {
      // Validate first step (name and email)
      if (!formData.name || !formData.email) {
        toast({
          title: "Missing information",
          description: "Please fill in all required fields",
        });
        return;
      }
      setFormStep(2);
    }
  };

  const handleBack = () => {
    setFormStep(1);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission with a delay for effect
    setTimeout(() => {
      setIsSubmitting(false);
      setFormSuccess(true);
      
      // Show success toast
      toast({
        title: "Message sent!",
        description: "Thank you for your message. I'll get back to you soon.",
      });
      
      // Reset form after 3 seconds
      setTimeout(() => {
        setFormData({
          name: "",
          email: "",
          subject: "",
          message: "",
          urgent: false,
        });
        setFormStep(1);
        setFormSuccess(false);
      }, 3000);
    }, 1500);
  };

  return (
    <PageTransition>
      <div className="page-container">
        <h1 className="section-title">Contact</h1>
        <p className="text-lg text-muted-foreground mb-8 animate-fade-in">
          Have a question or want to work together? Feel free to reach out!
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <div className="md:col-span-2 animate-slide-in">
            {formSuccess ? (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-green-50 dark:bg-green-900/20 p-8 rounded-lg text-center"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring" }}
                  className="flex justify-center mb-4"
                >
                  <CheckCircle2 className="text-green-500 h-16 w-16" />
                </motion.div>
                <h2 className="text-2xl font-bold mb-2">Message Sent!</h2>
                <p className="text-muted-foreground mb-4">
                  Thank you for reaching out. I'll get back to you as soon as possible.
                </p>
                <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  <span>Expected response time: {formData.urgent ? "24 hours" : "2-3 days"}</span>
                </div>
              </motion.div>
            ) : (
              <motion.form 
                ref={formRef}
                onSubmit={formStep === 1 ? handleNext : handleSubmit}
                className="space-y-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                onMouseMove={handleMouseMove}
                style={{ 
                  rotateX, 
                  rotateY,
                  transformStyle: "preserve-3d"
                }}
              >
                {formStep === 1 ? (
                  <>
                    <motion.div 
                      className="grid grid-cols-1 sm:grid-cols-2 gap-4"
                      initial={{ y: 10, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.1 }}
                    >
                      <div className="space-y-2 transform-gpu" style={{ transform: "translateZ(10px)" }}>
                        <Label htmlFor="name">
                          Your Name <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id="name"
                          name="name"
                          ref={nameInputRef}
                          placeholder="John Doe"
                          value={formData.name}
                          onChange={handleChange}
                          required
                          className="border-b focus-within:border-primary"
                        />
                      </div>
                      
                      <div className="space-y-2 transform-gpu" style={{ transform: "translateZ(10px)" }}>
                        <Label htmlFor="email">
                          Email Address <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          placeholder="john@example.com"
                          value={formData.email}
                          onChange={handleChange}
                          required
                          className="border-b focus-within:border-primary"
                        />
                      </div>
                    </motion.div>
                    
                    <motion.div
                      initial={{ y: 10, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.2 }}
                      className="flex items-center space-x-2 transform-gpu"
                      style={{ transform: "translateZ(10px)" }}
                    >
                      <Checkbox 
                        id="urgent" 
                        checked={formData.urgent}
                        onCheckedChange={handleCheckboxChange}
                      />
                      <label
                        htmlFor="urgent"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        This is an urgent request (faster response time)
                      </label>
                    </motion.div>
                    
                    <motion.div 
                      className="pt-4"
                      initial={{ y: 10, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.3 }}
                    >
                      <Button 
                        type="submit" 
                        className="w-full sm:w-auto group relative overflow-hidden"
                      >
                        <span className="relative z-10 flex items-center">
                          Continue
                          <motion.div
                            animate={{ x: [0, 5, 0] }}
                            transition={{ repeat: Infinity, duration: 1.5 }}
                          >
                            <Send className="ml-2 h-4 w-4" />
                          </motion.div>
                        </span>
                        <span className="absolute inset-0 translate-y-[105%] bg-primary/20 transition-transform duration-300 group-hover:translate-y-0" />
                      </Button>
                    </motion.div>
                  </>
                ) : (
                  <>
                    <motion.div 
                      className="space-y-2 transform-gpu"
                      initial={{ y: 10, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      style={{ transform: "translateZ(10px)" }}
                    >
                      <Label htmlFor="subject">
                        Subject <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="subject"
                        name="subject"
                        placeholder="What is this regarding?"
                        value={formData.subject}
                        onChange={handleChange}
                        required
                        className="border-b focus-within:border-primary"
                      />
                    </motion.div>
                    
                    <motion.div 
                      className="space-y-2 transform-gpu"
                      initial={{ y: 10, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.1 }}
                      style={{ transform: "translateZ(10px)" }}
                    >
                      <Label htmlFor="message">
                        Message <span className="text-red-500">*</span>
                      </Label>
                      <Textarea
                        id="message"
                        name="message"
                        placeholder="Your message..."
                        rows={6}
                        value={formData.message}
                        onChange={handleChange}
                        required
                        className="resize-none border-b focus-within:border-primary"
                      />
                    </motion.div>
                    
                    <motion.div 
                      className="flex flex-wrap gap-3 pt-4"
                      initial={{ y: 10, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.2 }}
                    >
                      <Button type="button" variant="outline" onClick={handleBack}>
                        Back
                      </Button>
                      <Button 
                        type="submit" 
                        disabled={isSubmitting}
                        className="relative group overflow-hidden"
                      >
                        <span className="relative z-10 flex items-center">
                          {isSubmitting ? "Sending..." : "Send Message"}
                          <Sparkles className="ml-2 h-4 w-4" />
                        </span>
                        <span className="absolute inset-0 translate-y-[105%] bg-primary/20 transition-transform duration-300 group-hover:translate-y-0" />
                      </Button>
                    </motion.div>
                  </>
                )}
              </motion.form>
            )}
          </div>
          
          <div className="space-y-6 animate-slide-in animation-delay-150">
            <Collapsible
              open={isInfoExpanded}
              onOpenChange={setIsInfoExpanded}
              className="bg-card rounded-lg p-6 shadow-sm transition-all duration-200 hover:shadow-md"
            >
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">Contact Information</h2>
                <CollapsibleTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                    {isInfoExpanded ? (
                      <X className="h-4 w-4" />
                    ) : (
                      <motion.div
                        animate={{ y: [0, -2, 0] }}
                        transition={{ repeat: Infinity, duration: 1.5 }}
                      >
                        <MapPin className="h-4 w-4 text-primary" />
                      </motion.div>
                    )}
                  </Button>
                </CollapsibleTrigger>
              </div>
              
              <CollapsibleContent className="space-y-4 mt-4">
                <motion.div 
                  className="flex items-start"
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <Mail className="h-5 w-5 mt-0.5 mr-3 text-primary" />
                  <div>
                    <h3 className="font-medium">Email</h3>
                    <motion.p 
                      className="text-sm text-muted-foreground hover-link"
                      whileHover={{ x: 3 }}
                      transition={{ type: "spring", stiffness: 400 }}
                    >
                      <a href="mailto:sagarg2606@gmail.com">sagarg2606@gmail.com</a>
                    </motion.p>
                  </div>
                </motion.div>
                
                <motion.div 
                  className="flex items-start"
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <Phone className="h-5 w-5 mt-0.5 mr-3 text-primary" />
                  <div>
                    <h3 className="font-medium">Phone</h3>
                    <motion.p 
                      className="text-sm text-muted-foreground hover-link"
                      whileHover={{ x: 3 }}
                      transition={{ type: "spring", stiffness: 400 }}
                    >
                      <a href="tel:+15551234567">+91 9310121033</a>
                    </motion.p>
                  </div>
                </motion.div>
                
                <motion.div 
                  className="flex items-start"
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <MapPin className="h-5 w-5 mt-0.5 mr-3 text-primary" />
                  <div>
                    <h3 className="font-medium">Location</h3>
                    <p className="text-sm text-muted-foreground">New Delhi, India</p>
                  </div>
                </motion.div>
              </CollapsibleContent>
            </Collapsible>
            
            <motion.div 
              className="bg-card rounded-lg p-6 shadow-sm relative overflow-hidden group"
              whileHover={{ y: -5 }}
              transition={{ type: "spring", stiffness: 400 }}
            >
              <h2 className="text-xl font-semibold mb-4 relative z-10">Availability</h2>
              <p className="text-sm text-muted-foreground relative z-10">
                I'm currently available for freelance work and new opportunities.
                My typical response time is within 24 hours.
              </p>
              
              <motion.div 
                className="absolute -right-8 -bottom-8 w-24 h-24 bg-primary/10 rounded-full"
                animate={{ scale: [0.9, 1.1, 0.9] }}
                transition={{ repeat: Infinity, duration: 4 }}
              />
              <motion.div 
                className="absolute right-10 -bottom-6 w-12 h-12 bg-primary/20 rounded-full"
                animate={{ scale: [1.1, 0.9, 1.1] }}
                transition={{ repeat: Infinity, duration: 3 }}
              />
            </motion.div>
            
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
