import {
  Briefcase,
  Check,
  ChevronDown,
  ChevronUp,
  Copy,
  FileText,
  Lightbulb,
  Sparkles,
  Tag,
} from 'lucide-react';
import { useState } from 'react';
import cn from '@/lib/utils/cn';
import Button from './Button';

interface ATSSuggestion {
  id: string;
  type: 'keyword' | 'skill' | 'experience' | 'format' | 'summary';
  priority: 'high' | 'medium' | 'low';
  title: string;
  description: string;
  currentText?: string;
  suggestedText?: string;
}

interface ATSSuggestionsProps {
  suggestions: ATSSuggestion[];
  onApplySuggestion?: (suggestion: ATSSuggestion) => void;
  isLoading?: boolean;
}

export default function ATSSuggestions({
  suggestions,
  onApplySuggestion,
  isLoading = false,
}: ATSSuggestionsProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const getTypeIcon = (type: ATSSuggestion['type']) => {
    switch (type) {
      case 'keyword':
        return <Tag className="w-4 h-4" />;
      case 'skill':
        return <Sparkles className="w-4 h-4" />;
      case 'experience':
        return <Briefcase className="w-4 h-4" />;
      case 'format':
        return <FileText className="w-4 h-4" />;
      case 'summary':
        return <FileText className="w-4 h-4" />;
      default:
        return <Lightbulb className="w-4 h-4" />;
    }
  };

  const getPriorityStyles = (priority: ATSSuggestion['priority']) => {
    switch (priority) {
      case 'high':
        return 'bg-coral-rose-100 text-coral-rose-700 dark:bg-coral-rose-900/30 dark:text-coral-rose-400';
      case 'medium':
        return 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400';
      case 'low':
        return 'bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400';
      default:
        return 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400';
    }
  };

  const getTypeStyles = (type: ATSSuggestion['type']) => {
    switch (type) {
      case 'keyword':
        return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400';
      case 'skill':
        return 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400';
      case 'experience':
        return 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400';
      case 'format':
        return 'bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400';
      case 'summary':
        return 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400';
      default:
        return 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400';
    }
  };

  const handleCopy = async (text: string, id: string) => {
    await navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  if (isLoading) {
    return (
      <div className="bg-white dark:bg-cod-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-cod-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <Lightbulb className="w-5 h-5 text-primary" />
          Improvement Suggestions
        </h3>
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="h-16 bg-gray-200 dark:bg-cod-gray-700 rounded-lg" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (suggestions.length === 0) {
    return (
      <div className="bg-white dark:bg-cod-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-cod-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <Lightbulb className="w-5 h-5 text-primary" />
          Improvement Suggestions
        </h3>
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          <Sparkles className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p>Paste a job description to get personalized suggestions!</p>
        </div>
      </div>
    );
  }

  const sortedSuggestions = [...suggestions].sort((a, b) => {
    const priorityOrder = { high: 0, medium: 1, low: 2 };
    return priorityOrder[a.priority] - priorityOrder[b.priority];
  });

  return (
    <div className="bg-white dark:bg-cod-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-cod-gray-700">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
        <Lightbulb className="w-5 h-5 text-primary" />
        Improvement Suggestions
        <span className="ml-auto text-sm font-normal text-gray-500 dark:text-gray-400">
          {suggestions.length} suggestions
        </span>
      </h3>

      <div className="space-y-3">
        {sortedSuggestions.map((suggestion) => (
          <div
            key={suggestion.id}
            className="border border-gray-200 dark:border-cod-gray-700 rounded-lg overflow-hidden"
          >
            <button
              type="button"
              onClick={() => setExpandedId(expandedId === suggestion.id ? null : suggestion.id)}
              className="w-full p-4 flex items-start gap-3 hover:bg-gray-50 dark:hover:bg-cod-gray-700/50 transition-colors text-left"
            >
              <div className={cn('p-2 rounded-lg', getTypeStyles(suggestion.type))}>
                {getTypeIcon(suggestion.type)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span
                    className={cn(
                      'text-xs px-2 py-0.5 rounded-full',
                      getPriorityStyles(suggestion.priority)
                    )}
                  >
                    {suggestion.priority}
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                    {suggestion.type}
                  </span>
                </div>
                <h4 className="font-medium text-gray-900 dark:text-white">{suggestion.title}</h4>
              </div>
              {expandedId === suggestion.id ? (
                <ChevronUp className="w-5 h-5 text-gray-400 flex-shrink-0" />
              ) : (
                <ChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0" />
              )}
            </button>

            {expandedId === suggestion.id && (
              <div className="px-4 pb-4 border-t border-gray-200 dark:border-cod-gray-700">
                <p className="mt-3 text-sm text-gray-600 dark:text-gray-400">
                  {suggestion.description}
                </p>

                {suggestion.currentText && (
                  <div className="mt-3">
                    <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                      Current:
                    </p>
                    <div className="bg-coral-rose-50 dark:bg-coral-rose-900/20 border border-coral-rose-200 dark:border-coral-rose-800 rounded p-2 text-sm text-coral-rose-800 dark:text-coral-rose-300">
                      {suggestion.currentText}
                    </div>
                  </div>
                )}

                {suggestion.suggestedText && (
                  <div className="mt-3">
                    <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                      Suggested:
                    </p>
                    <div className="bg-teal-50 dark:bg-teal-900/20 border border-teal-200 dark:border-teal-800 rounded p-2 text-sm text-teal-800 dark:text-teal-300">
                      {suggestion.suggestedText}
                    </div>
                    <div className="flex gap-2 mt-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleCopy(suggestion.suggestedText!, suggestion.id)}
                        className="flex items-center gap-1"
                      >
                        {copiedId === suggestion.id ? (
                          <>
                            <Check className="w-3 h-3" /> Copied
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" /> Copy
                          </>
                        )}
                      </Button>
                      {onApplySuggestion && (
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() => onApplySuggestion(suggestion)}
                        >
                          Apply Suggestion
                        </Button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
