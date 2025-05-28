import { useState } from 'react';

/**
 * Custom hook for managing task form state and operations
 * Consolidates form handling logic from CreateTaskButton and TaskActions
 */
export function useTaskForm(initialTitle = '', initialDescription = '') {
  const [title, setTitle] = useState(initialTitle);
  const [description, setDescription] = useState(initialDescription);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const resetForm = () => {
    setTitle(initialTitle);
    setDescription(initialDescription);
    setError(null);
  };

  const validateForm = () => {
    if (!title.trim()) {
      setError('Title is required');
      return false;
    }
    setError(null);
    return true;
  };

  const executeWithLoading = async (operation: () => Promise<void>) => {
    if (!validateForm()) return false;

    setIsLoading(true);
    setError(null);

    try {
      await operation();
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Operation failed');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    title,
    setTitle,
    description,
    setDescription,
    isLoading,
    error,
    resetForm,
    validateForm,
    executeWithLoading,
  };
}
