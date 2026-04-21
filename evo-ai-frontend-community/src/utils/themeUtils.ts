// ROIH Color Palette for immediate injection
const ROIH_COLORS = {
  light: {
    background: '#FFFFFF',
    foreground: '#0F172A',
    card: '#F8FAFC',
    cardForeground: '#0F172A',
    popover: '#FFFFFF',
    popoverForeground: '#0F172A',
    primary: '#1D3D6E',
    primaryForeground: '#FFFFFF',
    secondary: '#F1F5F9',
    secondaryForeground: '#0F172A',
    muted: '#E2E8F0',
    mutedForeground: '#64748B',
    accent: '#00B4D8',
    accentForeground: '#FFFFFF',
    destructive: '#DC2626',
    destructiveForeground: '#FFFFFF',
    border: '#CBD5E1',
    input: '#E2E8F0',
    ring: '#1D3D6E',
    chart1: '#1D3D6E',
    chart2: '#00B4D8',
    chart3: '#F99D1C',
    chart4: '#10B981',
    chart5: '#8B5CF6',
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
    background: '#0F172A',
    foreground: '#FFFFFF',
    card: '#1E293B',
    cardForeground: '#FFFFFF',
    popover: '#1E293B',
    popoverForeground: '#FFFFFF',
    primary: '#1D3D6E',
    primaryForeground: '#FFFFFF',
    secondary: '#334155',
    secondaryForeground: '#FFFFFF',
    muted: '#334155',
    mutedForeground: '#94A3B8',
    accent: '#00B4D8',
    accentForeground: '#FFFFFF',
    destructive: '#DC2626',
    destructiveForeground: '#FFFFFF',
    border: '#334155',
    input: '#334155',
    ring: '#00B4D8',
    chart1: '#1D3D6E',
    chart2: '#00B4D8',
    chart3: '#F99D1C',
    chart4: '#10B981',
    chart5: '#8B5CF6',
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

function injectThemeColors(theme: string) {
  const colors = ROIH_COLORS[theme as keyof typeof ROIH_COLORS] || ROIH_COLORS.dark;
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

// Função auxiliar para inicializar o tema antes do React montar
export function initTheme() {
  // Verificar localStorage
  const savedTheme = localStorage.getItem('theme');
  let theme = 'dark';
  if (savedTheme === 'dark') {
    document.documentElement.classList.add('dark');
    theme = 'dark';
  } else if (savedTheme === 'light') {
    document.documentElement.classList.remove('dark');
    theme = 'light';
  } else {
    // Verificar preferência do sistema
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      document.documentElement.classList.add('dark');
      theme = 'dark';
    } else {
      document.documentElement.classList.remove('dark');
      theme = 'light';
    }
  }
  injectThemeColors(theme);
}
