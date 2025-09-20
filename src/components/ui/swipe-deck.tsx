import { useState, useRef } from 'react';
import { motion, useMotionValue, useTransform, PanInfo } from 'framer-motion';
import { Check, X, ExternalLink, Clock, Building } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import type { Grant } from '@/lib/types';

interface SwipeDeckProps {
  grants: Grant[];
  currentIndex: number;
  onSwipe: (grantId: string, direction: 'left' | 'right') => void;
  onComplete: () => void;
}

export function SwipeDeck({ grants, currentIndex, onSwipe, onComplete }: SwipeDeckProps) {
  const [dragDirection, setDragDirection] = useState<'left' | 'right' | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  const currentGrant = grants[currentIndex];
  const nextGrant = grants[currentIndex + 1];

  if (!currentGrant) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center space-y-6">
        <div className="w-20 h-20 bg-gradient-to-r from-accent to-brand-gold rounded-full flex items-center justify-center">
          <Check className="w-10 h-10 text-white" />
        </div>
        <div className="space-y-2">
          <h3 className="text-2xl font-heading font-bold">Great job!</h3>
          <p className="text-muted-foreground max-w-md">
            You've reviewed all available grants. Check out your shortlist to see your saved opportunities.
          </p>
        </div>
        <Button onClick={onComplete} className="btn-hero">
          View My Shortlist
        </Button>
      </div>
    );
  }

  const isNearDeadline = (deadline: string) => {
    const deadlineDate = new Date(deadline);
    const today = new Date();
    const diffTime = deadlineDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 30;
  };

  const handleScroll = () => {
    if (!scrollRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
    const progress = (scrollTop / (scrollHeight - clientHeight)) * 100;
    setScrollProgress(Math.min(progress, 100));
  };

  const handleSwipeAction = (direction: 'left' | 'right') => {
    onSwipe(currentGrant.id, direction);
    setDragDirection(null);
    setScrollProgress(0);
  };

  return (
    <div className="relative max-w-6xl mx-auto">
      {/* Progress indicator */}
      <div className="mb-6 text-center">
        <p className="text-sm text-muted-foreground mb-2">
          Grant {currentIndex + 1} of {grants.length}
        </p>
        <Progress 
          value={((currentIndex + 1) / grants.length) * 100} 
          className="w-full max-w-md mx-auto h-2"
        />
      </div>

      <div className="relative h-[400px] perspective-1000">
        {/* Next card (behind) */}
        {nextGrant && (
          <motion.div
            className="absolute inset-0 w-full"
            initial={{ scale: 0.95, opacity: 0.7 }}
            animate={{ scale: 0.95, opacity: 0.7 }}
          >
            <GrantCard grant={nextGrant} isInteractive={false} />
          </motion.div>
        )}

        {/* Current card */}
        <SwipeableCard
          grant={currentGrant}
          onSwipe={handleSwipeAction}
          onDragDirection={setDragDirection}
          scrollRef={scrollRef}
          onScroll={handleScroll}
          scrollProgress={scrollProgress}
        />

        {/* Swipe overlays */}
        {dragDirection && (
          <motion.div
            className={cn(
              "absolute inset-0 rounded-2xl flex items-center justify-center z-20 pointer-events-none",
              dragDirection === 'right' ? "swipe-accept" : "swipe-reject"
            )}
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.9 }}
            exit={{ opacity: 0 }}
          >
            {dragDirection === 'right' ? (
              <Check className="w-24 h-24" />
            ) : (
              <X className="w-24 h-24" />
            )}
          </motion.div>
        )}
      </div>

      {/* Action buttons */}
      <div className="flex justify-center gap-6 mt-8">
        <Button
          variant="outline"
          size="lg"
          onClick={() => handleSwipeAction('left')}
          className="w-16 h-16 rounded-full p-0 border-2 hover:border-red-400 hover:text-red-500"
        >
          <X className="w-6 h-6" />
        </Button>
        
        <Button
          size="lg"
          onClick={() => handleSwipeAction('right')}
          className="w-16 h-16 rounded-full p-0 bg-gradient-to-r from-green-500 to-emerald-400 hover:from-green-600 hover:to-emerald-500"
        >
          <Check className="w-6 h-6" />
        </Button>
      </div>
    </div>
  );
}

function SwipeableCard({ 
  grant, 
  onSwipe, 
  onDragDirection,
  scrollRef,
  onScroll,
  scrollProgress
}: {
  grant: Grant;
  onSwipe: (direction: 'left' | 'right') => void;
  onDragDirection: (direction: 'left' | 'right' | null) => void;
  scrollRef: React.RefObject<HTMLDivElement>;
  onScroll: () => void;
  scrollProgress: number;
}) {
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-25, 25]);
  const opacity = useTransform(x, [-200, -100, 0, 100, 200], [0, 1, 1, 1, 0]);

  const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const threshold = 100;
    
    if (Math.abs(info.offset.x) > threshold) {
      const direction = info.offset.x > 0 ? 'right' : 'left';
      onSwipe(direction);
    }
    
    onDragDirection(null);
  };

  const handleDrag = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const threshold = 50;
    
    if (Math.abs(info.offset.x) > threshold) {
      onDragDirection(info.offset.x > 0 ? 'right' : 'left');
    } else {
      onDragDirection(null);
    }
  };

  return (
    <motion.div
      className="absolute inset-0 w-full cursor-grab active:cursor-grabbing z-10"
      style={{ x, rotate, opacity }}
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      onDrag={handleDrag}
      onDragEnd={handleDragEnd}
      whileDrag={{ scale: 1.02 }}
    >
      <GrantCard 
        grant={grant} 
        isInteractive={true}
        scrollRef={scrollRef}
        onScroll={onScroll}
        scrollProgress={scrollProgress}
      />
    </motion.div>
  );
}

function GrantCard({ 
  grant, 
  isInteractive,
  scrollRef,
  onScroll,
  scrollProgress
}: {
  grant: Grant;
  isInteractive: boolean;
  scrollRef?: React.RefObject<HTMLDivElement>;
  onScroll?: () => void;
  scrollProgress?: number;
}) {
  const isNearDeadline = (deadline: string) => {
    const deadlineDate = new Date(deadline);
    const today = new Date();
    const diffTime = deadlineDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 30;
  };

  const formatDeadline = (deadline: string) => {
    const date = new Date(deadline);
    return date.toLocaleDateString('en-MY', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  return (
    <Card className="card-landscape h-full shadow-xl border-0">
      <CardContent className="p-0 h-full">
        <div className="grid grid-cols-5 h-full">
          {/* Left section - 2/5 width */}
          <div className="col-span-2 p-8 bg-gradient-to-br from-neutral-light to-white">
            <div className="space-y-6">
              {/* Agency logo */}
              <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-r from-primary to-brand-navy rounded-xl text-white text-xl font-bold">
                {grant.logo || grant.agency.substring(0, 2).toUpperCase()}
              </div>

              {/* Grant title */}
              <div className="space-y-2">
                <h3 className="text-xl font-heading font-bold text-foreground leading-tight">
                  {grant.title}
                </h3>
                <p className="text-sm text-muted-foreground flex items-center gap-1">
                  <Building className="w-4 h-4" />
                  {grant.agency}
                </p>
              </div>

              {/* Amount */}
              <div className="space-y-1">
                <span className="text-sm text-muted-foreground">Funding Amount</span>
                <p className="text-2xl font-bold text-gradient-gold">
                  {grant.amount}
                </p>
              </div>

              {/* Deadline */}
              <div className="space-y-1">
                <span className="text-sm text-muted-foreground">Application Deadline</span>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span className={cn(
                    "font-medium",
                    isNearDeadline(grant.deadline) ? "text-red-500" : "text-foreground"
                  )}>
                    {formatDeadline(grant.deadline)}
                  </span>
                  {isNearDeadline(grant.deadline) && (
                    <Badge variant="destructive" className="text-xs">
                      Urgent
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Right section - 3/5 width */}
          <div className="col-span-3 flex flex-col h-full">
            <div 
              ref={scrollRef}
              onScroll={onScroll}
              className="flex-1 p-8 overflow-y-auto space-y-6"
            >
              {/* AI Summary */}
              <div className="space-y-3">
                <h4 className="font-semibold text-lg text-foreground">Why this matches you</h4>
                <p className="text-muted-foreground leading-relaxed">
                  {grant.summary}
                </p>
                {grant.score && (
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">Match Score:</span>
                    <div className="flex items-center gap-1">
                      <Progress value={grant.score * 100} className="w-20 h-2" />
                      <span className="text-sm font-medium text-accent">
                        {Math.round(grant.score * 100)}%
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Eligibility */}
              <div className="space-y-3">
                <h4 className="font-semibold text-lg text-foreground">Eligibility Requirements</h4>
                <ul className="space-y-2">
                  {grant.eligibility.map((requirement, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                      {requirement}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Timeline */}
              {grant.timeline && (
                <div className="space-y-3">
                  <h4 className="font-semibold text-lg text-foreground">Processing Timeline</h4>
                  <p className="text-sm text-muted-foreground">
                    {grant.timeline}
                  </p>
                </div>
              )}

              {/* Tags */}
              {grant.tags && grant.tags.length > 0 && (
                <div className="space-y-3">
                  <h4 className="font-semibold text-lg text-foreground">Categories</h4>
                  <div className="flex flex-wrap gap-2">
                    {grant.tags.map((tag, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* External link */}
              {grant.link && (
                <div className="pt-4">
                  <Button variant="outline" size="sm" asChild>
                    <a href={grant.link} target="_blank" rel="noopener noreferrer" className="gap-2">
                      <ExternalLink className="w-4 h-4" />
                      Official Details
                    </a>
                  </Button>
                </div>
              )}
            </div>

            {/* Scroll progress bar */}
            {isInteractive && (
              <div className="px-8 pb-4">
                <div className="h-1 bg-muted rounded-full overflow-hidden">
                  <motion.div
                    className="h-full progress-bar-gold"
                    style={{ width: `${scrollProgress || 0}%` }}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}