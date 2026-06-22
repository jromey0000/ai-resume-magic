import type { TierName } from '@/lib/contexts/TierContext';

/** Default accent color — first free-tier color so new/guest users aren't locked to Pro purple */
export const DEFAULT_THEME_COLOR = '#2563eb';

export interface ResumeTemplate {
  id: string;
  name: string;
  description: string;
  themeColor: string;
  requiredTier: TierName;
  preview: {
    headerAlign: 'center' | 'left';
    accentStyle: 'bar' | 'underline' | 'sidebar' | 'none';
    sectionHeaderAlign: 'center' | 'left';
    sectionDivider: 'line' | 'double-line' | 'none';
    datePosition: 'inline' | 'right' | 'below';
    skillsLayout: 'bars' | 'tags' | 'list';
    contactLayout: 'row' | 'centered' | 'columns';
    nameSize: 'large' | 'xlarge';
    sectionSpacing: 'compact' | 'normal' | 'relaxed';
  };
}

export const RESUME_TEMPLATES: ResumeTemplate[] = [
  {
    id: 'classic',
    name: 'Classic',
    description: 'Clean centered layout, works everywhere',
    themeColor: DEFAULT_THEME_COLOR,
    requiredTier: 'free',
    preview: {
      headerAlign: 'center',
      accentStyle: 'bar',
      sectionHeaderAlign: 'center',
      sectionDivider: 'line',
      datePosition: 'inline',
      skillsLayout: 'bars',
      contactLayout: 'row',
      nameSize: 'large',
      sectionSpacing: 'normal',
    },
  },
  {
    id: 'professional',
    name: 'Professional',
    description: 'Conservative blue, ideal for corporate roles',
    themeColor: '#2871a1',
    requiredTier: 'free',
    preview: {
      headerAlign: 'center',
      accentStyle: 'underline',
      sectionHeaderAlign: 'center',
      sectionDivider: 'double-line',
      datePosition: 'right',
      skillsLayout: 'tags',
      contactLayout: 'centered',
      nameSize: 'xlarge',
      sectionSpacing: 'relaxed',
    },
  },
  {
    id: 'modern',
    name: 'Modern',
    description: 'Fresh green accent for tech and startups',
    themeColor: '#059669',
    requiredTier: 'free',
    preview: {
      headerAlign: 'left',
      accentStyle: 'bar',
      sectionHeaderAlign: 'left',
      sectionDivider: 'none',
      datePosition: 'below',
      skillsLayout: 'list',
      contactLayout: 'columns',
      nameSize: 'xlarge',
      sectionSpacing: 'compact',
    },
  },
  {
    id: 'executive',
    name: 'Executive',
    description: 'Bold navy for senior leadership roles',
    themeColor: '#1e3a5f',
    requiredTier: 'pro',
    preview: {
      headerAlign: 'left',
      accentStyle: 'sidebar',
      sectionHeaderAlign: 'left',
      sectionDivider: 'line',
      datePosition: 'right',
      skillsLayout: 'list',
      contactLayout: 'columns',
      nameSize: 'large',
      sectionSpacing: 'relaxed',
    },
  },
  {
    id: 'creative',
    name: 'Creative',
    description: 'Vibrant purple for design and marketing',
    themeColor: '#7c3aed',
    requiredTier: 'pro',
    preview: {
      headerAlign: 'center',
      accentStyle: 'bar',
      sectionHeaderAlign: 'center',
      sectionDivider: 'none',
      datePosition: 'inline',
      skillsLayout: 'tags',
      contactLayout: 'centered',
      nameSize: 'xlarge',
      sectionSpacing: 'normal',
    },
  },
  {
    id: 'minimal',
    name: 'Minimal',
    description: 'Understated charcoal, maximum readability',
    themeColor: '#374151',
    requiredTier: 'pro',
    preview: {
      headerAlign: 'left',
      accentStyle: 'none',
      sectionHeaderAlign: 'left',
      sectionDivider: 'line',
      datePosition: 'right',
      skillsLayout: 'list',
      contactLayout: 'row',
      nameSize: 'large',
      sectionSpacing: 'compact',
    },
  },
];

export function getTemplateById(id?: string): ResumeTemplate {
  return RESUME_TEMPLATES.find((t) => t.id === id) ?? RESUME_TEMPLATES[0];
}

export function canUseTemplate(template: ResumeTemplate, userTier: TierName): boolean {
  const tierOrder: TierName[] = ['free', 'pro', 'enterprise'];
  return tierOrder.indexOf(userTier) >= tierOrder.indexOf(template.requiredTier);
}
