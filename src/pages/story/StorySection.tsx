import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import StoryCard from "./components/StoryCard";
import { usePostStore } from "@/stores/usePostStore";
import { STORY } from "@/utils/interface";

const StorySection = () => {
  const { homeStories } = usePostStore();
  const [scrollPosition, setScrollPosition] = useState(0);
  const [maxScroll, setMaxScroll] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeStoryIndex, setActiveStoryIndex] = useState<number | null>(null);

  const groupedStories = homeStories.reduce(
    (acc: Record<string, STORY[]>, story: STORY) => {
      const userId = story.user?.id || "";
      if (!acc[userId]) {
        acc[userId] = [];
      }
      acc[userId].push(story);
      return acc;
    },
    {}
  );

  const userStories = Object.values(groupedStories) as STORY[][];

  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      const updateMaxScroll = () => {
        setMaxScroll(container.scrollWidth - container.offsetWidth);
        setScrollPosition(container.scrollLeft);
      };
      updateMaxScroll();
      window.addEventListener("resize", updateMaxScroll);
      return () => window.removeEventListener("resize", updateMaxScroll);
    }
  }, [userStories.length]);

  const scroll = (direction: string) => {
    const container = containerRef.current;
    if (container) {
      const scrollAmount = direction === "left" ? -200 : 200;
      container.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  const handleScroll = () => {
    const container = containerRef.current;
    if (container) {
      setScrollPosition(container.scrollLeft);
    }
  };

  // Hàm để chuyển sang cụm story tiếp theo
  const handleNextUserStory = (currentIndex: number) => {
    const nextIndex = currentIndex + 1;
    if (nextIndex < userStories.length) {
      setActiveStoryIndex(nextIndex);
      return true;
    }
    setActiveStoryIndex(null);
    return false;
  };

  // Hàm để chuyển sang cụm story trước đó
  const handlePreviousUserStory = (currentIndex: number) => {
    const prevIndex = currentIndex - 1;
    if (prevIndex >= 0) {
      setActiveStoryIndex(prevIndex);
      return true;
    }
    return false;
  };

  return (
    <div className="relative">
      <div
        ref={containerRef}
        onScroll={handleScroll}
        className="flex space-x-2 overflow-x-hidden py-4"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        <motion.div
          className="flex space-x-2"
          drag="x"
          dragConstraints={{
            right: 0,
            left:
              -((userStories.length + 1) * 200) +
              (containerRef.current ? containerRef.current.offsetWidth : 0),
          }}
        >
          <StoryCard isAddStory={true} stories={homeStories} />
          {userStories.map((stories: STORY[], index: number) => (
            <StoryCard
              key={stories[0].user?.id || index}
              stories={stories}
              userIndex={index}
              isActive={activeStoryIndex === index}
              onStoryStart={(idx: number) => setActiveStoryIndex(idx)}
              onStoryEnd={() => setActiveStoryIndex(null)}
              onNextUserStory={() => handleNextUserStory(index)}
              onPreviousUserStory={() => handlePreviousUserStory(index)}
            />
          ))}
        </motion.div>

        {/* Left side scroll button */}
        {scrollPosition > 0 && (
          <Button
            variant="outline"
            size="icon"
            className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white dark:bg-gray-800 rounded-full shadow-lg transition-opacity duration-300 ease-in-out"
            onClick={() => scroll("left")}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
        )}

        {/* Right side scroll button */}
        {scrollPosition < maxScroll && userStories.length > 3 && (
          <Button
            variant="outline"
            size="icon"
            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white dark:bg-gray-800 rounded-full shadow-lg transition-opacity duration-300 ease-in-out"
            onClick={() => scroll("right")}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
};

export default StorySection;
