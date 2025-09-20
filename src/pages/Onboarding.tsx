import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  Building2, 
  MapPin, 
  Users, 
  Target, 
  CheckCircle, 
  ArrowRight, 
  ArrowLeft,
  Search,
  Factory,
  ShoppingBag,
  Laptop,
  Stethoscope,
  Car,
  UtensilsCrossed
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Stepper } from '@/components/ui/stepper';
import { Chip } from '@/components/ui/chip';
import { SegmentedSlider } from '@/components/ui/segmented-slider';
import { YearsSlider } from '@/components/ui/years-slider';
import { ParticleBackground } from '@/components/ui/particle-background';
import { useProfileStore } from '@/lib/stores/profile-store';
import type { TeamSize, FundingNeed } from '@/lib/types';

const steps = [
  { id: 1, title: 'Industry', description: 'What sector are you in?' },
  { id: 2, title: 'Location', description: 'Where is your business?' },
  { id: 3, title: 'Size', description: 'How big is your team?' },
  { id: 4, title: 'Needs', description: 'What funding do you need?' },
  { id: 5, title: 'Confirm', description: 'Review your profile' },
];

const industries = [
  { id: 'technology', name: 'Technology & Software', icon: Laptop },
  { id: 'manufacturing', name: 'Manufacturing', icon: Factory },
  { id: 'retail', name: 'Retail & E-commerce', icon: ShoppingBag },
  { id: 'healthcare', name: 'Healthcare & Life Sciences', icon: Stethoscope },
  { id: 'automotive', name: 'Automotive', icon: Car },
  { id: 'food', name: 'Food & Beverage', icon: UtensilsCrossed },
];

const malaysianStates = [
  'Kuala Lumpur', 'Selangor', 'Penang', 'Johor', 'Perak', 'Kedah',
  'Kelantan', 'Terengganu', 'Pahang', 'Negeri Sembilan', 'Melaka',
  'Perlis', 'Sabah', 'Sarawak', 'Putrajaya', 'Labuan'
];

const teamSizeOptions = [
  { value: '1-10' as TeamSize, label: '1-10' },
  { value: '11-50' as TeamSize, label: '11-50' },
  { value: '51-100' as TeamSize, label: '51-100' },
  { value: '101-500' as TeamSize, label: '101-500' },
  { value: '501+' as TeamSize, label: '501+' },
];

const fundingNeeds: FundingNeed[] = [
  'Growth', 'Digitalisation', 'Working Capital', 'Export', 'Hiring', 'R&D'
];

export default function Onboarding() {
  const navigate = useNavigate();
  const { profile, updateStep, setProfile } = useProfileStore();
  const [currentStep, setCurrentStep] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');

  // Form state
  const [selectedIndustry, setSelectedIndustry] = useState(profile.industry || '');
  const [selectedLocation, setSelectedLocation] = useState(profile.location || '');
  const [selectedTeamSize, setSelectedTeamSize] = useState<TeamSize>(profile.teamSizeBracket || '1-10');
  const [selectedNeeds, setSelectedNeeds] = useState<FundingNeed[]>(profile.needs || []);
  const [yearsInOperation, setYearsInOperation] = useState(profile.years || 0);

  const isStepValid = () => {
    switch (currentStep) {
      case 0: return selectedIndustry !== '';
      case 1: return selectedLocation !== '';
      case 2: return true; // Team size always has a default
      case 3: return selectedNeeds.length > 0;
      case 4: return true; // Confirmation step
      default: return false;
    }
  };

  const handleNext = () => {
    if (!isStepValid()) return;
    
    // Save current step data
    switch (currentStep) {
      case 0:
        updateStep({ industry: selectedIndustry });
        break;
      case 1:
        updateStep({ location: selectedLocation });
        break;
      case 2:
        updateStep({ teamSizeBracket: selectedTeamSize });
        break;
      case 3:
        updateStep({ needs: selectedNeeds, years: yearsInOperation });
        break;
    }

    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = () => {
    setProfile({
      industry: selectedIndustry,
      location: selectedLocation,
      teamSizeBracket: selectedTeamSize,
      needs: selectedNeeds,
      years: yearsInOperation,
      isComplete: true,
    });
    navigate('/swipe');
  };

  const filteredIndustries = industries.filter(industry =>
    industry.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredStates = malaysianStates.filter(state =>
    state.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleNeed = (need: FundingNeed) => {
    setSelectedNeeds(prev =>
      prev.includes(need)
        ? prev.filter(n => n !== need)
        : [...prev, need]
    );
  };

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 300 : -300,
      opacity: 0,
    }),
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-magenta to-brand-navy relative overflow-hidden">
      <ParticleBackground density="low" className="opacity-30" />
      
      <div className="container relative z-10 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Stepper */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12"
          >
            <Stepper steps={steps} currentStep={currentStep} />
          </motion.div>

          {/* Main Card */}
          <Card className="card-floating min-h-[500px]">
            <CardContent className="p-8">
              <AnimatePresence mode="wait" custom={currentStep}>
                <motion.div
                  key={currentStep}
                  custom={currentStep}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{
                    x: { type: "spring", stiffness: 300, damping: 30 },
                    opacity: { duration: 0.2 },
                  }}
                  className="space-y-8"
                >
                  {/* Step 1: Industry */}
                  {currentStep === 0 && (
                    <div className="space-y-6">
                      <div className="text-center space-y-2">
                        <Building2 className="w-12 h-12 text-accent mx-auto" />
                        <h2 className="text-2xl font-heading font-bold">What's your industry?</h2>
                        <p className="text-muted-foreground">This helps us find the most relevant grants for your business sector.</p>
                      </div>

                      <div className="relative">
                        <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                        <Input
                          placeholder="Search industries..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="pl-10"
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {filteredIndustries.map((industry) => (
                          <Chip
                            key={industry.id}
                            selected={selectedIndustry === industry.id}
                            onClick={() => setSelectedIndustry(industry.id)}
                            variant="industry"
                            icon={<industry.icon className="w-5 h-5" />}
                          >
                            {industry.name}
                          </Chip>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Step 2: Location */}
                  {currentStep === 1 && (
                    <div className="space-y-6">
                      <div className="text-center space-y-2">
                        <MapPin className="w-12 h-12 text-accent mx-auto" />
                        <h2 className="text-2xl font-heading font-bold">Where is your business located?</h2>
                        <p className="text-muted-foreground">Different states may have specific grant programs available.</p>
                      </div>

                      <div className="relative">
                        <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                        <Input
                          placeholder="Search states..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="pl-10"
                        />
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {filteredStates.map((state) => (
                          <Chip
                            key={state}
                            selected={selectedLocation === state}
                            onClick={() => setSelectedLocation(state)}
                          >
                            {state}
                          </Chip>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Step 3: Team Size */}
                  {currentStep === 2 && (
                    <div className="space-y-6">
                      <div className="text-center space-y-2">
                        <Users className="w-12 h-12 text-accent mx-auto" />
                        <h2 className="text-2xl font-heading font-bold">How big is your team?</h2>
                        <p className="text-muted-foreground">Grant eligibility often depends on company size.</p>
                      </div>

                      <div className="max-w-md mx-auto">
                        <SegmentedSlider
                          options={teamSizeOptions}
                          value={selectedTeamSize}
                          onChange={(value) => setSelectedTeamSize(value as TeamSize)}
                        />
                      </div>

                      <div className="text-center text-sm text-muted-foreground">
                        Current selection: <span className="font-medium text-foreground">{selectedTeamSize} employees</span>
                      </div>
                    </div>
                  )}

                  {/* Step 4: Funding Needs */}
                  {currentStep === 3 && (
                    <div className="space-y-6">
                      <div className="text-center space-y-2">
                        <Target className="w-12 h-12 text-accent mx-auto" />
                        <h2 className="text-2xl font-heading font-bold">What do you need funding for?</h2>
                        <p className="text-muted-foreground">Select all that apply to your business needs.</p>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {fundingNeeds.map((need) => (
                          <Chip
                            key={need}
                            selected={selectedNeeds.includes(need)}
                            onClick={() => toggleNeed(need)}
                            variant="need"
                          >
                            {need}
                          </Chip>
                        ))}
                      </div>

                      <YearsSlider
                        value={yearsInOperation}
                        onChange={setYearsInOperation}
                        className="max-w-md mx-auto"
                      />
                    </div>
                  )}

                  {/* Step 5: Confirmation */}
                  {currentStep === 4 && (
                    <div className="space-y-6">
                      <div className="text-center space-y-2">
                        <CheckCircle className="w-12 h-12 text-green-500 mx-auto" />
                        <h2 className="text-2xl font-heading font-bold">Perfect! Let's review your profile</h2>
                        <p className="text-muted-foreground">We'll use this information to find the best grant matches.</p>
                      </div>

                      <div className="bg-muted/50 rounded-2xl p-6 space-y-4">
                        <div className="grid md:grid-cols-2 gap-4">
                          <div>
                            <span className="text-sm font-medium text-muted-foreground">Industry</span>
                            <p className="font-medium">{industries.find(i => i.id === selectedIndustry)?.name}</p>
                          </div>
                          <div>
                            <span className="text-sm font-medium text-muted-foreground">Location</span>
                            <p className="font-medium">{selectedLocation}</p>
                          </div>
                          <div>
                            <span className="text-sm font-medium text-muted-foreground">Team Size</span>
                            <p className="font-medium">{selectedTeamSize} employees</p>
                          </div>
                          <div>
                            <span className="text-sm font-medium text-muted-foreground">Years in Operation</span>
                            <p className="font-medium">{yearsInOperation} years</p>
                          </div>
                        </div>
                        
                        <div>
                          <span className="text-sm font-medium text-muted-foreground">Funding Needs</span>
                          <div className="flex flex-wrap gap-2 mt-2">
                            {selectedNeeds.map((need) => (
                              <span key={need} className="px-3 py-1 bg-accent/10 text-accent text-sm rounded-full">
                                {need}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>

              {/* Navigation */}
              <div className="flex justify-between items-center mt-8 pt-6 border-t">
                <Button
                  variant="ghost"
                  onClick={handlePrevious}
                  disabled={currentStep === 0}
                  className="gap-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Previous
                </Button>

                <div className="text-sm text-muted-foreground md:hidden">
                  Step {currentStep + 1} of {steps.length}
                </div>

                {currentStep < steps.length - 1 ? (
                  <Button
                    onClick={handleNext}
                    disabled={!isStepValid()}
                    className="gap-2"
                  >
                    Next
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                ) : (
                  <Button
                    onClick={handleComplete}
                    className="btn-hero gap-2"
                  >
                    Find My Matches
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}