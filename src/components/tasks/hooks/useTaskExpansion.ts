import { useState } from 'react';

/**
 * Custom hook for managing task expansion state and click handling
 * Consolidates the duplicate click handling logic from TopLevelTask and SubTask
 */
export function useTaskExpansion(maxLevel?: number) {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleClick = (e: React.MouseEvent, currentLevel?: number) => {
    // Don't allow expansion at max level if specified
    if (maxLevel !== undefined && currentLevel !== undefined && currentLevel >= maxLevel) {
      return;
    }

    // Prevent expansion when clicking on interactive elements
    const target = e.target as HTMLElement;
    const isInteractiveElement = target.closest(
      'button, [role="button"], input, select, textarea, a',
    );

    if (!isInteractiveElement) {
      setIsExpanded(!isExpanded);
    }
  };

  const canExpand = (currentLevel?: number) => {
    if (maxLevel === undefined || currentLevel === undefined) return true;
    return currentLevel < maxLevel;
  };

  return {
    isExpanded,
    setIsExpanded,
    handleClick,
    canExpand,
  };
}
