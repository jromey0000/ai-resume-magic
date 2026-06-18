import type { ReactNode } from 'react';
import { vi } from 'vitest';

export const mockUseUser = vi.fn(() => ({
  isLoaded: true,
  isSignedIn: false,
  user: null,
}));

vi.mock('@clerk/clerk-react', () => ({
  useUser: () => mockUseUser(),
  UserButton: () => null,
  SignIn: () => null,
  ClerkProvider: ({ children }: { children: ReactNode }) => children,
}));
