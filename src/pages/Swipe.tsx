import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { SwipeDeck } from '@/components/ui/swipe-deck';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { useProfileStore } from '@/lib/stores/profile-store';
import { useDeckStore } from '@/lib/stores/deck-store';
import { grantsApi } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';
import type { Grant, SwipeDecision } from '@/lib/types';

export default function Swipe() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { profile } = useProfileStore();
  const { 
    grants, 
    currentIndex, 
    setGrants, 
    nextCard, 
    addDecision, 
    addToShortlist 
  } = useDeckStore();
  
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check if user has completed onboarding
    if (!profile.isComplete) {
      navigate('/onboarding');
      return;
    }

    loadMatches();
  }, [profile, navigate]);

  const loadMatches = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await grantsApi.match(profile);
      setGrants(response.grants);
      
      if (response.grants.length === 0) {
        setError('No matching grants found. Try updating your profile preferences.');
      }
    } catch (err) {
      console.error('Failed to load matches:', err);
      setError('Failed to load grant matches. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSwipe = (grantId: string, direction: 'left' | 'right') => {
    const decision: SwipeDecision = {
      grantId,
      decision: direction === 'right' ? 'accept' : 'reject',
      timestamp: new Date().toISOString(),
    };

    addDecision(decision);

    if (direction === 'right') {
      addToShortlist(grantId);
      toast({
        title: "Added to shortlist! ❤️",
        description: "Grant saved to your shortlist for later review.",
      });
    }

    nextCard();
  };

  const handleComplete = () => {
    navigate('/shortlist');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        
        <div className="container py-20">
          <div className="flex flex-col items-center justify-center space-y-8">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="w-16 h-16 border-4 border-accent border-t-transparent rounded-full"
            />
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-heading font-bold">Finding your perfect matches...</h2>
              <p className="text-muted-foreground">
                Our AI is analyzing thousands of grants to find the best opportunities for your business.
              </p>
            </div>
          </div>
        </div>
        
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        
        <div className="container py-20">
          <div className="max-w-md mx-auto text-center space-y-6">
            <Card className="p-8">
              <CardContent className="space-y-4">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto">
                  <span className="text-red-500 text-2xl">⚠️</span>
                </div>
                <h2 className="text-xl font-heading font-bold">Oops! Something went wrong</h2>
                <p className="text-muted-foreground">{error}</p>
                <div className="flex gap-3">
                  <Button onClick={loadMatches} variant="outline" size="sm">
                    Try Again
                  </Button>
                  <Button onClick={() => navigate('/onboarding')} size="sm">
                    Update Profile
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
        
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container py-8">
        <div className="space-y-8">
          {/* Page Header */}
          <motion.div 
            className="text-center space-y-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center justify-center gap-2 text-accent">
              <Heart className="w-6 h-6" />
              <span className="text-sm font-medium uppercase tracking-wide">Grant Matching</span>
            </div>
            <h1 className="text-3xl lg:text-4xl font-heading font-bold">
              Swipe through your matched grants
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              We found {grants.length} grants that match your business profile. 
              Swipe right to shortlist, left to pass.
            </p>
          </motion.div>

          {/* Quick Stats */}
          <motion.div 
            className="flex justify-center gap-8 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <div>
              <div className="text-2xl font-bold text-accent">{grants.length}</div>
              <div className="text-sm text-muted-foreground">Total Matches</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-500">
                {useDeckStore.getState().shortlistIds.length}
              </div>
              <div className="text-sm text-muted-foreground">Shortlisted</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-muted-foreground">
                {currentIndex}
              </div>
              <div className="text-sm text-muted-foreground">Reviewed</div>
            </div>
          </motion.div>

          {/* Swipe Deck */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <SwipeDeck
              grants={grants}
              currentIndex={currentIndex}
              onSwipe={handleSwipe}
              onComplete={handleComplete}
            />
          </motion.div>

          {/* Instructions */}
          {currentIndex < grants.length && (
            <motion.div 
              className="text-center space-y-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <p className="text-sm text-muted-foreground">
                💡 Drag the card or use the buttons below to make your choice
              </p>
              <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full" />
                  <span>Swipe left to pass</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full" />
                  <span>Swipe right to shortlist</span>
                </div>
              </div>
            </motion.div>
          )}

          {/* Quick actions */}
          <motion.div 
            className="flex justify-center gap-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <Button variant="outline" onClick={() => navigate('/shortlist')}>
              View Shortlist ({useDeckStore.getState().shortlistIds.length})
            </Button>
            <Button variant="outline" onClick={() => navigate('/onboarding')}>
              Update Profile
            </Button>
          </motion.div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}