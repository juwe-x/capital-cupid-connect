import { motion, PanInfo, useMotionValue, useTransform, useSpring } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Building, Target, DollarSign, FileText, Heart, Zap, Check, X } from 'lucide-react';

interface TinderCard {
  id: string;
  title: string;
  agency: string;
  amount: string;
  icon: React.ComponentType<any>;
  gradient: string;
  description: string;
}

const mockCards: TinderCard[] = [
  {
    id: '1',
    title: 'Digital Transformation Grant',
    agency: 'MDEC',
    amount: 'RM 50,000',
    icon: Zap,
    gradient: 'from-blue-500 to-purple-600',
    description: 'Accelerate your digital journey with cutting-edge technology adoption'
  },
  {
    id: '2',
    title: 'SME Innovation Fund',
    agency: 'SIRIM',
    amount: 'RM 100,000',
    icon: Target,
    gradient: 'from-green-500 to-teal-600',
    description: 'Transform your innovative ideas into market-ready solutions'
  },
  {
    id: '3',
    title: 'Export Development Grant',
    agency: 'MATRADE',
    amount: 'RM 75,000',
    icon: Building,
    gradient: 'from-orange-500 to-red-600',
    description: 'Expand your business globally with international market support'
  },
  {
    id: '4',
    title: 'Technology Adoption Fund',
    agency: 'MOSTI',
    amount: 'RM 200,000',
    icon: FileText,
    gradient: 'from-pink-500 to-rose-600',
    description: 'Embrace Industry 4.0 technologies for competitive advantage'
  },
  {
    id: '5',
    title: 'Startup Growth Fund',
    agency: 'Cradle',
    amount: 'RM 150,000',
    icon: Heart,
    gradient: 'from-indigo-500 to-blue-600',
    description: 'Scale your startup with comprehensive growth support'
  }
];

export function TinderShuffleCards() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [dragDirection, setDragDirection] = useState<'left' | 'right' | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isIdleFloating, setIsIdleFloating] = useState(true);

  // Motion values for smooth spring physics
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-15, 15]);
  const opacity = useTransform(x, [-200, -100, 0, 100, 200], [0, 1, 1, 1, 0]);

  // Idle floating animation values
  const idleX = useMotionValue(0);
  const idleY = useMotionValue(0);
  const idleRotate = useMotionValue(0);

  // Spring configuration for natural feel
  const springConfig = { stiffness: 300, damping: 30 };
  const idleSpringConfig = { stiffness: 100, damping: 20 };

  // Idle floating animation
  useEffect(() => {
    if (!isDragging && isIdleFloating) {
      const floatAnimation = () => {
        const driftX = (Math.random() - 0.5) * 20; // -10 to +10
        const driftY = (Math.random() - 0.5) * 8; // -4 to +4
        const driftRotate = (Math.random() - 0.5) * 4; // -2 to +2 degrees
        
        idleX.set(driftX, { ...idleSpringConfig, duration: 3000 });
        idleY.set(driftY, { ...idleSpringConfig, duration: 3000 });
        idleRotate.set(driftRotate, { ...idleSpringConfig, duration: 3000 });
      };

      const interval = setInterval(floatAnimation, 4000);
      floatAnimation(); // Start immediately

      return () => clearInterval(interval);
    }
  }, [isDragging, isIdleFloating, idleX, idleY, idleRotate]);

  // Auto-shuffle with Tinder-style swipe every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      if (!isAnimating && !isDragging) {
        handleIdleSwipe();
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [isAnimating, isDragging]);

  const handleIdleSwipe = () => {
    setIsAnimating(true);
    const swipeDirection = Math.random() > 0.5 ? 'right' : 'left';
    setDragDirection(swipeDirection);
    
    // Animate the swipe
    const exitX = swipeDirection === 'right' ? 400 : -400;
    const exitY = -50;
    const exitRotate = swipeDirection === 'right' ? 15 : -15;
    
    x.set(exitX, { ...springConfig, duration: 500 });
    y.set(exitY, { ...springConfig, duration: 500 });
    rotate.set(exitRotate, { ...springConfig, duration: 500 });
    
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % mockCards.length);
      x.set(0);
      y.set(0);
      rotate.set(0);
      setDragDirection(null);
      setIsAnimating(false);
    }, 500);
  };

  const currentCard = mockCards[currentIndex];
  const nextCard = mockCards[(currentIndex + 1) % mockCards.length];
  const prevCard = mockCards[(currentIndex - 1 + mockCards.length) % mockCards.length];

  const handleDragStart = () => {
    setIsDragging(true);
    setIsIdleFloating(false);
  };

  const handleDrag = (event: any, info: PanInfo) => {
    const threshold = 30;
    if (info.offset.x > threshold) {
      setDragDirection('right');
    } else if (info.offset.x < -threshold) {
      setDragDirection('left');
    } else {
      setDragDirection(null);
    }
  };

  const handleDragEnd = (event: any, info: PanInfo) => {
    setIsDragging(false);
    const threshold = 80;
    
    if (info.offset.x > threshold) {
      // Swipe right - Yes
      handleSwipe('right');
    } else if (info.offset.x < -threshold) {
      // Swipe left - No
      handleSwipe('left');
    } else {
      // Return to center and resume floating
      x.set(0, { ...springConfig, duration: 200 });
      y.set(0, { ...springConfig, duration: 200 });
      rotate.set(0, { ...springConfig, duration: 200 });
      setIsIdleFloating(true);
    }
    setDragDirection(null);
  };

  const handleSwipe = (direction: 'left' | 'right') => {
    const exitX = direction === 'right' ? 400 : -400;
    const exitY = -50;
    const exitRotate = direction === 'right' ? 15 : -15;
    
    x.set(exitX, { ...springConfig, duration: 500 });
    y.set(exitY, { ...springConfig, duration: 500 });
    rotate.set(exitRotate, { ...springConfig, duration: 500 });
    
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % mockCards.length);
      x.set(0);
      y.set(0);
      rotate.set(0);
      setIsIdleFloating(true);
    }, 500);
  };

  return (
    <div className="relative w-80 h-96 mx-auto">
      {/* Background cards for depth */}
      <motion.div
        className="absolute inset-0 bg-white/20 backdrop-blur-sm rounded-2xl shadow-lg border border-white/30"
        style={{ 
          transform: 'translate(12px, 12px) scale(0.95)',
          zIndex: 1
        }}
        animate={{
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      
      <motion.div
        className="absolute inset-0 bg-white/10 backdrop-blur-sm rounded-2xl shadow-md border border-white/20"
        style={{ 
          transform: 'translate(6px, 6px) scale(0.98)',
          zIndex: 2
        }}
        animate={{
          opacity: [0.2, 0.4, 0.2],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 0.5
        }}
      />

      {/* Main draggable card */}
      <motion.div
        className={`relative w-full h-full bg-white rounded-2xl tinder-card border border-white/40 overflow-hidden cursor-grab active:cursor-grabbing ${isIdleFloating && !isDragging ? 'tinder-card-idle' : ''}`}
        style={{ 
          zIndex: 3,
          x: isDragging ? x : idleX,
          y: isDragging ? y : idleY,
          rotate: isDragging ? rotate : idleRotate,
        }}
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.1}
        onDragStart={handleDragStart}
        onDrag={handleDrag}
        onDragEnd={handleDragEnd}
        animate={{
          scale: isDragging ? 1.05 : 1,
        }}
        transition={{
          duration: 0.3,
          ease: "easeOut"
        }}
        whileDrag={{
          scale: 1.05,
          zIndex: 10,
        }}
      >
        {/* Glow effect */}
        <motion.div
          className="absolute inset-0 rounded-2xl"
          style={{
            background: `linear-gradient(135deg, #ff4081, #ffc107)`,
            opacity: 0.1,
            filter: 'blur(20px)'
          }}
          animate={{
            opacity: [0.05, 0.15, 0.05],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />

        {/* Swipe overlays with smooth scaling and glow effects */}
        <motion.div
          className="absolute inset-0 flex items-center justify-center pointer-events-none"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ 
            opacity: dragDirection === 'right' ? 1 : 0,
            scale: dragDirection === 'right' ? 1 : 0.95
          }}
          transition={{ 
            duration: 0.2, 
            ease: "easeInOut",
            opacity: { duration: 0.2 },
            scale: { duration: 0.2 }
          }}
        >
          <div className="relative">
            {/* Soft glow background */}
            <div className="absolute inset-0 bg-green-500/20 rounded-3xl blur-xl scale-150" />
            <div className="absolute inset-0 bg-green-500/10 rounded-3xl blur-2xl scale-200" />
            {/* Main overlay */}
            <div className="relative bg-green-500/85 text-white px-8 py-4 rounded-2xl flex items-center gap-2 text-2xl font-bold shadow-2xl border-2 border-green-400/50 backdrop-blur-sm">
              <Check className="w-8 h-8" />
              YES
            </div>
          </div>
        </motion.div>

        <motion.div
          className="absolute inset-0 flex items-center justify-center pointer-events-none"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ 
            opacity: dragDirection === 'left' ? 1 : 0,
            scale: dragDirection === 'left' ? 1 : 0.95
          }}
          transition={{ 
            duration: 0.2, 
            ease: "easeInOut",
            opacity: { duration: 0.2 },
            scale: { duration: 0.2 }
          }}
        >
          <div className="relative">
            {/* Soft glow background */}
            <div className="absolute inset-0 bg-red-500/20 rounded-3xl blur-xl scale-150" />
            <div className="absolute inset-0 bg-red-500/10 rounded-3xl blur-2xl scale-200" />
            {/* Main overlay */}
            <div className="relative bg-red-500/85 text-white px-8 py-4 rounded-2xl flex items-center gap-2 text-2xl font-bold shadow-2xl border-2 border-red-400/50 backdrop-blur-sm">
              <X className="w-8 h-8" />
              NO
            </div>
          </div>
        </motion.div>

        {/* Card content */}
        <div className="relative z-10 p-6 h-full flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${currentCard.gradient} flex items-center justify-center`}>
              <currentCard.icon className="w-6 h-6 text-white" />
            </div>
            <div className="text-right">
              <div className="text-xs text-muted-foreground font-medium">Funding</div>
              <div className="text-lg font-bold text-gradient-gold">{currentCard.amount}</div>
            </div>
          </div>

          {/* Title */}
          <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">
            {currentCard.title}
          </h3>

          {/* Agency */}
          <p className="text-sm text-muted-foreground mb-3">
            {currentCard.agency}
          </p>

          {/* Description */}
          <p className="text-sm text-gray-600 mb-4 line-clamp-2">
            {currentCard.description}
          </p>

          {/* Match Score */}
          <div className="flex-1 space-y-3">
            <div className="space-y-2">
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-brand-gold to-brand-magenta rounded-full"
                  animate={{
                    width: ['0%', '85%', '100%'],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />
              </div>
              <div className="text-xs text-muted-foreground">Match Score: 85%</div>
            </div>

            <div className="flex flex-wrap gap-2">
              <span className="px-2 py-1 bg-brand-gold/10 text-brand-gold text-xs rounded-full">
                Technology
              </span>
              <span className="px-2 py-1 bg-brand-magenta/10 text-brand-magenta text-xs rounded-full">
                Innovation
              </span>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-4 pt-4 border-t border-gray-100">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>Deadline: Dec 2024</span>
              <span className="flex items-center gap-1">
                <Heart className="w-3 h-3" />
                Shortlisted
              </span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Next card preview (slides in from right) */}
      <motion.div
        className="absolute inset-0 bg-white rounded-2xl shadow-lg border border-white/30 opacity-0"
        style={{ zIndex: 1 }}
        initial={{ x: 100, opacity: 0 }}
        animate={{
          x: isAnimating ? [100, 0] : 100,
          opacity: isAnimating ? [0, 0.3, 0] : 0,
          scale: isAnimating ? [0.95, 0.95, 0.95] : 0.95,
        }}
        transition={{
          duration: 0.5,
          ease: "easeInOut"
        }}
      >
        <div className="p-6 h-full flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${nextCard.gradient} flex items-center justify-center`}>
              <nextCard.icon className="w-6 h-6 text-white" />
            </div>
            <div className="text-right">
              <div className="text-xs text-muted-foreground font-medium">Funding</div>
              <div className="text-lg font-bold text-gradient-gold">{nextCard.amount}</div>
            </div>
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">
            {nextCard.title}
          </h3>
          <p className="text-sm text-muted-foreground">
            {nextCard.agency}
          </p>
        </div>
      </motion.div>
    </div>
  );
}
