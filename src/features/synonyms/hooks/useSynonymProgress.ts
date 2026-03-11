import { useState, useCallback, useEffect } from 'react';
import { SynonymWord } from '../../quiz/types';

interface SynonymProgress {
  mastered: Record<string, boolean>; // word ID -> true
  familiar: Record<string, boolean>; // word string -> true
}

const STORAGE_KEY = 'mindflow_synonym_progress_v1';

export const useSynonymProgress = () => {
  const [progress, setProgress] = useState<SynonymProgress>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.error('Failed to parse synonym progress from local storage', e);
    }
    return { mastered: {}, familiar: {} };
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
    } catch (e) {
      console.error('Failed to save synonym progress to local storage', e);
    }
  }, [progress]);

  const markMastered = useCallback((wordObj: SynonymWord) => {
    setProgress((prev) => {
      const newMastered = { ...prev.mastered, [wordObj.id]: true };
      const newFamiliar = { ...prev.familiar };

      // Mark synonyms as familiar
      wordObj.synonyms?.forEach(syn => {
         const synNormalized = syn.text.toLowerCase().trim();
         newFamiliar[synNormalized] = true;
      });

      return { mastered: newMastered, familiar: newFamiliar };
    });
  }, []);

  const getStatus = useCallback((wordObj: SynonymWord): 'mastered' | 'familiar' | 'new' => {
    if (progress.mastered[wordObj.id]) return 'mastered';

    const wordNormalized = wordObj.word.toLowerCase().trim();
    if (progress.familiar[wordNormalized]) return 'familiar';

    return 'new';
  }, [progress]);

  const clearProgress = useCallback(() => {
    setProgress({ mastered: {}, familiar: {} });
  }, []);

  return {
    progress,
    markMastered,
    getStatus,
    clearProgress
  };
};
