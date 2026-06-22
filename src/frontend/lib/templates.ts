import type { TierName } from '@/lib/contexts/TierContext';

export interface ResumeTemplate {
  id: string;
  name: string;
  description: string;
  themeColor: string;
  requiredTier: TierName;
  preview: {
    headerAlign: 'center' | 'left';
    accentStyle: 'bar' | 'underline' | 'sidebar';
  };
}

export const RESUME_TEMPLATES: ResumeTemplate[] = [
  {
    id: 'classic',
    name: 'Classic',
    description: 'Clean centered layout, works everywhere',
    themeColor: '#cb37d8',
    requiredTier: 'free',
    preview: { headerAlign: 'center', accentStyle: 'bar' },
  },
  {
    id: 'professional',
    name: 'Professional',
    description: 'Conservative blue, ideal for corporate roles',
    themeColor: '#2871a1',
    requiredTier: 'free',
    preview: { headerAlign: 'center', accentStyle: 'underline' },
  },
  {
    id: 'modern',
    name: 'Modern',
    description: 'Fresh green accent for tech and startups',
    themeColor: '#059669',
    requiredTier: 'free',
    preview: { headerAlign: 'left', accentStyle: 'bar' },
  },
  {
    id: 'executive',
    name: 'Executive',
    description: 'Bold navy for senior leadership roles',
    themeColor: '#1e3a5f',
    requiredTier: 'pro',
    preview: { headerAlign: 'left', accentStyle: 'sidebar' },
  },
  {
    id: 'creative',
    name: 'Creative',
    description: 'Vibrant purple for design and marketing',
    themeColor: '#7c3aed',
    requiredTier: 'pro',
    preview: { headerAlign: 'center', accentStyle: 'bar' },
  },
  {
    id: 'minimal',
    name: 'Minimal',
    description: 'Understated charcoal, maximum readability',
    themeColor: '#374151',
    requiredTier: 'pro',
    preview: { headerAlign: 'left', accentStyle: 'underline' },
  },
];

export function getTemplateById(id?: string): ResumeTemplate {
  return RESUME_TEMPLATES.find((t) => t.id === id) ?? RESUME_TEMPLATES[0];
}

export function canUseTemplate(template: ResumeTemplate, userTier: TierName): boolean {
  const tierOrder: TierName[] = ['free', 'pro', 'enterprise'];
  return tierOrder.indexOf(userTier) >= tierOrder.indexOf(template.requiredTier);
}
