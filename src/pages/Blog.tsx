
import { useState, useRef, useEffect } from "react";
import { PageTransition } from "@/components/PageTransition";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, Search, ArrowUpRight, BookOpen, Tag } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { motion } from "framer-motion";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";

export const blogPosts = [
  {
    id: 1,
    title: "Harnessing AR/VR for Natural Disaster Preparedness",
    excerpt: "Natural disasters have always posed significant threats to humanity, but modern technology is beginning to offer innovative ways to prepare for and mitigate their effects.",
    date: "April 20, 2025",
    category: "Technology",
    readTime: "6   min read",
    tags: ["Design", "Unity", "VR", "AR"],
    popularity: 85,
  },
];

export default function Blog() {
  const [searchTerm, setSearchTerm] = useState("");
  const [readingMode, setReadingMode] = useState(false);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [activePost, setActivePost] = useState<number | null>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  
  const allTags = Array.from(new Set(blogPosts.flatMap(post => post.tags)));
  
  const filteredPosts = blogPosts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         post.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesTags = selectedTags.length === 0 || 
                       selectedTags.some(tag => post.tags.includes(tag));
    
    return matchesSearch && matchesTags;
  });
  
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchInputRef.current) {
        searchInputRef.current.focus();
      }
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);
  
  const toggleTag = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag) 
        : [...prev, tag]
    );
  };
  
  return (
    <PageTransition>
      <div className="page-container">
        <h1 className="section-title">Blog</h1>
        <p className="text-lg text-muted-foreground mb-8">
          Thoughts, insights, and tutorials about research and design.
        </p>
        
        <div className="flex flex-col md:flex-row gap-4 mb-8 items-start">
          <div className="relative w-full md:w-2/3">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              ref={searchInputRef}
              className="pl-10 pr-4"
              placeholder="Search articles..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            
            {searchTerm && (
              <motion.div 
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute right-3 top-1/2 -translate-y-1/2"
              >
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-8 px-2"
                  onClick={() => setSearchTerm("")}
                >
                  Clear
                </Button>
              </motion.div>
            )}
          </div>
          
          <div className="flex items-center gap-2 w-full md:w-1/3 justify-end">
            <span className="text-sm text-muted-foreground">Reading Mode</span>
            <Button
              variant={readingMode ? "default" : "outline"}
              size="sm"
              onClick={() => setReadingMode(!readingMode)}
              className="transition-all duration-300"
            >
              <BookOpen className="h-4 w-4 mr-1" />
              {readingMode ? "On" : "Off"}
            </Button>
          </div>
        </div>
        
        <div className="mb-6 flex flex-wrap gap-2">
          <span className="text-sm font-medium mr-2 flex items-center">
            <Tag className="h-4 w-4 mr-1" /> 
            Filter by tags:
          </span>
          {allTags.map(tag => (
            <Badge 
              key={tag}
              variant={selectedTags.includes(tag) ? "default" : "outline"}
              className="cursor-pointer hover:scale-105 transition-all"
              onClick={() => toggleTag(tag)}
            >
              {tag}
            </Badge>
          ))}
        </div>
        
        <div className={`space-y-6 ${readingMode ? "max-w-2xl mx-auto" : ""}`}>
          {filteredPosts.length > 0 ? (
            filteredPosts.map((post) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                whileHover={{ 
                  scale: 1.02,
                  transition: { duration: 0.2 }
                }}
                onMouseEnter={() => setActivePost(post.id)}
                onMouseLeave={() => setActivePost(null)}
              >
                <Link to={`/blog/${post.id}`}>
                  <Card className={`overflow-hidden transition-all ${readingMode ? "border-none shadow-none" : "hover:shadow-md"} animate-fade-in`}>
                    <CardHeader>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="text-xs px-2 py-1 bg-secondary text-secondary-foreground rounded-full">
                            {post.category}
                          </span>
                          <span className="text-xs text-muted-foreground">{post.date}</span>
                        </div>
                        
                        <HoverCard>
                          <HoverCardTrigger asChild>
                            <div className="relative h-6 w-20">
                              <Slider 
                                value={[post.popularity]} 
                                max={100} 
                                disabled 
                                className="h-1.5"
                              />
                              <span className="absolute -top-1 right-0 text-xs font-medium">
                                {post.popularity}%
                              </span>
                            </div>
                          </HoverCardTrigger>
                          <HoverCardContent className="w-48">
                            <div className="text-sm">
                              <p className="font-medium">Popularity Score</p>
                              <p className="text-xs text-muted-foreground">Based on reader engagement</p>
                            </div>
                          </HoverCardContent>
                        </HoverCard>
                      </div>
                      
                      <CardTitle className="group">
                        <Link to={`/blog/${post.id}`} className="inline-flex items-center hover:text-primary transition-colors">
                          {post.title}
                          {activePost === post.id && (
                            <motion.div
                              initial={{ opacity: 0, x: -5 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ duration: 0.2 }}
                            >
                              <ArrowUpRight className="ml-2 h-4 w-4 text-primary" />
                            </motion.div>
                          )}
                        </Link>
                      </CardTitle>
                      <CardDescription>{post.readTime}</CardDescription>
                    </CardHeader>
                    
                    <CardContent>
                      <p>{post.excerpt}</p>
                    </CardContent>
                    
                    <CardFooter className="flex justify-between">
                      <Button asChild variant="ghost" className="p-0 hover:bg-transparent">
                        <Link to={`/blog/${post.id}`} className="flex items-center text-primary font-medium">
                          Read more <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                      </Button>
                      
                      <div className="flex gap-1">
                        {post.tags.map(tag => (
                          <Badge key={tag} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </CardFooter>
                  </Card>
                </Link>
              </motion.div>
            ))
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-10"
            >
              <p className="text-muted-foreground">No articles found matching your search criteria.</p>
              <Button 
                variant="outline" 
                className="mt-4"
                onClick={() => {
                  setSearchTerm("");
                  setSelectedTags([]);
                }}
              >
                Reset Filters
              </Button>
            </motion.div>
          )}
        </div>
      </div>
    </PageTransition>
  );
}
