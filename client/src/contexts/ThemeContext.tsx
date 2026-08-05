import React, { createContext, useContext, useEffect, useState } from 'react';

export type ThemePreset = 'light-clinical' | 'dark-cyber' | 'midnight-navy' | 'emerald-pulse';

export interface ThemeConfig {
  id: ThemePreset;
  name: string;
  isDark: boolean;
  bgClass: string;
  cardClass: string;
  borderClass: string;
  textClass: string;
  accentClass: string;
  badgeBg: string;
}

export const THEME_PRESETS: Record<ThemePreset, ThemeConfig> = {
  'light-clinical': {
    id: 'light-clinical',
    name: 'Clinical EHR Light',
    isDark: false,
    bgClass: 'bg-slate-50',
    cardClass: 'bg-white',
    borderClass: 'border-slate-200',
    textClass: 'text-slate-900',
    accentClass: 'text-blue-600',
    badgeBg: 'bg-blue-50 text-blue-700 border-blue-200',
  },
  'dark-cyber': {
    id: 'dark-cyber',
    name: 'Cyberpunk Dark',
    isDark: true,
    bgClass: 'bg-[#0b0f19]',
    cardClass: 'bg-[#111726]',
    borderClass: 'border-slate-800',
    textClass: 'text-slate-100',
    accentClass: 'text-cyan-400',
    badgeBg: 'bg-cyan-950 text-cyan-300 border-cyan-500/40',
  },
  'midnight-navy': {
    id: 'midnight-navy',
    name: 'Midnight Sapphire',
    isDark: true,
    bgClass: 'bg-[#0a1128]',
    cardClass: 'bg-[#1c2541]',
    borderClass: 'border-blue-900/60',
    textClass: 'text-blue-50',
    accentClass: 'text-blue-400',
    badgeBg: 'bg-blue-950 text-blue-300 border-blue-500/40',
  },
  'emerald-pulse': {
    id: 'emerald-pulse',
    name: 'BioTech Emerald',
    isDark: true,
    bgClass: 'bg-[#051611]',
    cardClass: 'bg-[#0a271f]',
    borderClass: 'border-emerald-900/60',
    textClass: 'text-emerald-50',
    accentClass: 'text-emerald-400',
    badgeBg: 'bg-emerald-950 text-emerald-300 border-emerald-500/40',
  },
};

interface ThemeContextType {
  theme: ThemePreset;
  themeConfig: ThemeConfig;
  setTheme: (theme: ThemePreset) => void;
  toggleDarkLight: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY = 'clinos_theme_preset_v3';

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<ThemePreset>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY) as ThemePreset;
    if (saved && THEME_PRESETS[saved]) {
      return saved;
    }
    return 'light-clinical'; // Default to Light Clinical theme
  });

  useEffect(() => {
    const root = document.documentElement;
    const config = THEME_PRESETS[theme];

    // Remove all previous theme classes
    Object.keys(THEME_PRESETS).forEach((t) => {
      root.classList.remove(`theme-${t}`);
    });
    root.classList.remove('dark', 'light');

    // Apply active theme class
    root.classList.add(`theme-${theme}`);
    if (config.isDark) {
      root.classList.add('dark');
    } else {
      root.classList.add('light');
    }

    localStorage.setItem(LOCAL_STORAGE_KEY, theme);
  }, [theme]);

  const setTheme = (newTheme: ThemePreset) => {
    setThemeState(newTheme);
  };

  const toggleDarkLight = () => {
    const currentConfig = THEME_PRESETS[theme];
    if (currentConfig.isDark) {
      setThemeState('light-clinical');
    } else {
      setThemeState('dark-cyber');
    }
  };

  return (
    <ThemeContext.Provider
      value={{
        theme,
        themeConfig: THEME_PRESETS[theme] || THEME_PRESETS['light-clinical'],
        setTheme,
        toggleDarkLight,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
