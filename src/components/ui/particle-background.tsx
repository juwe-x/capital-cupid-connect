import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';

interface ParticleBackgroundProps {
  density?: 'low' | 'medium' | 'high';
  className?: string;
  onBurst?: () => number;
}

interface FloatingIcon {
  id: string;
  type: 'heart' | 'money' | 'document';
  size: number;
  x: number;
  y: number;
  duration: number;
  delay: number;
  opacity: number;
}

export function ParticleBackground({ density = 'medium', className = '', onBurst }: ParticleBackgroundProps) {
  const [particles, setParticles] = useState<FloatingIcon[]>([]);
  const [burstIcons, setBurstIcons] = useState<FloatingIcon[]>([]);

  const iconTypes = ['heart', 'money', 'document'] as const;
  const icons = {
    heart: '💘',
    money: '💵',
    document: '📄'
  };

  const createParticle = (isBurst = false): FloatingIcon => ({
    id: Math.random().toString(36).substr(2, 9),
    type: iconTypes[Math.floor(Math.random() * iconTypes.length)],
    size: isBurst ? Math.random() * 12 + 20 : Math.random() * 8 + 16, // 16-24px normal, 20-32px burst
    x: Math.random() * 100,
    y: isBurst ? 80 + Math.random() * 20 : Math.random() * 100, // Burst starts near bottom
    duration: isBurst ? Math.random() * 3 + 2 : Math.random() * 10 + 20, // 2-5s burst, 20-30s normal
    delay: isBurst ? 0 : Math.random() * 5,
    opacity: isBurst ? 0.8 : Math.random() * 0.4 + 0.2, // 0.2-0.6 normal, 0.8 burst
  });

  // Initialize persistent particles
  useEffect(() => {
    const particleCount = density === 'low' ? 8 : density === 'medium' ? 15 : 20;
    const initialParticles = Array.from({ length: particleCount }, () => createParticle());
    setParticles(initialParticles);
  }, [density]);

  // Handle burst animation
  useEffect(() => {
    if (onBurst) {
      const burstValue = onBurst();
      if (burstValue > 0) {
        const handleBurst = () => {
          const burstCount = Math.floor(Math.random() * 3) + 3; // 3-5 icons
          const newBurstIcons = Array.from({ length: burstCount }, () => createParticle(true));
          setBurstIcons(newBurstIcons);

          // Remove burst icons after animation
          setTimeout(() => {
            setBurstIcons([]);
          }, 5000);
        };

        handleBurst();
      }
    }
  }, [onBurst]);

  const renderIcon = (particle: FloatingIcon, isBurst = false) => (
    <motion.div
      key={particle.id}
      className="absolute select-none"
      style={{
        left: `${particle.x}%`,
        top: `${particle.y}%`,
        fontSize: `${particle.size}px`,
      }}
      initial={isBurst ? { 
        y: 0, 
        x: 0, 
        opacity: particle.opacity,
        scale: 0.8 
      } : { 
        y: 0, 
        x: 0, 
        opacity: 0 
      }}
      animate={{
        y: isBurst ? [-20, -100, -200] : [0, -100, -200, -300],
        x: isBurst ? [Math.random() * 40 - 20, Math.random() * 60 - 30] : [0, Math.random() * 20 - 10, Math.random() * 30 - 15],
        opacity: isBurst ? [particle.opacity, particle.opacity * 0.8, 0] : [0, particle.opacity, particle.opacity * 0.8, 0],
        rotate: isBurst ? [0, Math.random() * 360] : [0, 360],
        scale: isBurst ? [0.8, 1, 0.8] : [1, 1, 1],
      }}
      transition={{
        duration: particle.duration,
        repeat: isBurst ? 0 : Infinity,
        delay: particle.delay,
        ease: isBurst ? "easeOut" : "easeOut",
      }}
    >
      {icons[particle.type]}
    </motion.div>
  );

  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      <AnimatePresence>
        {particles.map((particle) => renderIcon(particle))}
        {burstIcons.map((particle) => renderIcon(particle, true))}
      </AnimatePresence>
    </div>
  );
}