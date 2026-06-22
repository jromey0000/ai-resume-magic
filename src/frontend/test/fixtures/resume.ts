/**
 * Test fixtures for resume data.
 * Use these in unit and integration tests.
 */

import type { ResumeInfo, WorkExperience, Education, Skill } from '@/types/global'
import { DEFAULT_THEME_COLOR } from '@/lib/templates'

export const sampleExperience: WorkExperience = {
  title: 'Software Engineer',
  companyName: 'Test Company',
  city: 'San Francisco',
  state: 'CA',
  startDate: '2022-01',
  endDate: '',
  currentlyWorking: true,
  workSummary: 'Built and maintained web applications using React and Node.js.',
}

export const sampleEducation: Education = {
  school: 'Test University',
  degree: 'Bachelor of Science',
  major: 'Computer Science',
  city: 'Berkeley',
  state: 'CA',
  startDate: '2018-08',
  endDate: '2022-05',
  description: 'Studied computer science and software engineering.',
}

export const sampleSkill: Skill = {
  name: 'TypeScript',
  rating: 85,
}

export const minimalResumeInfo: ResumeInfo = {
  firstName: 'Test',
  lastName: 'User',
  jobTitle: 'Developer',
  email: 'test@example.com',
  phone: '5551234567',
  themeColor: DEFAULT_THEME_COLOR,
  templateId: 'classic',
}

export const completeResumeInfo: ResumeInfo = {
  firstName: 'Alex',
  lastName: 'Johnson',
  jobTitle: 'Senior Software Engineer',
  address: '123 Test Street, San Francisco, CA 94102',
  phone: '5559876543',
  email: 'alex.johnson@test.com',
  themeColor: DEFAULT_THEME_COLOR,
  templateId: 'classic',
  summary:
    'Experienced software engineer with 5+ years building scalable web applications. Expert in TypeScript, React, and Node.js.',
  experience: [
    {
      title: 'Senior Software Engineer',
      companyName: 'TechCorp',
      city: 'San Francisco',
      state: 'CA',
      startDate: '2021-03',
      endDate: '',
      currentlyWorking: true,
      workSummary:
        'Led development of microservices architecture. Reduced API latency by 40%.',
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
        'Built React dashboard for enterprise customers. Implemented CI/CD pipeline.',
    },
  ],
  education: [
    {
      school: 'UC Berkeley',
      degree: 'Bachelor of Science',
      major: 'Computer Science',
      city: 'Berkeley',
      state: 'CA',
      startDate: '2014-08',
      endDate: '2018-05',
      description: 'Graduated with honors in Computer Science.',
    },
  ],
  skills: [
    { name: 'TypeScript', rating: 95 },
    { name: 'React', rating: 90 },
    { name: 'Node.js', rating: 85 },
    { name: 'PostgreSQL', rating: 80 },
  ],
}

/**
 * Create a resume with custom overrides
 */
export function createResumeInfo(overrides: Partial<ResumeInfo> = {}): ResumeInfo {
  return {
    ...completeResumeInfo,
    ...overrides,
  }
}

/**
 * Create a guest draft object for localStorage testing
 */
export function createGuestDraft(resumeInfo: ResumeInfo = completeResumeInfo) {
  return {
    title: `${resumeInfo.firstName} ${resumeInfo.lastName} - ${resumeInfo.jobTitle}`,
    resumeInfo,
    createdAt: new Date().toISOString(),
  }
}

/**
 * Seed localStorage with a guest draft for integration tests
 */
export function seedGuestDraftStorage(resumeInfo: ResumeInfo = completeResumeInfo): void {
  const draft = createGuestDraft(resumeInfo)
  localStorage.setItem('ai-resume-magic-guest-draft', JSON.stringify(draft))
}

/**
 * Clear guest draft from localStorage
 */
export function clearGuestDraftStorage(): void {
  localStorage.removeItem('ai-resume-magic-guest-draft')
}
