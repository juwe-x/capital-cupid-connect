import { motion } from 'framer-motion';
import { Heart, Coins } from 'lucide-react';

interface ParticleBackgroundProps {
  density?: 'low' | 'medium' | 'high';
  className?: string;
}

export function ParticleBackground({ density = 'medium', className = '' }: ParticleBackgroundProps) {
  const particleCount = density === 'low' ? 8 : density === 'medium' ? 15 : 25;
  
  const particles = Array.from({ length: particleCount }, (_, i) => ({
    id: i,
    type: Math.random() > 0.6 ? 'heart' : 'coin',
    size: Math.random() * 0.5 + 0.5, // 0.5 to 1
    x: Math.random() * 100,
    y: Math.random() * 100,
    duration: Math.random() * 10 + 15, // 15-25 seconds
    delay: Math.random() * 5,
  }));

  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            transform: `scale(${particle.size})`,
          }}
          animate={{
            y: [-20, -40, -20],
            x: [-5, 5, -5],
            opacity: [0.2, 0.6, 0.2],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: particle.duration,
            repeat: Infinity,
            delay: particle.delay,
            ease: "easeInOut",
          }}
        >
          {particle.type === 'heart' ? (
            <Heart className="w-4 h-4 text-primary/20 fill-current" />
          ) : (
            <Coins className="w-4 h-4 text-accent/20" />
          )}
        </motion.div>
      ))}
    </div>
  );
}