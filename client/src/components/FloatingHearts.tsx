import { useEffect, useState } from "react";

export function FloatingHearts() {
  const [hearts, setHearts] = useState<Array<{ id: number; left: number; delay: number }>>([]);

  useEffect(() => {
    // Create 15 floating hearts
    const newHearts = Array.from({ length: 15 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 15,
    }));
    setHearts(newHearts);
  }, []);

  return (
    <div className="hearts-background">
      {hearts.map((heart) => (
        <div
          key={heart.id}
          className="heart-float"
          style={{
            left: `${heart.left}%`,
            animationDelay: `${heart.delay}s`,
          }}
        >
          💕
        </div>
      ))}
    </div>
  );
}
