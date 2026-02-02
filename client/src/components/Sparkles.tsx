import { useEffect, useState } from "react";

export function Sparkles() {
  const [sparkles, setSparkles] = useState<Array<{ id: number; top: number; left: number; delay: number }>>([]);

  useEffect(() => {
    // Create sparkles in corners
    const newSparkles = Array.from({ length: 8 }, (_, i) => ({
      id: i,
      top: i < 4 ? Math.random() * 20 : 80 + Math.random() * 20,
      left: i % 2 === 0 ? Math.random() * 10 : 90 + Math.random() * 10,
      delay: Math.random() * 2,
    }));
    setSparkles(newSparkles);
  }, []);

  return (
    <>
      {sparkles.map((sparkle) => (
        <div
          key={sparkle.id}
          className="sparkle"
          style={{
            top: `${sparkle.top}%`,
            left: `${sparkle.left}%`,
            animationDelay: `${sparkle.delay}s`,
          }}
        />
      ))}
    </>
  );
}
