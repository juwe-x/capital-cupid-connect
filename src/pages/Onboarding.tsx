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
  UtensilsCrossed,
  Edit
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
import { savePreferences, Preferences } from '@/lib/types/account';
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
  'Sabah', 'Sarawak', 'Putrajaya'
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
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [customNeed, setCustomNeed] = useState('');
  const [triggerBurst, setTriggerBurst] = useState(0);

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
    
    // Trigger burst animation
    setTriggerBurst(prev => prev + 1);
    
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
    // Save to profile store
    setProfile({
      industry: selectedIndustry,
      location: selectedLocation,
      teamSizeBracket: selectedTeamSize,
      needs: selectedNeeds,
      years: yearsInOperation,
      isComplete: true,
    });

    // Save preferences to localStorage
    const preferences: Preferences = {
      businessType: selectedIndustry,
      industry: selectedIndustry,
      fundingAmount: selectedNeeds.join(', '),
      location: selectedLocation,
      experience: `${yearsInOperation} years`,
      goals: selectedNeeds,
      timeline: 'Within 6 months',
      createdAt: new Date().toISOString(),
    };

    savePreferences(preferences);
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

  const handleCustomNeedClick = () => {
    setShowCustomInput(true);
  };

  const handleCustomNeedSave = () => {
    if (customNeed.trim()) {
      const customNeedValue = `Custom: ${customNeed.trim()}` as FundingNeed;
      if (!selectedNeeds.includes(customNeedValue)) {
        setSelectedNeeds(prev => [...prev, customNeedValue]);
      }
      setCustomNeed('');
      setShowCustomInput(false);
    }
  };

  const handleCustomNeedKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleCustomNeedSave();
    }
  };

  const handleEditField = (stepIndex: number) => {
    setCurrentStep(stepIndex);
  };

  // Slide transition variants
  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 20 : -20,
      opacity: 0,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 20 : -20,
      opacity: 0,
    }),
  };


  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-magenta to-brand-navy relative overflow-hidden onboarding-container">
      <ParticleBackground 
        density="low" 
        className="opacity-40" 
        onBurst={() => triggerBurst}
      />
      
      <div className="container relative z-10 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Stepper */}
          <div className="mb-8">
            <Stepper steps={steps} currentStep={currentStep} />
          </div>

          {/* Main Card */}
          <Card className="card-floating h-[600px] overflow-hidden">
            <CardContent className="p-8 h-full">
              <div className="flex h-full flex-col">
                <div className="flex-grow min-h-0 overflow-hidden">
                  <AnimatePresence mode="wait" custom={currentStep}>
                    <motion.div
                      key={currentStep}
                      custom={currentStep}
                      variants={slideVariants}
                      initial="enter"
                      animate="center"
                      exit="exit"
                      transition={{
                        x: { type: "tween", duration: 0.28, ease: "easeInOut" },
                        opacity: { duration: 0.25, ease: "easeInOut" },
                      }}
                      className={`h-full flex flex-col space-y-8 onboarding-animation-wrapper ${
                        currentStep === 1 ? 'onboarding-step location' : 'onboarding-step'
                      }`}
                    >
                  {/* Step 1: Industry */}
                  {currentStep === 0 && (
                    <div className="flex-1 flex flex-col space-y-6">
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

                      <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
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
                    <div className="flex-1 flex flex-col space-y-6">
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

                      <div className="flex-1 overflow-y-auto pr-2">
                        <div className="grid grid-cols-2 gap-3">
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

                      <div className="flex flex-col items-center space-y-6">
                        <div className="w-full max-w-md">
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
                    </div>
                  )}

                  {/* Step 4: Funding Needs */}
                  {currentStep === 3 && (
                    <div className="flex-1 flex flex-col space-y-6">
                      <div className="text-center space-y-2">
                        <Target className="w-12 h-12 text-accent mx-auto" />
                        <h2 className="text-2xl font-heading font-bold">What do you need funding for?</h2>
                        <p className="text-muted-foreground">Select all that apply to your business needs.</p>
                      </div>

                      <div className="flex-1 overflow-y-auto pr-2">
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
                          
                          {/* Custom Need Chip */}
                          <div className="relative">
                            {!showCustomInput ? (
                              <Chip
                                selected={selectedNeeds.some(need => need.startsWith('Custom:'))}
                                onClick={handleCustomNeedClick}
                                variant="need"
                              >
                                Custom
                              </Chip>
                            ) : (
                              <div className="relative">
                                <Input
                                  value={customNeed}
                                  onChange={(e) => setCustomNeed(e.target.value)}
                                  onBlur={handleCustomNeedSave}
                                  onKeyPress={handleCustomNeedKeyPress}
                                  placeholder="Enter custom need..."
                                  className="w-full h-10 px-4 py-2 rounded-full border-2 border-accent bg-accent/10 text-accent-foreground focus:ring-2 focus:ring-accent/20"
                                  autoFocus
                                />
                              </div>
                            )}
                          </div>
                        </div>
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
                    <div className="flex-1 flex flex-col space-y-6">
                      <div className="text-center space-y-2">
                        <CheckCircle className="w-12 h-12 text-green-500 mx-auto" />
                        <h2 className="text-2xl font-heading font-bold">Perfect! Let's review your profile</h2>
                        <p className="text-muted-foreground">We'll use this information to find the best grant matches.</p>
                      </div>

                      <div className="flex-1 space-y-4">
                        <div className="grid md:grid-cols-2 gap-4">
                          <div className="bg-white/40 backdrop-blur-md rounded-lg p-3 shadow-sm border border-white/20">
                            <div className="flex items-center justify-between">
                              <div>
                                <span className="text-sm font-medium text-muted-foreground">Industry</span>
                                <p className="font-medium">{industries.find(i => i.id === selectedIndustry)?.name}</p>
                              </div>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleEditField(0)}
                                className="p-2 h-8 w-8 border border-accent/30 rounded-lg hover:bg-accent/10"
                              >
                                <Edit className="w-4 h-4 text-accent" />
                              </Button>
                            </div>
                          </div>
                          <div className="bg-white/40 backdrop-blur-md rounded-lg p-3 shadow-sm border border-white/20">
                            <div className="flex items-center justify-between">
                              <div>
                                <span className="text-sm font-medium text-muted-foreground">Location</span>
                                <p className="font-medium">{selectedLocation}</p>
                              </div>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleEditField(1)}
                                className="p-2 h-8 w-8 border border-accent/30 rounded-lg hover:bg-accent/10"
                              >
                                <Edit className="w-4 h-4 text-accent" />
                              </Button>
                            </div>
                          </div>
                          <div className="bg-white/40 backdrop-blur-md rounded-lg p-3 shadow-sm border border-white/20">
                            <div className="flex items-center justify-between">
                              <div>
                                <span className="text-sm font-medium text-muted-foreground">Team Size</span>
                                <p className="font-medium">{selectedTeamSize} employees</p>
                              </div>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleEditField(2)}
                                className="p-2 h-8 w-8 border border-accent/30 rounded-lg hover:bg-accent/10"
                              >
                                <Edit className="w-4 h-4 text-accent" />
                              </Button>
                            </div>
                          </div>
                          <div className="bg-white/40 backdrop-blur-md rounded-lg p-3 shadow-sm border border-white/20">
                            <div className="flex items-center justify-between">
                              <div>
                                <span className="text-sm font-medium text-muted-foreground">Years in Operation</span>
                                <p className="font-medium">{yearsInOperation} years</p>
                              </div>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleEditField(3)}
                                className="p-2 h-8 w-8 border border-accent/30 rounded-lg hover:bg-accent/10"
                              >
                                <Edit className="w-4 h-4 text-accent" />
                              </Button>
                            </div>
                          </div>
                        </div>
                        
                        <div className="bg-white/40 backdrop-blur-md rounded-lg p-3 shadow-sm border border-white/20">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <span className="text-sm font-medium text-muted-foreground">Funding Needs</span>
                              <div className="flex flex-wrap gap-2 mt-2">
                                {selectedNeeds.map((need) => (
                                  <div key={need} className="bg-brand-gold/20 border border-brand-gold rounded-lg px-3 py-1 shadow-sm">
                                    <span className="text-accent text-sm font-medium">{need}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEditField(3)}
                              className="p-2 h-8 w-8 border border-accent/30 rounded-lg hover:bg-accent/10 mt-6"
                            >
                              <Edit className="w-4 h-4 text-accent" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                    </motion.div>
                  </AnimatePresence>
                </div>

                {/* Fixed Navigation - Anchored at bottom */}
                <div className="flex-shrink-0 flex justify-between items-center pt-6 border-t border-border/20 bg-background/95 backdrop-blur-sm">
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
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}