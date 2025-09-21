import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, User, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { PreferencesModal } from '@/components/ui/preferences-modal';
import { cn } from '@/lib/utils';
import { hasAccount, getAccount, getPreferences, clearAccount, AccountWithPreferences } from '@/lib/types/account';
import logo from '@/assets/logo.png';

const navigation = [
  { name: 'Home', href: '/' },
  { name: 'Swipe', href: '/swipe' },
  { name: 'Shortlist', href: '/shortlist' },
  { name: 'Docs', href: '/apply' },
];

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showPreferencesModal, setShowPreferencesModal] = useState(false);
  const [accountExists, setAccountExists] = useState(false);
  const [accountData, setAccountData] = useState<AccountWithPreferences | null>(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Check for account existence
  useEffect(() => {
    const checkAccount = () => {
      try {
        const hasAccountData = hasAccount();
        setAccountExists(hasAccountData);
        
        if (hasAccountData) {
          const account = getAccount();
          const preferences = getPreferences();
          if (account && preferences) {
            setAccountData({ ...account, preferences });
          } else {
            // Account exists but preferences missing - clear account
            clearAccount();
            setAccountExists(false);
            setAccountData(null);
          }
        } else {
          setAccountData(null);
        }
      } catch (error) {
        console.error('Error checking account:', error);
        // Clear potentially corrupted data
        clearAccount();
        setAccountExists(false);
        setAccountData(null);
      }
    };

    checkAccount();
    
    // Listen for storage changes (when account is created/deleted)
    const handleStorageChange = () => {
      checkAccount();
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  const handleEditPreferences = () => {
    setShowPreferencesModal(false);
    navigate('/onboarding');
  };

  const handleDeleteAccount = () => {
    clearAccount();
    setAccountExists(false);
    setAccountData(null);
    navigate('/');
  };

  return (
    <header
      className={cn(
        'sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 transition-all duration-300',
        isScrolled && 'shadow-sm'
      )}
    >
      <div className="container flex h-16 items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <img 
            src={logo} 
            alt="CapitalCupid Logo" 
            className="h-14 w-auto md:h-16"
          />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          {navigation.map((item) => (
            <Link
              key={item.name}
              to={item.href}
              className={cn(
                'text-sm font-medium transition-colors hover:text-primary relative',
                isActive(item.href)
                  ? 'text-primary'
                  : 'text-muted-foreground'
              )}
            >
              {item.name}
              {isActive(item.href) && (
                <div className="absolute -bottom-1 left-0 right-0 h-0.5 bg-accent rounded-full" />
              )}
            </Link>
          ))}
          
          {/* Account Dropdown */}
          {accountExists && accountData && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex items-center space-x-2 text-sm font-medium hover:text-primary"
                >
                  <User className="w-4 h-4" />
                  <span>{accountData.businessName}</span>
                  <ChevronDown className="w-3 h-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem onClick={() => setShowPreferencesModal(true)}>
                  <User className="w-4 h-4 mr-2" />
                  View Preferences
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleEditPreferences}>
                  <User className="w-4 h-4 mr-2" />
                  Edit Preferences
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={handleDeleteAccount}
                  className="text-red-600 focus:text-red-600"
                >
                  <User className="w-4 h-4 mr-2" />
                  Delete Account
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </nav>

        {/* Mobile Navigation */}
        <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[300px] sm:w-[400px]">
            <div className="flex flex-col space-y-4 mt-8">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={cn(
                    'text-lg font-medium transition-colors hover:text-primary p-2 rounded-lg',
                    isActive(item.href)
                      ? 'text-primary bg-primary/10'
                      : 'text-muted-foreground hover:bg-muted'
                  )}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* Preferences Modal */}
      {accountData && (
        <PreferencesModal
          isOpen={showPreferencesModal}
          onClose={() => setShowPreferencesModal(false)}
          onEdit={handleEditPreferences}
          onDelete={handleDeleteAccount}
          account={accountData}
        />
      )}
    </header>
  );
}