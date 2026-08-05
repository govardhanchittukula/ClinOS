import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sun, Moon, Palette, Check, Sparkles } from 'lucide-react';
import { useTheme, THEME_PRESETS, ThemePreset } from '../contexts/ThemeContext';

export const ThemeToggle: React.FC = () => {
  const { theme, themeConfig, setTheme, toggleDarkLight } = useTheme();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      
      {/* Quick Theme Toggle & Selector Button */}
      <div className="flex items-center space-x-1">
        
        {/* Toggle Dark/Light Quick Button */}
        <button
          onClick={toggleDarkLight}
          title={`Click to switch to ${themeConfig.isDark ? 'Clinical Light Mode' : 'Cyberpunk Dark Mode'}`}
          className={`p-2 rounded-xl border transition-all duration-300 flex items-center space-x-1.5 text-xs font-semibold ${
            themeConfig.isDark
              ? 'bg-slate-900 border-slate-700 text-cyan-300 hover:border-cyan-500/60 shadow-md shadow-cyan-500/10'
              : 'bg-white border-slate-300 text-blue-700 hover:border-blue-400 shadow-sm'
          }`}
        >
          {themeConfig.isDark ? (
            <>
              <Moon className="w-4 h-4 text-cyan-400 animate-pulse" />
              <span className="hidden sm:inline-block font-mono text-[10px] uppercase font-bold text-cyan-300">
                {themeConfig.name.split(' ')[0]}
              </span>
            </>
          ) : (
            <>
              <Sun className="w-4 h-4 text-amber-500" />
              <span className="hidden sm:inline-block font-sans text-[10px] uppercase font-bold text-slate-800">
                Clinical Light
              </span>
            </>
          )}
        </button>

        {/* Palette Menu Dropdown Trigger */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          title="Open Theme Palette Selector"
          className="p-2 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-300 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-all"
        >
          <Palette className="w-4 h-4 text-cyan-500" />
        </button>

      </div>

      {/* Dropdown Menu for Theme Presets */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 mt-2 w-56 p-2 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl z-50 font-sans text-xs space-y-1"
          >
            <div className="px-3 py-1.5 text-[10px] font-mono uppercase font-bold text-slate-400 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <span>Select Theme Palette</span>
              <Sparkles className="w-3 h-3 text-cyan-400" />
            </div>

            {Object.values(THEME_PRESETS).map((preset) => {
              const isSelected = theme === preset.id;
              return (
                <button
                  key={preset.id}
                  onClick={() => {
                    setTheme(preset.id);
                    setIsOpen(false);
                  }}
                  className={`w-full text-left p-2.5 rounded-xl border flex items-center justify-between transition-all ${
                    isSelected
                      ? 'bg-blue-50 dark:bg-cyan-500/10 border-blue-300 dark:border-cyan-500/50 text-blue-700 dark:text-cyan-300 font-bold'
                      : 'bg-transparent border-transparent hover:bg-slate-100 dark:hover:bg-slate-800/60 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <div className="flex items-center space-x-2.5">
                    {/* Theme Preview Dot */}
                    <span
                      className={`w-3.5 h-3.5 rounded-full border shadow-sm ${
                        preset.id === 'dark-cyber'
                          ? 'bg-[#0b0f19] border-cyan-400'
                          : preset.id === 'light-clinical'
                          ? 'bg-white border-blue-500'
                          : preset.id === 'midnight-navy'
                          ? 'bg-[#0a1128] border-blue-400'
                          : 'bg-[#051611] border-emerald-400'
                      }`}
                    />
                    <span className="text-xs">{preset.name}</span>
                  </div>

                  {isSelected && <Check className="w-4 h-4 text-cyan-500" />}
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};
