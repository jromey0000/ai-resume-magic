import { Crown, Lock, X } from 'lucide-react';
import { useFormContext } from 'react-hook-form';
import { Badge } from '@/components/ui/badge';
import { useTier } from '@/lib/contexts/TierContext';
import { canUseTemplate, RESUME_TEMPLATES } from '@/lib/templates';
import { cn } from '@/lib/utils';

interface TemplatePickerProps {
  isOpen: boolean;
  onClose: () => void;
  onUpgradeClick?: () => void;
}

function TemplatePicker({ isOpen, onClose, onUpgradeClick }: TemplatePickerProps) {
  const { setValue, watch } = useFormContext<ResumeInfo>();
  const { tier } = useTier();
  const currentTemplateId = watch('templateId') || 'classic';

  if (!isOpen) return null;

  const handleSelect = (templateId: string, themeColor: string, allowed: boolean) => {
    if (!allowed) {
      onUpgradeClick?.();
      return;
    }
    setValue('templateId', templateId, { shouldDirty: true });
    setValue('themeColor', themeColor, { shouldDirty: true });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button
        type="button"
        className="absolute inset-0 bg-black/50 backdrop-blur-sm border-0 p-0 cursor-default"
        aria-label="Close dialog"
        onClick={onClose}
      />
      <div className="relative bg-background rounded-2xl shadow-2xl max-w-2xl w-full max-h-[85vh] overflow-hidden border">
        <div className="flex items-center justify-between p-5 border-b">
          <div>
            <h2 className="text-lg font-bold">Choose a Template</h2>
            <p className="text-sm text-muted-foreground">3 free templates · Pro unlocks more</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-muted transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 grid grid-cols-2 sm:grid-cols-3 gap-4 overflow-y-auto max-h-[calc(85vh-80px)]">
          {RESUME_TEMPLATES.map((template) => {
            const allowed = canUseTemplate(template, tier.name);
            const isSelected = currentTemplateId === template.id;

            return (
              <button
                type="button"
                key={template.id}
                onClick={() => handleSelect(template.id, template.themeColor, allowed)}
                className={cn(
                  'relative rounded-xl border-2 p-3 text-left transition-all hover:shadow-md',
                  isSelected
                    ? 'border-primary shadow-md shadow-primary/10'
                    : 'border-border hover:border-primary/50',
                  !allowed && 'opacity-75'
                )}
              >
                {!allowed && (
                  <div className="absolute top-2 right-2">
                    <Lock className="w-3.5 h-3.5 text-muted-foreground" />
                  </div>
                )}

                <div
                  className="h-24 rounded-lg mb-3 bg-white dark:bg-cod-gray-900 overflow-hidden"
                  style={{ borderTop: `3px solid ${template.themeColor}` }}
                >
                  <div className="p-2 text-[6px]">
                    <div
                      className={cn(
                        'font-bold text-[8px] mb-1',
                        template.preview.headerAlign === 'center' && 'text-center'
                      )}
                      style={{ color: template.themeColor }}
                    >
                      John Doe
                    </div>
                    <div
                      className={cn(
                        'h-0.5 w-8 mb-1',
                        template.preview.accentStyle === 'underline' && 'w-full h-px'
                      )}
                      style={{ backgroundColor: template.themeColor }}
                    />
                    <div className="space-y-0.5 text-cod-gray-500">
                      <div className="h-1 w-full bg-cod-gray-200 dark:bg-cod-gray-700 rounded" />
                      <div className="h-1 w-3/4 bg-cod-gray-200 dark:bg-cod-gray-700 rounded" />
                      <div className="h-1 w-5/6 bg-cod-gray-200 dark:bg-cod-gray-700 rounded" />
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 mb-0.5">
                  <span className="font-medium text-sm">{template.name}</span>
                  {template.requiredTier === 'pro' && (
                    <Badge variant="outline" className="text-[10px] px-1 py-0 h-4 gap-0.5">
                      <Crown className="w-2.5 h-2.5" /> Pro
                    </Badge>
                  )}
                </div>
                <p className="text-xs text-muted-foreground line-clamp-2">{template.description}</p>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default TemplatePicker;
