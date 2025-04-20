
import React from "react";
import { motion } from "framer-motion";
import { ArrowDownCircle, Hand } from "lucide-react";

export function ProjectScrollPrompt() {
  return (
    <div className="flex justify-center">
      <motion.div
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{
          type: "spring",
          stiffness: 100,
          damping: 15,
          delay: 0.3
        }}
        className="flex flex-col items-center gap-1"
      >
        <span className="text-xs font-mono text-foreground/60">
          Scroll to explore, use arrows below, or try <Hand size={12} className="inline mx-1" /> gesture controls
        </span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{
            repeat: Infinity,
            duration: 2,
            ease: "easeInOut"
          }}
        >
          <ArrowDownCircle size={20} className="text-foreground/60" />
        </motion.div>
      </motion.div>
    </div>
  );
}
