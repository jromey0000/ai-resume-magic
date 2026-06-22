import { useCallback, useEffect, useRef, useState } from 'react';

export function useAnimatedList<T extends string | number>() {
  const [exitingId, setExitingId] = useState<T | null>(null);
  const [highlightedIds, setHighlightedIds] = useState<Set<T>>(new Set());
  const prevLengthRef = useRef(0);
  const isFirstRenderRef = useRef(true);

  const isExiting = useCallback((id: T) => exitingId === id, [exitingId]);
  const isHighlighted = useCallback((id: T) => highlightedIds.has(id), [highlightedIds]);

  const highlight = useCallback((id: T, durationMs = 1500) => {
    setHighlightedIds((prev) => new Set(prev).add(id));
    window.setTimeout(() => {
      setHighlightedIds((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    }, durationMs);
  }, []);

  const requestRemove = useCallback((id: T) => {
    setExitingId(id);
  }, []);

  const completeRemove = useCallback((removeFn: () => void) => {
    removeFn();
    setExitingId(null);
  }, []);

  const trackNewItems = useCallback(
    (items: { id: T }[]) => {
      if (isFirstRenderRef.current) {
        isFirstRenderRef.current = false;
        prevLengthRef.current = items.length;
        return;
      }

      if (items.length > prevLengthRef.current && items.length > 0) {
        highlight(items[items.length - 1].id, 800);
      }
      prevLengthRef.current = items.length;
    },
    [highlight]
  );

  return {
    exitingId,
    isExiting,
    isHighlighted,
    highlight,
    requestRemove,
    completeRemove,
    trackNewItems,
  };
}

export function useTrackNewItems<T extends string | number>(
  items: { id: T }[],
  trackNewItems: (items: { id: T }[]) => void
) {
  useEffect(() => {
    trackNewItems(items);
  }, [items, trackNewItems]);
}
