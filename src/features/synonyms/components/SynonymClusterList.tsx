import React, { useMemo } from 'react';
import { SynonymWord } from '../../quiz/types';
import { useSynonymProgress } from '../hooks/useSynonymProgress';

interface SynonymClusterListProps {
  data: SynonymWord[];
  onExit: () => void;
  onSelectWord: (word: SynonymWord) => void;
}

export const SynonymClusterList: React.FC<SynonymClusterListProps> = ({
  data,
  onExit,
  onSelectWord,
}) => {
  const { getStatus } = useSynonymProgress();

  // Group data by cluster_id or theme
  const clusters = useMemo(() => {
    const grouped = data.reduce((acc, word) => {
      const key = word.theme || word.cluster_id;
      if (!acc[key]) acc[key] = [];
      acc[key].push(word);
      return acc;
    }, {} as Record<string, SynonymWord[]>);

    // Sort clusters based on average importance score? For now just return as-is
    return grouped;
  }, [data]);

  const getHeatmapStyle = (score: number) => {
    if (score > 10) return 'border-l-4 border-red-500 bg-red-50/10'; // Hot
    if (score >= 5) return 'border-l-4 border-yellow-500 bg-yellow-50/10'; // Warm
    return 'border-l-4 border-transparent bg-white/5'; // Cool
  };

  const getStatusIcon = (status: 'new' | 'familiar' | 'mastered') => {
    switch (status) {
      case 'mastered': return '🟢';
      case 'familiar': return '🟡';
      case 'new': return '🔴';
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200">
      <div className="flex items-center justify-between p-4 bg-white dark:bg-slate-800 shadow-sm z-10 sticky top-0">
        <button
          onClick={onExit}
          className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full transition-colors"
          aria-label="Exit list view"
        >
           ← Back
        </button>
        <h1 className="text-xl font-bold font-serif">Word Clusters</h1>
        <div className="w-8" />
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-8">
        {Object.entries(clusters).map(([theme, words]) => (
          <div key={theme} className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
            <div className="bg-slate-100 dark:bg-slate-700 p-3 font-semibold text-sm border-b border-slate-200 dark:border-slate-600">
              {theme}
            </div>
            <div className="divide-y divide-slate-100 dark:divide-slate-700">
              {words.map(word => {
                const status = getStatus(word);
                const heatmapStyle = getHeatmapStyle(word.importance_score);

                return (
                  <div
                    key={word.id}
                    onClick={() => onSelectWord(word)}
                    className={`p-4 flex items-center justify-between cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors ${heatmapStyle} ${status === 'mastered' ? 'opacity-50' : ''}`}
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                         <span className="font-bold text-lg">{word.word}</span>
                         {word.importance_score > 10 && <span title="High Frequency">🔥</span>}
                         {word.importance_score >= 5 && word.importance_score <= 10 && <span title="Medium Frequency">⭐</span>}
                         {word.confusable_with?.length > 0 && <span title={`Confusable with ${word.confusable_with.join(', ')}`} className="text-orange-500 cursor-help ml-2 border rounded-full px-1 text-xs font-bold bg-orange-100">!</span>}
                      </div>
                      <div className="text-sm text-slate-500 dark:text-slate-400 mt-1 line-clamp-1">
                        {word.hindiMeaning} • {word.synonyms?.slice(0, 3).map(s => s.text).join(', ')}
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <div className="text-xs font-medium text-slate-400 dark:text-slate-500" title="Repetition Score">
                        {word.repetition_raw || ''}
                      </div>
                      <div className="text-lg" title={status}>
                        {getStatusIcon(status)}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
