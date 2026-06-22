import { type ReactNode } from 'react';

type Theme = 'light' | 'dark' | 'system';
interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  resolvedTheme: 'light' | 'dark';
}
export declare function ThemeProvider({
  children,
}: {
  children: ReactNode;
}): import('react').JSX.Element;
export declare function useTheme(): ThemeContextType;
