'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

export function AnimatedBackground() {
    const [particles, setParticles] = useState<Array<{ id: number; x: number; size: number; duration: number }>>([]);

    useEffect(() => {
        // Generate random particles
        const particleCount = 15;
        const newParticles = Array.from({ length: particleCount }).map((_, i) => ({
            id: i,
            x: Math.random() * 100, // percentage
            size: Math.random() * 20 + 10,
            duration: Math.random() * 10 + 10,
        }));
        setParticles(newParticles);
    }, []);

    return (
        <div className="fixed inset-0 -z-10 overflow-hidden">
            {/* Gradient Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#FFF5F8] via-[#E6E6FA] to-[#F0F8FF] animate-gradient-slow" />

            {/* Floating Particles */}
            {particles.map((particle) => (
                <motion.div
                    key={particle.id}
                    className="absolute bottom-0 rounded-full bg-rose/20 blur-sm"
                    style={{
                        left: `${particle.x}%`,
                        width: particle.size,
                        height: particle.size,
                    }}
                    animate={{
                        y: [0, -window.innerHeight - 100],
                        opacity: [0, 0.8, 0],
                    }}
                    transition={{
                        duration: particle.duration,
                        repeat: Infinity,
                        ease: "linear",
                        delay: Math.random() * 10,
                    }}
                />
            ))}
        </div>
    );
}
