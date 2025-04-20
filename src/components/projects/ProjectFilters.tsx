
import React from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";

interface ProjectFiltersProps {
  allTags: string[];
  selectedTag: string | null;
  onSelectTag: (tag: string) => void;
}

export function ProjectFilters({ allTags, selectedTag, onSelectTag }: ProjectFiltersProps) {
  // Handle tag selection
  const handleTagSelect = (tag: string) => {
    if (selectedTag === tag) {
      onSelectTag("");
      toast.info("Showing all projects", { position: "bottom-center" });
    } else {
      onSelectTag(tag);
      toast.info(`Showing ${tag} projects`, { position: "bottom-center" });
    }
  };

  return (
    <div className="mb-6 overflow-x-auto pb-2 scrollbar-none">
      <div className="flex gap-2">
        {allTags.map(tag => (
          <motion.button
            key={tag}
            className={`px-3 py-1 rounded-full text-xs font-mono whitespace-nowrap transition-colors
              ${selectedTag === tag 
                ? 'bg-primary text-primary-foreground' 
                : 'bg-primary/10 hover:bg-primary/20 text-foreground'
              }`}
            onClick={() => handleTagSelect(tag)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
          >
            {tag}
          </motion.button>
        ))}
      </div>
    </div>
  );
}
