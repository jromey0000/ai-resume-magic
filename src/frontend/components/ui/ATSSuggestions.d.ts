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
  isLoading,
}: ATSSuggestionsProps): import('react').JSX.Element;
