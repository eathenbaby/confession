import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

interface NoButtonProps {
  onHover: () => void;
}

const PHRASES = [
  "No 😢",
  "Are you sure?",
  "Think again! 👀",
  "Really?",
  "Last chance!",
  "Don't do this!",
  "Have a heart 💔",
  "I'm gonna cry...",
  "You're breaking my heart",
  "Just click YES!",
  "Why are you like this?",
];

export function NoButton({ onHover }: NoButtonProps) {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [textIndex, setTextIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const moveButton = () => {
    const maxX = window.innerWidth - 100;
    const maxY = window.innerHeight - 50;
    const newX = Math.random() * (maxX / 2) * (Math.random() > 0.5 ? 1 : -1);
    const newY = Math.random() * (maxY / 2) * (Math.random() > 0.5 ? 1 : -1);

    setPosition({ x: newX, y: newY });
    setTextIndex((prev) => (prev + 1) % PHRASES.length);
    onHover();
  };

  return (
    <motion.div
      animate={{ x: position.x, y: position.y }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="relative z-50 inline-block"
    >
      <Button
        variant="outline"
        className="rounded-full border-2 border-rose-200 text-rose-500 hover:bg-rose-50 hover:text-rose-600 transition-colors font-bold text-lg min-w-[120px]"
        onMouseEnter={!isMobile ? moveButton : undefined}
        onTouchStart={isMobile ? moveButton : undefined}
        onClick={moveButton}
      >
        {PHRASES[textIndex]}
      </Button>
    </motion.div>
  );
}
