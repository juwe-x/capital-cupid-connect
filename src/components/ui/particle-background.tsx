import { motion } from 'framer-motion';

interface ParticleBackgroundProps {
  density?: 'low' | 'medium' | 'high';
  className?: string;
}

export function ParticleBackground({ density = 'medium', className = '' }: ParticleBackgroundProps) {
  const particleCount = density === 'low' ? 8 : density === 'medium' ? 15 : 25;
  
  const particles = Array.from({ length: particleCount }, (_, i) => ({
    id: i,
    type: Math.random() > 0.6 ? 'heart' : 'coin',
    size: Math.random() * 8 + 16, // 16-24px
    x: Math.random() * 100,
    y: Math.random() * 100,
    duration: Math.random() * 10 + 20, // 20-30 seconds
    delay: Math.random() * 5,
  }));

  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className={`absolute ${particle.type === 'heart' ? 'particle-heart' : 'particle-coin'}`}
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            fontSize: `${particle.size}px`,
          }}
          animate={{
            y: [0, -100, -200, -300],
            x: [0, Math.random() * 20 - 10, Math.random() * 30 - 15],
            opacity: [0, 0.3, 0.4, 0.2, 0],
            rotate: [0, 360],
          }}
          transition={{
            duration: particle.duration,
            repeat: Infinity,
            delay: particle.delay,
            ease: "easeOut",
          }}
        >
          {particle.type === 'heart' ? '💘' : '💵'}
        </motion.div>
      ))}
    </div>
  );
}