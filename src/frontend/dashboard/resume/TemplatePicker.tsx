import { Check, Crown, Lock, Palette, X } from 'lucide-react';
import { useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { Badge } from '@/components/ui/badge';
import { useTier } from '@/lib/contexts/TierContext';
import { canUseTemplate, DEFAULT_THEME_COLOR, RESUME_TEMPLATES } from '@/lib/templates';
import { cn } from '@/lib/utils';

const FREE_COLORS = [
  { id: 'blue', value: DEFAULT_THEME_COLOR, name: 'Blue' },
  { id: 'gray', value: '#4b5563', name: 'Gray' },
  { id: 'green', value: '#16a34a', name: 'Green' },
  { id: 'navy', value: '#1e3a5f', name: 'Navy' },
] as const;

const PRO_COLORS = [
  { id: 'purple', value: '#cb37d8', name: 'Purple' },
  { id: 'violet', value: '#7c3aed', name: 'Violet' },
  { id: 'rose', value: '#e11d48', name: 'Rose' },
  { id: 'orange', value: '#ea580c', name: 'Orange' },
  { id: 'teal', value: '#0d9488', name: 'Teal' },
  { id: 'indigo', value: '#4f46e5', name: 'Indigo' },
  { id: 'pink', value: '#db2777', name: 'Pink' },
  { id: 'amber', value: '#d97706', name: 'Amber' },
] as const;

interface TemplatePickerProps {
  isOpen: boolean;
  onClose: () => void;
  onUpgradeClick?: () => void;
}

function TemplatePicker({ isOpen, onClose, onUpgradeClick }: TemplatePickerProps) {
  const { setValue, watch } = useFormContext<ResumeInfo>();
  const { tier } = useTier();
  const currentTemplateId = watch('templateId') || 'classic';
  const currentColor = watch('themeColor') || DEFAULT_THEME_COLOR;
  const [customColorInput, setCustomColorInput] = useState(currentColor);

  const hasCustomColors = tier.limits.hasCustomColors;

  if (!isOpen) return null;

  const handleSelectTemplate = (templateId: string, allowed: boolean) => {
    if (!allowed) {
      onUpgradeClick?.();
      return;
    }
    setValue('templateId', templateId, { shouldDirty: true });
  };

  const handleSelectColor = (color: string) => {
    setValue('themeColor', color, { shouldDirty: true });
    setCustomColorInput(color);
  };

  const handleCustomColorChange = (color: string) => {
    if (!hasCustomColors) {
      onUpgradeClick?.();
      return;
    }
    setCustomColorInput(color);
    setValue('themeColor', color, { shouldDirty: true });
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
            <h2 className="text-lg font-bold">Customize Your Resume</h2>
            <p className="text-sm text-muted-foreground">Choose a template and accent color</p>
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

        <div className="p-5 space-y-6 overflow-y-auto max-h-[calc(85vh-80px)]">
          {/* Color Selection */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Palette className="w-4 h-4 text-muted-foreground" />
              <h3 className="font-semibold text-sm">Accent Color</h3>
            </div>

            {/* Free colors */}
            <div className="flex flex-wrap items-center gap-2 mb-3">
              {FREE_COLORS.map((color) => {
                const isSelected = currentColor.toLowerCase() === color.value.toLowerCase();
                return (
                  <button
                    key={color.id}
                    type="button"
                    onClick={() => handleSelectColor(color.value)}
                    className={cn(
                      'w-8 h-8 rounded-full border-2 transition-all flex items-center justify-center',
                      isSelected
                        ? 'border-foreground scale-110 shadow-lg'
                        : 'border-transparent hover:scale-105 hover:shadow-md'
                    )}
                    style={{ backgroundColor: color.value }}
                    title={color.name}
                  >
                    {isSelected && <Check className="w-4 h-4 text-white drop-shadow-md" />}
                  </button>
                );
              })}
            </div>

            {/* Pro colors */}
            <div className="flex flex-wrap items-center gap-2">
              {PRO_COLORS.map((color) => {
                const isSelected = currentColor.toLowerCase() === color.value.toLowerCase();
                return (
                  <button
                    key={color.id}
                    type="button"
                    onClick={() => {
                      if (!hasCustomColors) {
                        onUpgradeClick?.();
                        return;
                      }
                      handleSelectColor(color.value);
                    }}
                    className={cn(
                      'relative w-8 h-8 rounded-full border-2 transition-all flex items-center justify-center',
                      isSelected
                        ? 'border-foreground scale-110 shadow-lg'
                        : 'border-transparent hover:scale-105 hover:shadow-md',
                      !hasCustomColors && 'opacity-60'
                    )}
                    style={{ backgroundColor: color.value }}
                    title={hasCustomColors ? color.name : `${color.name} (Pro)`}
                  >
                    {isSelected && <Check className="w-4 h-4 text-white drop-shadow-md" />}
                    {!hasCustomColors && (
                      <Lock className="w-3 h-3 text-white/80 drop-shadow-md" />
                    )}
                  </button>
                );
              })}

              {/* Custom color picker */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => !hasCustomColors && onUpgradeClick?.()}
                  className={cn(
                    'relative w-8 h-8 rounded-full border-2 border-dashed transition-all overflow-hidden',
                    hasCustomColors
                      ? 'border-muted-foreground/50 hover:border-muted-foreground cursor-pointer'
                      : 'border-muted-foreground/30 cursor-pointer opacity-60'
                  )}
                  title={hasCustomColors ? 'Custom color' : 'Custom color (Pro)'}
                >
                  {hasCustomColors ? (
                    <input
                      type="color"
                      value={customColorInput}
                      onChange={(e) => handleCustomColorChange(e.target.value)}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                  ) : (
                    <Lock className="w-3 h-3 text-muted-foreground absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10" />
                  )}
                  <div
                    className="absolute inset-1 rounded-full"
                    style={{
                      background: `conic-gradient(red, yellow, lime, aqua, blue, magenta, red)`,
                    }}
                  />
                </button>
              </div>

              {hasCustomColors && (
                <div className="flex items-center gap-1.5 ml-1">
                  <input
                    type="text"
                    value={customColorInput}
                    onChange={(e) => {
                      const val = e.target.value;
                      setCustomColorInput(val);
                      if (/^#[0-9A-Fa-f]{6}$/.test(val)) {
                        setValue('themeColor', val, { shouldDirty: true });
                      }
                    }}
                    placeholder="#000000"
                    className="w-20 px-2 py-1 text-xs font-mono border rounded-md bg-background"
                    maxLength={7}
                  />
                </div>
              )}

              {!hasCustomColors && (
                <button
                  type="button"
                  onClick={onUpgradeClick}
                  className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors ml-1"
                >
                  <Crown className="w-3 h-3" />
                  <span>Unlock Pro colors</span>
                </button>
              )}
            </div>
          </div>

          {/* Template Selection */}
          <div>
            <h3 className="font-semibold text-sm mb-3">Template Style</h3>
            <p className="text-xs text-muted-foreground mb-3">3 free templates · Pro unlocks more</p>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {RESUME_TEMPLATES.map((template) => {
                const allowed = canUseTemplate(template, tier.name);
                const isSelected = currentTemplateId === template.id;

                return (
                  <button
                    type="button"
                    key={template.id}
                    data-locked={allowed ? 'false' : 'true'}
                    onClick={() => handleSelectTemplate(template.id, allowed)}
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
                      className={cn(
                        'h-24 rounded-lg mb-3 bg-white dark:bg-cod-gray-900 overflow-hidden',
                        template.preview.accentStyle === 'sidebar' && 'border-l-[3px]',
                        template.preview.accentStyle !== 'sidebar' && 'border-t-[3px]'
                      )}
                      style={{ borderColor: currentColor }}
                    >
                      <div className="p-2 text-[6px]">
                        <div
                          className={cn(
                            'font-bold mb-0.5',
                            template.preview.nameSize === 'xlarge' ? 'text-[9px]' : 'text-[8px]',
                            template.preview.headerAlign === 'center' && 'text-center'
                          )}
                          style={{ color: currentColor }}
                        >
                          John Doe
                        </div>
                        {template.preview.sectionDivider === 'line' && (
                          <div className="h-px w-full mb-1" style={{ backgroundColor: currentColor }} />
                        )}
                        {template.preview.sectionDivider === 'double-line' && (
                          <div className="space-y-px mb-1">
                            <div className="h-px w-full" style={{ backgroundColor: currentColor }} />
                            <div className="h-px w-full" style={{ backgroundColor: currentColor }} />
                          </div>
                        )}
                        <div
                          className={cn(
                            'font-semibold text-[5px] mb-1',
                            template.preview.sectionHeaderAlign === 'center' && 'text-center'
                          )}
                          style={{ color: currentColor }}
                        >
                          Experience
                        </div>
                        <div className="space-y-0.5 text-cod-gray-500">
                          <div className="h-1 w-full bg-cod-gray-200 dark:bg-cod-gray-700 rounded" />
                          <div className="h-1 w-3/4 bg-cod-gray-200 dark:bg-cod-gray-700 rounded" />
                          {template.preview.skillsLayout === 'tags' ? (
                            <div className="flex gap-0.5 pt-0.5">
                              <div className="h-1.5 w-6 rounded-full border" style={{ borderColor: currentColor }} />
                              <div className="h-1.5 w-5 rounded-full border" style={{ borderColor: currentColor }} />
                              <div className="h-1.5 w-7 rounded-full border" style={{ borderColor: currentColor }} />
                            </div>
                          ) : template.preview.skillsLayout === 'bars' ? (
                            <div className="flex items-center gap-1 pt-0.5">
                              <div className="h-1 w-4 bg-cod-gray-300 dark:bg-cod-gray-600 rounded" />
                              <div className="h-1 w-10 bg-cod-gray-200 dark:bg-cod-gray-700 rounded overflow-hidden">
                                <div className="h-1 w-3/4" style={{ backgroundColor: currentColor }} />
                              </div>
                            </div>
                          ) : (
                            <div className="h-1 w-5/6 bg-cod-gray-200 dark:bg-cod-gray-700 rounded" />
                          )}
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
      </div>
    </div>
  );
}

export default TemplatePicker;
