import React, { createContext, useLayoutEffect, useMemo, useState, useCallback } from 'react';

export type Theme = 'light' | 'dark';

export interface DarkModeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

export const DarkModeContext = createContext<DarkModeContextType | undefined>(undefined);

// ROIH Color Palette
const ROIH_COLORS = {
  light: {
    // Background and surface
    background: '#FFFFFF',
    foreground: '#0F172A',
    card: '#F8FAFC',
    cardForeground: '#0F172A',
    popover: '#FFFFFF',
    popoverForeground: '#0F172A',
    // Primary - Azul Real
    primary: '#1D3D6E',
    primaryForeground: '#FFFFFF',
    // Secondary
    secondary: '#F1F5F9',
    secondaryForeground: '#0F172A',
    // Muted
    muted: '#E2E8F0',
    mutedForeground: '#64748B',
    // Accent
    accent: '#00B4D8',
    accentForeground: '#FFFFFF',
    // Destructive
    destructive: '#DC2626',
    destructiveForeground: '#FFFFFF',
    // Border and Input
    border: '#CBD5E1',
    input: '#E2E8F0',
    ring: '#1D3D6E',
    // Chart colors
    chart1: '#1D3D6E',
    chart2: '#00B4D8',
    chart3: '#F99D1C',
    chart4: '#10B981',
    chart5: '#8B5CF6',
    // Sidebar
    sidebar: '#1D3D6E',
    sidebarForeground: '#FFFFFF',
    sidebarPrimary: '#1D3D6E',
    sidebarPrimaryForeground: '#FFFFFF',
    sidebarAccent: '#00B4D8',
    sidebarAccentForeground: '#FFFFFF',
    sidebarBorder: '#FFFFFF',
    sidebarRing: '#1D3D6E',
  },
  dark: {
    // Background - Azul Marinho Escuro
    background: '#0F172A',
    foreground: '#FFFFFF',
    card: '#1E293B',
    cardForeground: '#FFFFFF',
    popover: '#1E293B',
    popoverForeground: '#FFFFFF',
    // Primary - Azul Real
    primary: '#1D3D6E',
    primaryForeground: '#FFFFFF',
    // Secondary
    secondary: '#334155',
    secondaryForeground: '#FFFFFF',
    // Muted
    muted: '#334155',
    mutedForeground: '#94A3B8',
    // Accent - Ciano
    accent: '#00B4D8',
    accentForeground: '#FFFFFF',
    // Destructive
    destructive: '#DC2626',
    destructiveForeground: '#FFFFFF',
    // Border and Input
    border: '#334155',
    input: '#334155',
    ring: '#00B4D8',
    // Chart colors
    chart1: '#1D3D6E',
    chart2: '#00B4D8',
    chart3: '#F99D1C',
    chart4: '#10B981',
    chart5: '#8B5CF6',
    // Sidebar
    sidebar: '#0F172A',
    sidebarForeground: '#FFFFFF',
    sidebarPrimary: '#1D3D6E',
    sidebarPrimaryForeground: '#FFFFFF',
    sidebarAccent: '#00B4D8',
    sidebarAccentForeground: '#FFFFFF',
    sidebarBorder: '#334155',
    sidebarRing: '#00B4D8',
  }
};

function injectThemeColors(theme: Theme) {
  const colors = ROIH_COLORS[theme];
  const root = document.documentElement;

  Object.entries({
    '--background': colors.background,
    '--foreground': colors.foreground,
    '--card': colors.card,
    '--card-foreground': colors.cardForeground,
    '--popover': colors.popover,
    '--popover-foreground': colors.popoverForeground,
    '--primary': colors.primary,
    '--primary-foreground': colors.primaryForeground,
    '--secondary': colors.secondary,
    '--secondary-foreground': colors.secondaryForeground,
    '--muted': colors.muted,
    '--muted-foreground': colors.mutedForeground,
    '--accent': colors.accent,
    '--accent-foreground': colors.accentForeground,
    '--destructive': colors.destructive,
    '--destructive-foreground': colors.destructiveForeground,
    '--border': colors.border,
    '--input': colors.input,
    '--ring': colors.ring,
    '--chart-1': colors.chart1,
    '--chart-2': colors.chart2,
    '--chart-3': colors.chart3,
    '--chart-4': colors.chart4,
    '--chart-5': colors.chart5,
    '--sidebar': colors.sidebar,
    '--sidebar-foreground': colors.sidebarForeground,
    '--sidebar-primary': colors.sidebarPrimary,
    '--sidebar-primary-foreground': colors.sidebarPrimaryForeground,
    '--sidebar-accent': colors.sidebarAccent,
    '--sidebar-accent-foreground': colors.sidebarAccentForeground,
    '--sidebar-border': colors.sidebarBorder,
    '--sidebar-ring': colors.sidebarRing,
  }).forEach(([key, value]) => {
    root.style.setProperty(key, value);
  });
}

export function DarkModeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>(() => {
    const saved = localStorage.getItem('theme');
    return (saved as Theme) || 'dark';
  });

  useLayoutEffect(() => {
    document.documentElement.classList.remove('light', 'dark');
    document.documentElement.classList.add(theme);
    localStorage.setItem('theme', theme);
    injectThemeColors(theme);
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  }, []);

  const contextValue = useMemo(() => ({ theme, toggleTheme }), [theme]);

  return <DarkModeContext.Provider value={contextValue}>{children}</DarkModeContext.Provider>;
}
