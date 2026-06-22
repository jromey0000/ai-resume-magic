export declare function useAnimatedList<T extends string | number>(): {
  exitingId: T | null;
  isExiting: (id: T) => boolean;
  isHighlighted: (id: T) => boolean;
  highlight: (id: T, durationMs?: number) => void;
  requestRemove: (id: T) => void;
  completeRemove: (removeFn: () => void) => void;
  trackNewItems: (
    items: {
      id: T;
    }[]
  ) => void;
};
export declare function useTrackNewItems<T extends string | number>(
  items: {
    id: T;
  }[],
  trackNewItems: (
    items: {
      id: T;
    }[]
  ) => void
): void;
