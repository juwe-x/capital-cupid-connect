import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, Trash2, ExternalLink, Clock, Building, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { useDeckStore } from '@/lib/stores/deck-store';
import { grantsApi } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import type { Grant } from '@/lib/types';

export default function Shortlist() {
  const { toast } = useToast();
  const { shortlistIds, removeFromShortlist } = useDeckStore();
  const [grants, setGrants] = useState<Grant[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadShortlistedGrants();
  }, [shortlistIds]);

  const loadShortlistedGrants = async () => {
    try {
      setIsLoading(true);
      if (shortlistIds.length === 0) {
        setGrants([]);
        return;
      }
      
      const shortlistedGrants = await grantsApi.getShortlist(shortlistIds);
      setGrants(shortlistedGrants);
    } catch (error) {
      console.error('Failed to load shortlisted grants:', error);
      toast({
        title: "Error loading shortlist",
        description: "Failed to load your shortlisted grants. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemove = (grantId: string) => {
    removeFromShortlist(grantId);
    toast({
      title: "Removed from shortlist",
      description: "Grant has been removed from your shortlist.",
    });
  };

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

  const filteredGrants = grants.filter(grant =>
    grant.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    grant.agency.toLowerCase().includes(searchTerm.toLowerCase()) ||
    grant.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  );

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
              <h2 className="text-2xl font-heading font-bold">Loading your shortlist...</h2>
              <p className="text-muted-foreground">Fetching your saved grant opportunities.</p>
            </div>
          </div>
        </div>
        
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container py-8 space-y-8">
        {/* Page Header */}
        <motion.div 
          className="text-center space-y-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center justify-center gap-2 text-accent">
            <Heart className="w-6 h-6 fill-current" />
            <span className="text-sm font-medium uppercase tracking-wide">Your Shortlist</span>
          </div>
          <h1 className="text-3xl lg:text-4xl font-heading font-bold">
            Saved Grant Opportunities
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {grants.length > 0 
              ? `You have ${grants.length} grants saved for review. Click on any grant to view details or start your application.`
              : "Your shortlist is empty. Start swiping to save grants you're interested in."
            }
          </p>
        </motion.div>

        {grants.length === 0 ? (
          /* Empty State */
          <motion.div 
            className="text-center py-20"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Card className="max-w-md mx-auto p-8">
              <CardContent className="space-y-6">
                <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto">
                  <Heart className="w-10 h-10 text-muted-foreground" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-heading font-bold">No grants shortlisted yet</h3>
                  <p className="text-muted-foreground">
                    Start swiping through grants to build your shortlist of opportunities.
                  </p>
                </div>
                <Button asChild className="w-full">
                  <Link to="/swipe">Find Grants</Link>
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        ) : (
          <>
            {/* Search and Filters */}
            <motion.div 
              className="flex flex-col md:flex-row gap-4 items-center justify-between"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search grants..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <div className="flex gap-2">
                <Button variant="outline" size="sm" asChild>
                  <Link to="/swipe">Find More Grants</Link>
                </Button>
              </div>
            </motion.div>

            {/* Grant Grid */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredGrants.map((grant, index) => (
                <motion.div
                  key={grant.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 + (index * 0.05) }}
                >
                  <Card className="bg-white/90 backdrop-blur-sm shadow-lg hover:shadow-xl rounded-2xl group h-full transition-all duration-300 ease-in-out hover:scale-105">
                    <CardContent className="p-6 space-y-3">
                      {/* Header - Logo + Grant Title + Org name */}
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3 flex-1">
                          <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-r from-primary to-brand-navy rounded-lg text-white text-sm font-bold flex-shrink-0">
                            {grant.logo || grant.agency.substring(0, 2).toUpperCase()}
                          </div>
                          <div className="space-y-1 min-w-0 flex-1">
                            <h3 className="font-heading font-bold text-lg leading-tight group-hover:text-primary transition-colors line-clamp-2">
                              {grant.title}
                            </h3>
                            <p className="text-sm text-muted-foreground flex items-center gap-1">
                              <Building className="w-3 h-3 flex-shrink-0" />
                              <span className="truncate">{grant.agency}</span>
                            </p>
                          </div>
                        </div>
                        
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemove(grant.id)}
                          className="text-muted-foreground hover:text-red-500 transition-colors flex-shrink-0"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>

                      {/* Middle - Funding amount + Deadline (highlighted) */}
                      <div className="bg-gradient-to-r from-brand-gold/10 to-brand-gold/5 rounded-xl p-4 space-y-3">
                        <div className="space-y-1">
                          <span className="text-sm text-muted-foreground font-medium">Funding Amount</span>
                          <p className="text-2xl font-bold text-gradient-gold">
                            {grant.amount}
                          </p>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-muted-foreground" />
                          <span className={cn(
                            "text-sm font-medium",
                            isNearDeadline(grant.deadline) ? "text-red-500" : "text-muted-foreground"
                          )}>
                            Due {formatDeadline(grant.deadline)}
                          </span>
                          {isNearDeadline(grant.deadline) && (
                            <Badge variant="destructive" className="text-xs">
                              Urgent
                            </Badge>
                          )}
                        </div>
                      </div>

                      {/* Summary */}
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {grant.summary}
                      </p>

                      {/* Tags - Clean pill chips */}
                      {grant.tags && grant.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {grant.tags.slice(0, 3).map((tag, tagIndex) => (
                            <Badge key={tagIndex} variant="secondary" className="text-xs rounded-full px-3 py-1 bg-brand-gold/10 text-brand-gold border-brand-gold/20">
                              {tag}
                            </Badge>
                          ))}
                          {grant.tags.length > 3 && (
                            <Badge variant="secondary" className="text-xs rounded-full px-3 py-1 bg-muted/50 text-muted-foreground">
                              +{grant.tags.length - 3} more
                            </Badge>
                          )}
                        </div>
                      )}

                      {/* Actions - Consistently aligned at bottom */}
                      <div className="flex gap-2 pt-3 mt-auto">
                        <Button asChild size="sm" className="flex-1 bg-brand-magenta hover:bg-brand-magenta/90 text-white">
                          <Link to={`/grant/${grant.id}`}>
                            View Details
                          </Link>
                        </Button>
                        <Button asChild size="sm" variant="outline" className="flex-1 border-brand-gold text-brand-gold hover:bg-brand-gold hover:text-white">
                          <Link to={`/apply/${grant.id}`}>
                            Apply Now
                          </Link>
                        </Button>
                      </div>

                      {/* External link */}
                      {grant.link && (
                        <Button variant="ghost" size="sm" asChild className="w-full">
                          <a href={grant.link} target="_blank" rel="noopener noreferrer" className="gap-2">
                            <ExternalLink className="w-4 h-4" />
                            Official Page
                          </a>
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            {filteredGrants.length === 0 && searchTerm && (
              <motion.div 
                className="text-center py-12"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6 }}
              >
                <p className="text-muted-foreground">
                  No grants found matching "{searchTerm}". Try adjusting your search.
                </p>
              </motion.div>
            )}
          </>
        )}
      </main>
      
      <Footer />
    </div>
  );
}