import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

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

const enterClasses: Record<AnimationVariant, string> = {
  'fade-up': 'micro-enter-fade-up',
  'fade-scale': 'micro-enter-fade-scale',
  'slide-down': 'micro-enter-slide-down',
  pop: 'micro-enter-pop',
};

const exitClasses: Record<AnimationVariant, string> = {
  'fade-up': 'micro-exit-fade-up',
  'fade-scale': 'micro-exit-fade-scale',
  'slide-down': 'micro-exit-slide-down',
  pop: 'micro-exit-pop',
};

function AnimatedItem({
  children,
  className,
  isExiting = false,
  isHighlighted = false,
  variant = 'fade-up',
  delay = 0,
  onExitComplete,
}: AnimatedItemProps) {
  const handleAnimationEnd = (e: React.AnimationEvent<HTMLDivElement>) => {
    if (!isExiting || e.currentTarget !== e.target) return;
    onExitComplete?.();
  };

  return (
    <div
      className={cn(
        isExiting ? exitClasses[variant] : enterClasses[variant],
        isHighlighted && !isExiting && 'micro-highlight',
        className
      )}
      style={delay > 0 && !isExiting ? { animationDelay: `${delay}ms` } : undefined}
      onAnimationEnd={handleAnimationEnd}
    >
      {children}
    </div>
  );
}

export default AnimatedItem;
