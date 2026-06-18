import type { ReactNode } from 'react';

type AnimationVariant = 'fade-up' | 'fade-scale' | 'slide-down' | 'pop';
interface AnimatedItemProps {
  children: ReactNode;
  className?: string;
  isExiting?: boolean;
  isHighlighted?: boolean;
  variant?: AnimationVariant;
  delay?: number;
  onExitComplete?: () => void;
}
declare function AnimatedItem({
  children,
  className,
  isExiting,
  isHighlighted,
  variant,
  delay,
  onExitComplete,
}: AnimatedItemProps): import('react').JSX.Element;
export default AnimatedItem;
