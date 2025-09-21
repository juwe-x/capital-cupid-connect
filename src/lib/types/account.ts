export interface Account {
  businessName: string;
  email?: string;
  createdAt: string;
  id: string;
}

export interface Preferences {
  businessType: string;
  industry: string;
  fundingAmount: string;
  location: string;
  experience: string;
  goals: string[];
  timeline: string;
  createdAt: string;
}

export interface AccountWithPreferences extends Account {
  preferences: Preferences;
}

// LocalStorage keys
export const STORAGE_KEYS = {
  ACCOUNT: 'capitalCupidAccount',
  PREFERENCES: 'capitalCupidPreferences',
} as const;

// Utility functions for localStorage
export const getAccount = (): Account | null => {
  try {
    const accountData = localStorage.getItem(STORAGE_KEYS.ACCOUNT);
    if (!accountData) return null;
    
    const parsed = JSON.parse(accountData);
    // Validate required fields
    if (!parsed.businessName || !parsed.createdAt || !parsed.id) {
      console.warn('Invalid account data found, clearing...');
      clearAccount();
      return null;
    }
    
    return parsed;
  } catch (error) {
    console.error('Error parsing account data:', error);
    clearAccount();
    return null;
  }
};

export const saveAccount = (account: Account): void => {
  try {
    // Validate account data before saving
    if (!account.businessName || !account.createdAt || !account.id) {
      throw new Error('Invalid account data');
    }
    localStorage.setItem(STORAGE_KEYS.ACCOUNT, JSON.stringify(account));
  } catch (error) {
    console.error('Error saving account:', error);
    throw error;
  }
};

export const getPreferences = (): Preferences | null => {
  try {
    const preferencesData = localStorage.getItem(STORAGE_KEYS.PREFERENCES);
    if (!preferencesData) return null;
    
    const parsed = JSON.parse(preferencesData);
    // Validate required fields
    if (!parsed.businessType || !parsed.industry || !parsed.createdAt) {
      console.warn('Invalid preferences data found, clearing...');
      clearAccount();
      return null;
    }
    
    return parsed;
  } catch (error) {
    console.error('Error parsing preferences data:', error);
    clearAccount();
    return null;
  }
};

export const savePreferences = (preferences: Preferences): void => {
  try {
    // Validate preferences data before saving
    if (!preferences.businessType || !preferences.industry || !preferences.createdAt) {
      throw new Error('Invalid preferences data');
    }
    localStorage.setItem(STORAGE_KEYS.PREFERENCES, JSON.stringify(preferences));
  } catch (error) {
    console.error('Error saving preferences:', error);
    throw error;
  }
};

export const clearAccount = (): void => {
  try {
    localStorage.removeItem(STORAGE_KEYS.ACCOUNT);
    localStorage.removeItem(STORAGE_KEYS.PREFERENCES);
  } catch (error) {
    console.error('Error clearing account data:', error);
  }
};

export const hasAccount = (): boolean => {
  try {
    return getAccount() !== null;
  } catch (error) {
    console.error('Error checking account existence:', error);
    return false;
  }
};
