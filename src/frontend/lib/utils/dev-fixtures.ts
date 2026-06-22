/**
 * Development fixtures for testing resume creation flow.
 * These are only used in development mode.
 */

import type { ResumeInfo, WorkExperience, Education, Skill } from '@/types/global'
import { DEFAULT_THEME_COLOR } from '@/lib/templates'

const SAMPLE_EXPERIENCES: WorkExperience[] = [
  {
    title: 'Senior Software Engineer',
    companyName: 'TechCorp Inc.',
    city: 'San Francisco',
    state: 'CA',
    startDate: '2021-03',
    endDate: '',
    currentlyWorking: true,
    workSummary:
      'Led development of microservices architecture serving 10M+ users. Reduced API latency by 40% through performance optimization. Mentored team of 5 junior developers and established coding standards.',
  },
  {
    title: 'Software Engineer',
    companyName: 'StartupXYZ',
    city: 'Austin',
    state: 'TX',
    startDate: '2018-06',
    endDate: '2021-02',
    currentlyWorking: false,
    workSummary:
      'Built React-based dashboard used by 500+ enterprise customers. Implemented CI/CD pipeline reducing deployment time by 60%. Collaborated with product team to deliver features on aggressive timelines.',
  },
]

const SAMPLE_EDUCATION: Education[] = [
  {
    school: 'University of California, Berkeley',
    degree: 'Bachelor of Science',
    major: 'Computer Science',
    city: 'Berkeley',
    state: 'CA',
    startDate: '2014-08',
    endDate: '2018-05',
    description: 'Graduated with honors. Relevant coursework: Data Structures, Algorithms, Database Systems, Machine Learning.',
  },
]

const SAMPLE_SKILLS: Skill[] = [
  { name: 'TypeScript', rating: 95 },
  { name: 'React', rating: 90 },
  { name: 'Node.js', rating: 85 },
  { name: 'PostgreSQL', rating: 80 },
  { name: 'AWS', rating: 75 },
  { name: 'Python', rating: 70 },
]

const SAMPLE_SUMMARY =
  'Results-driven Senior Software Engineer with 6+ years of experience building scalable web applications. Expert in TypeScript, React, and Node.js with a proven track record of leading high-impact projects. Passionate about clean code, performance optimization, and mentoring developers.'

export function createMockResumeInfo(overrides: Partial<ResumeInfo> = {}): ResumeInfo {
  return {
    firstName: 'Alex',
    lastName: 'Johnson',
    jobTitle: 'Senior Software Engineer',
    address: '123 Tech Street, San Francisco, CA 94102',
    phone: '5551234567',
    email: 'alex.johnson@example.com',
    themeColor: DEFAULT_THEME_COLOR,
    templateId: 'classic',
    summary: SAMPLE_SUMMARY,
    experience: SAMPLE_EXPERIENCES,
    education: SAMPLE_EDUCATION,
    skills: SAMPLE_SKILLS,
    ...overrides,
  }
}

export function createMinimalMockResumeInfo(): ResumeInfo {
  return {
    firstName: 'Test',
    lastName: 'User',
    jobTitle: 'Developer',
    email: 'test@example.com',
    phone: '5550001111',
    themeColor: DEFAULT_THEME_COLOR,
    templateId: 'classic',
    summary: 'A skilled developer with experience in building web applications and solving complex problems efficiently.',
    experience: [
      {
        title: 'Developer',
        companyName: 'Test Company',
        city: 'New York',
        state: 'NY',
        startDate: '2022-01',
        endDate: '',
        currentlyWorking: true,
        workSummary: 'Built and maintained web applications using modern technologies.',
      },
    ],
    education: [
      {
        school: 'State University',
        degree: 'Bachelor of Science',
        major: 'Computer Science',
        city: 'Boston',
        state: 'MA',
        startDate: '2018-09',
        endDate: '2022-05',
        description: 'Studied computer science fundamentals.',
      },
    ],
    skills: [
      { name: 'JavaScript', rating: 80 },
      { name: 'React', rating: 80 },
    ],
  }
}

export function seedGuestDraft(resumeInfo: ResumeInfo = createMockResumeInfo()): void {
  const draft = {
    title: `${resumeInfo.firstName} ${resumeInfo.lastName} - ${resumeInfo.jobTitle}`,
    resumeInfo,
    createdAt: new Date().toISOString(),
  }
  localStorage.setItem('ai-resume-magic-guest-draft', JSON.stringify(draft))
}

/**
 * Quick helper to seed and navigate - call from browser console:
 * 
 * import { devSeedAndNavigate } from '@/lib/utils/dev-fixtures'
 * devSeedAndNavigate()
 */
export function devSeedAndNavigate(): void {
  seedGuestDraft()
  window.location.href = '/dashboard/resume/guest/edit'
}

// Expose to window in development for easy console access
if (import.meta.env.DEV) {
  ;(window as unknown as Record<string, unknown>).__devFixtures = {
    createMockResumeInfo,
    createMinimalMockResumeInfo,
    seedGuestDraft,
    devSeedAndNavigate,
  }
}
