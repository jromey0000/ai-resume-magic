import mammoth from 'mammoth';
import * as pdfjs from 'pdfjs-dist';

pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.mjs`;

export interface ParsedResumeData {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  address?: string;
  jobTitle?: string;
  summary?: string;
  experience?: Array<{
    title: string;
    companyName: string;
    city?: string;
    state?: string;
    startDate?: string;
    endDate?: string;
    currentlyWorking?: boolean;
    workSummary?: string;
  }>;
  education?: Array<{
    degree?: string;
    major?: string;
    school: string;
    city?: string;
    state?: string;
    startDate?: string;
    endDate?: string;
    description?: string;
  }>;
  skills?: Array<{
    name: string;
    rating?: number;
  }>;
  rawText: string;
}

async function extractTextFromPdf(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjs.getDocument({ data: arrayBuffer }).promise;

  let fullText = '';

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const textContent = await page.getTextContent();
    const pageText = textContent.items.map((item: { str?: string }) => item.str || '').join(' ');
    fullText += `${pageText}\n`;
  }

  return fullText;
}

async function extractTextFromDocx(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer();
  const result = await mammoth.extractRawText({ arrayBuffer });
  return result.value;
}

function extractEmail(text: string): string | undefined {
  const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
  const matches = text.match(emailRegex);
  return matches?.[0];
}

function extractPhone(text: string): string | undefined {
  const phonePatterns = [
    /\+?1?[-.\s]?\(?[0-9]{3}\)?[-.\s]?[0-9]{3}[-.\s]?[0-9]{4}/g,
    /\([0-9]{3}\)\s?[0-9]{3}-[0-9]{4}/g,
    /[0-9]{3}[-.\s][0-9]{3}[-.\s][0-9]{4}/g,
  ];

  for (const pattern of phonePatterns) {
    const matches = text.match(pattern);
    if (matches?.[0]) {
      return matches[0].replace(/[^\d+]/g, '').replace(/^1/, '');
    }
  }
  return undefined;
}

function extractName(text: string): { firstName?: string; lastName?: string } {
  const lines = text.split('\n').filter((line) => line.trim());

  for (const line of lines.slice(0, 5)) {
    const trimmed = line.trim();
    if (trimmed.length < 50 && !trimmed.includes('@') && !trimmed.match(/\d{3}/)) {
      const words = trimmed
        .split(/\s+/)
        .filter(
          (w) => w.length > 1 && !['resume', 'cv', 'curriculum', 'vitae'].includes(w.toLowerCase())
        );

      if (words.length >= 2 && words.length <= 4) {
        const capitalized = words.every((w) => /^[A-Z]/.test(w));
        if (capitalized) {
          return {
            firstName: words[0],
            lastName: words.slice(1).join(' '),
          };
        }
      }
    }
  }

  return {};
}

function extractJobTitle(text: string): string | undefined {
  const titlePatterns = [
    /(?:current|previous)?\s*(?:position|title|role)[:\s]+([^\n]+)/i,
    /(?:software|senior|junior|lead|staff|principal)\s+(?:engineer|developer|designer|manager|architect)/i,
    /(?:product|project|program)\s+manager/i,
    /(?:data|machine learning|ml|ai)\s+(?:scientist|engineer)/i,
    /(?:ux|ui|product)\s+designer/i,
    /(?:full[\s-]?stack|frontend|backend|devops)\s+(?:developer|engineer)/i,
  ];

  for (const pattern of titlePatterns) {
    const match = text.match(pattern);
    if (match) {
      return match[1]?.trim() || match[0].trim();
    }
  }

  return undefined;
}

function extractSkills(text: string): Array<{ name: string; rating?: number }> {
  const commonSkills = [
    'JavaScript',
    'TypeScript',
    'Python',
    'Java',
    'C++',
    'C#',
    'Go',
    'Rust',
    'Ruby',
    'PHP',
    'React',
    'Angular',
    'Vue',
    'Next.js',
    'Node.js',
    'Express',
    'Django',
    'Flask',
    'Spring',
    'AWS',
    'Azure',
    'GCP',
    'Docker',
    'Kubernetes',
    'Terraform',
    'Jenkins',
    'CI/CD',
    'PostgreSQL',
    'MySQL',
    'MongoDB',
    'Redis',
    'Elasticsearch',
    'GraphQL',
    'REST',
    'Git',
    'Linux',
    'Agile',
    'Scrum',
    'Jira',
    'Figma',
    'Photoshop',
    'Machine Learning',
    'Deep Learning',
    'TensorFlow',
    'PyTorch',
    'Data Analysis',
    'SQL',
    'HTML',
    'CSS',
    'Sass',
    'Tailwind',
    'Bootstrap',
  ];

  const lowerText = text.toLowerCase();
  const foundSkills: Array<{ name: string; rating?: number }> = [];

  for (const skill of commonSkills) {
    if (lowerText.includes(skill.toLowerCase())) {
      foundSkills.push({ name: skill, rating: 80 });
    }
  }

  return foundSkills.slice(0, 15);
}

function extractExperience(text: string): ParsedResumeData['experience'] {
  const experiences: NonNullable<ParsedResumeData['experience']> = [];

  const experienceSection = text.match(
    /(?:work\s*experience|professional\s*experience|employment\s*history|experience)[:\s]*\n([\s\S]*?)(?=\n(?:education|skills|projects|certifications|references)|$)/i
  );

  if (!experienceSection) return experiences;

  const sectionText = experienceSection[1];
  const datePattern =
    /(?:jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\.?\s*\d{4}\s*[-–—to]+\s*(?:jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\.?\s*\d{4}|(?:jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\.?\s*\d{4}\s*[-–—to]+\s*present|\d{4}\s*[-–—to]+\s*\d{4}|\d{4}\s*[-–—to]+\s*present/gi;

  const dateMatches = sectionText.match(datePattern);
  if (dateMatches) {
    for (const dateMatch of dateMatches.slice(0, 5)) {
      const idx = sectionText.indexOf(dateMatch);
      const beforeDate = sectionText.substring(Math.max(0, idx - 200), idx);
      const lines = beforeDate
        .split('\n')
        .filter((l) => l.trim())
        .slice(-3);

      let title = '';
      let company = '';

      for (const line of lines) {
        const trimmed = line.trim();
        if (trimmed.length > 5 && trimmed.length < 100) {
          if (!title) {
            title = trimmed;
          } else if (!company) {
            company = trimmed;
          }
        }
      }

      const dates = dateMatch.split(/[-–—]|to/i).map((d) => d.trim());
      const startDate = dates[0];
      const endDate = dates[1];
      const currentlyWorking = /present|current/i.test(endDate || '');

      if (title || company) {
        experiences.push({
          title: title || 'Position',
          companyName: company || 'Company',
          startDate,
          endDate: currentlyWorking ? '' : endDate,
          currentlyWorking,
          workSummary: '',
        });
      }
    }
  }

  return experiences;
}

function extractEducation(text: string): ParsedResumeData['education'] {
  const education: NonNullable<ParsedResumeData['education']> = [];

  const educationSection = text.match(
    /(?:education|academic\s*background|qualifications)[:\s]*\n([\s\S]*?)(?=\n(?:experience|skills|projects|certifications|work)|$)/i
  );

  if (!educationSection) return education;

  const sectionText = educationSection[1];

  const degreePatterns = [
    /(?:bachelor|master|phd|doctorate|associate|b\.?s\.?|m\.?s\.?|b\.?a\.?|m\.?a\.?|m\.?b\.?a\.?)[^,\n]*(?:of|in)?[^,\n]*/gi,
  ];

  for (const pattern of degreePatterns) {
    const matches = sectionText.match(pattern);
    if (matches) {
      for (const match of matches.slice(0, 3)) {
        const parts = match.split(/\s+(?:in|of)\s+/i);
        education.push({
          degree: parts[0]?.trim() || match.trim(),
          major: parts[1]?.trim() || '',
          school: '',
        });
      }
    }
  }

  const universityPattern =
    /(?:university|college|institute|school)\s+of\s+[^,\n]+|[A-Z][a-z]+\s+(?:university|college|institute)/gi;
  const universities = sectionText.match(universityPattern);

  if (universities) {
    universities.forEach((uni, idx) => {
      if (education[idx]) {
        education[idx].school = uni.trim();
      } else {
        education.push({ school: uni.trim() });
      }
    });
  }

  return education;
}

function extractSummary(text: string): string | undefined {
  const summaryPatterns = [
    /(?:summary|profile|objective|about\s*me)[:\s]*\n([\s\S]{50,500}?)(?=\n(?:experience|education|skills|work)|$)/i,
    /(?:professional\s*summary)[:\s]*\n([\s\S]{50,500}?)(?=\n(?:experience|education|skills|work)|$)/i,
  ];

  for (const pattern of summaryPatterns) {
    const match = text.match(pattern);
    if (match?.[1]) {
      return match[1].trim();
    }
  }

  return undefined;
}

export async function parseResume(file: File): Promise<ParsedResumeData> {
  let rawText: string;

  if (file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf')) {
    rawText = await extractTextFromPdf(file);
  } else if (
    file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
    file.name.toLowerCase().endsWith('.docx')
  ) {
    rawText = await extractTextFromDocx(file);
  } else {
    throw new Error('Unsupported file type. Please upload a PDF or DOCX file.');
  }

  const { firstName, lastName } = extractName(rawText);
  const email = extractEmail(rawText);
  const phone = extractPhone(rawText);
  const jobTitle = extractJobTitle(rawText);
  const summary = extractSummary(rawText);
  const skills = extractSkills(rawText);
  const experience = extractExperience(rawText);
  const education = extractEducation(rawText);

  return {
    firstName,
    lastName,
    email,
    phone,
    jobTitle,
    summary,
    skills,
    experience,
    education,
    rawText,
  };
}

export function convertParsedToResumeInfo(parsed: ParsedResumeData): Partial<ResumeInfo> {
  return {
    firstName: parsed.firstName || '',
    lastName: parsed.lastName || '',
    email: parsed.email || '',
    phone: parsed.phone || '',
    jobTitle: parsed.jobTitle || '',
    summary: parsed.summary || '',
    skills: parsed.skills?.map((s, idx) => ({
      id: idx + 1,
      name: s.name,
      rating: s.rating || 80,
    })),
    experience: parsed.experience?.map((exp, idx) => ({
      id: idx + 1,
      title: exp.title,
      companyName: exp.companyName,
      city: exp.city || '',
      state: exp.state || '',
      startDate: exp.startDate || '',
      endDate: exp.endDate || '',
      currentlyWorking: exp.currentlyWorking || false,
      workSummary: exp.workSummary || '',
    })),
    education: parsed.education?.map((edu, idx) => ({
      id: idx + 1,
      degree: edu.degree || '',
      major: edu.major || '',
      school: edu.school,
      city: edu.city || '',
      state: edu.state || '',
      startDate: edu.startDate || '',
      endDate: edu.endDate || '',
      description: edu.description || '',
    })),
  };
}
