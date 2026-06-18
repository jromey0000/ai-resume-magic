import { config } from '@/config';

const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';

interface AnalyzeResumeRequest {
  resumeData: ResumeInfo;
  jobDescription: string;
  jobTitle?: string;
  company?: string;
}

interface OpenAIMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

const createSystemPrompt =
  () => `You are an expert ATS (Applicant Tracking System) analyzer and resume optimization specialist. Your job is to:
1. Analyze job descriptions to extract key requirements, skills, and keywords
2. Compare resumes against job requirements
3. Provide a compatibility score (0-100)
4. Identify matching and missing keywords/skills
5. Provide actionable suggestions to improve the resume

Always respond in valid JSON format with the following structure:
{
  "score": number (0-100),
  "keywordsFound": string[],
  "keywordsMissing": string[],
  "skillsMatch": {
    "matched": string[],
    "missing": string[],
    "total": number
  },
  "suggestions": [
    {
      "id": string,
      "type": "keyword" | "skill" | "experience" | "format" | "summary",
      "priority": "high" | "medium" | "low",
      "title": string,
      "description": string,
      "currentText": string (optional),
      "suggestedText": string (optional)
    }
  ],
  "experienceRelevance": number (0-100),
  "formatScore": number (0-100)
}`;

const createUserPrompt = (request: AnalyzeResumeRequest): string => {
  const { resumeData, jobDescription, jobTitle, company } = request;

  return `Analyze this resume against the job description and provide ATS optimization suggestions.

JOB DETAILS:
${jobTitle ? `Title: ${jobTitle}` : ''}
${company ? `Company: ${company}` : ''}

JOB DESCRIPTION:
${jobDescription}

RESUME DATA:
Name: ${resumeData.firstName} ${resumeData.lastName}
Current Title: ${resumeData.jobTitle || 'Not specified'}
Email: ${resumeData.email || 'Not specified'}
Phone: ${resumeData.phone || 'Not specified'}
Location: ${resumeData.address || 'Not specified'}

SUMMARY:
${resumeData.summary || 'No summary provided'}

WORK EXPERIENCE:
${
  resumeData.experience?.length
    ? resumeData.experience
        .map(
          (exp) =>
            `- ${exp.title} at ${exp.companyName} (${exp.startDate} - ${exp.currentlyWorking ? 'Present' : exp.endDate})
  ${exp.city}, ${exp.state}
  ${exp.workSummary}`
        )
        .join('\n\n')
    : 'No work experience provided'
}

EDUCATION:
${
  resumeData.education?.length
    ? resumeData.education
        .map(
          (edu) =>
            `- ${edu.degree} in ${edu.major} from ${edu.school} (${edu.startDate} - ${edu.endDate})
  ${edu.city}, ${edu.state}
  ${edu.description || ''}`
        )
        .join('\n\n')
    : 'No education provided'
}

SKILLS:
${
  resumeData.skills?.length
    ? resumeData.skills.map((skill) => `- ${skill.name} (Proficiency: ${skill.rating}%)`).join('\n')
    : 'No skills provided'
}

Provide a comprehensive ATS analysis with score, keyword matches, and actionable suggestions.`;
};

export async function analyzeResumeWithAI(request: AnalyzeResumeRequest): Promise<ATSAnalysis> {
  const apiKey = config.OPENAI_API_KEY;

  if (!apiKey) {
    console.warn('OpenAI API key not configured, using mock analysis');
    return mockAnalyzeResume(request);
  }

  try {
    const messages: OpenAIMessage[] = [
      { role: 'system', content: createSystemPrompt() },
      { role: 'user', content: createUserPrompt(request) },
    ];

    const response = await fetch(OPENAI_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages,
        temperature: 0.3,
        max_tokens: 2000,
        response_format: { type: 'json_object' },
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('OpenAI API error:', error);
      throw new Error(error.error?.message || 'Failed to analyze resume');
    }

    const data = await response.json();
    const content = data.choices[0]?.message?.content;

    if (!content) {
      throw new Error('No response from OpenAI');
    }

    const analysis = JSON.parse(content) as ATSAnalysis;
    return analysis;
  } catch (error) {
    console.error('Error analyzing resume with AI:', error);
    return mockAnalyzeResume(request);
  }
}

function mockAnalyzeResume(request: AnalyzeResumeRequest): ATSAnalysis {
  const { resumeData, jobDescription } = request;

  const resumeText = `${resumeData.summary || ''} ${resumeData.jobTitle || ''} ${
    resumeData.experience?.map((e) => `${e.title} ${e.workSummary}`).join(' ') || ''
  } ${resumeData.skills?.map((s) => s.name).join(' ') || ''}`.toLowerCase();

  const jobDescLower = jobDescription.toLowerCase();

  const commonKeywords = [
    'react',
    'javascript',
    'typescript',
    'node',
    'python',
    'sql',
    'aws',
    'docker',
    'kubernetes',
    'agile',
    'scrum',
    'leadership',
    'communication',
    'team',
    'project',
    'management',
    'api',
    'rest',
    'graphql',
    'testing',
    'ci/cd',
    'git',
    'cloud',
    'database',
    'frontend',
    'backend',
    'fullstack',
    'design',
    'ux',
    'ui',
    'java',
    'c++',
    'go',
    'rust',
    'machine learning',
    'data',
    'analytics',
    'devops',
  ];

  const jobKeywords = commonKeywords.filter((kw) => jobDescLower.includes(kw));
  const foundKeywords = jobKeywords.filter((kw) => resumeText.includes(kw));
  const missingKeywords = jobKeywords.filter((kw) => !resumeText.includes(kw));

  const userSkills = resumeData.skills?.map((s) => s.name.toLowerCase()) || [];
  const matchedSkills = userSkills.filter(
    (skill) => jobDescLower.includes(skill) || jobKeywords.some((kw) => skill.includes(kw))
  );
  const requiredSkills = jobKeywords.slice(0, 10);
  const missingSkills = requiredSkills.filter(
    (skill) => !userSkills.some((us) => us.includes(skill) || skill.includes(us))
  );

  const keywordScore =
    jobKeywords.length > 0 ? (foundKeywords.length / jobKeywords.length) * 40 : 20;
  const skillScore =
    requiredSkills.length > 0 ? (matchedSkills.length / requiredSkills.length) * 25 : 12.5;
  const experienceScore = resumeData.experience?.length ? 20 : 5;
  const formatScore = resumeData.summary && resumeData.skills?.length ? 15 : 8;

  const totalScore = Math.round(
    Math.min(keywordScore + skillScore + experienceScore + formatScore, 100)
  );

  const suggestions: ATSSuggestion[] = [];

  if (missingKeywords.length > 0) {
    suggestions.push({
      id: 'keywords-1',
      type: 'keyword',
      priority: 'high',
      title: `Add missing keywords: ${missingKeywords.slice(0, 3).join(', ')}`,
      description: `The job description mentions these keywords that aren't in your resume. Consider incorporating them naturally.`,
      suggestedText: `Consider adding: ${missingKeywords.join(', ')}`,
    });
  }

  if (missingSkills.length > 0) {
    suggestions.push({
      id: 'skills-1',
      type: 'skill',
      priority: 'high',
      title: `Add required skills: ${missingSkills.slice(0, 3).join(', ')}`,
      description: `These skills appear in the job description but aren't in your skills section.`,
      suggestedText: missingSkills.slice(0, 5).join(', '),
    });
  }

  if (!resumeData.summary || resumeData.summary.length < 100) {
    suggestions.push({
      id: 'summary-1',
      type: 'summary',
      priority: 'medium',
      title: 'Enhance your professional summary',
      description:
        'A strong summary that mirrors the job requirements can significantly improve your ATS score.',
      currentText: resumeData.summary || 'No summary provided',
      suggestedText: `Results-driven professional with expertise in ${foundKeywords.slice(0, 3).join(', ') || 'your field'}. Proven track record of delivering high-quality solutions and driving business outcomes.`,
    });
  }

  if (!resumeData.experience || resumeData.experience.length === 0) {
    suggestions.push({
      id: 'experience-1',
      type: 'experience',
      priority: 'high',
      title: 'Add work experience',
      description:
        'ATS systems heavily weight work experience. Add your relevant positions with detailed descriptions.',
    });
  }

  return {
    score: totalScore,
    keywordsFound: foundKeywords,
    keywordsMissing: missingKeywords,
    skillsMatch: {
      matched: matchedSkills,
      missing: missingSkills,
      total: requiredSkills.length,
    },
    suggestions,
    experienceRelevance: (experienceScore / 20) * 100,
    formatScore: (formatScore / 15) * 100,
  };
}

export async function generateOptimizedSummary(
  resumeData: ResumeInfo,
  jobDescription: string,
  jobTitle?: string
): Promise<string> {
  const apiKey = config.OPENAI_API_KEY;

  if (!apiKey) {
    const skills =
      resumeData.skills
        ?.slice(0, 3)
        .map((s) => s.name)
        .join(', ') || 'various technologies';
    return `Results-driven ${resumeData.jobTitle || 'professional'} with expertise in ${skills}. Proven track record of delivering high-quality solutions and driving business outcomes. Seeking to leverage skills to contribute to organizational success.`;
  }

  try {
    const response = await fetch(OPENAI_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content:
              'You are a professional resume writer. Generate a compelling, ATS-optimized professional summary that incorporates relevant keywords from the job description. Keep it concise (2-3 sentences, max 150 words).',
          },
          {
            role: 'user',
            content: `Write an ATS-optimized professional summary for this candidate:
            
Current Title: ${resumeData.jobTitle || 'Professional'}
Target Role: ${jobTitle || 'Not specified'}
Skills: ${resumeData.skills?.map((s) => s.name).join(', ') || 'Not specified'}
Experience: ${resumeData.experience?.map((e) => e.title).join(', ') || 'Not specified'}

Job Description Keywords to Include:
${jobDescription.slice(0, 500)}

Generate a professional summary that naturally incorporates relevant keywords.`,
          },
        ],
        temperature: 0.7,
        max_tokens: 200,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to generate summary');
    }

    const data = await response.json();
    return data.choices[0]?.message?.content || '';
  } catch (error) {
    console.error('Error generating summary:', error);
    const skills =
      resumeData.skills
        ?.slice(0, 3)
        .map((s) => s.name)
        .join(', ') || 'various technologies';
    return `Results-driven ${resumeData.jobTitle || 'professional'} with expertise in ${skills}. Proven track record of delivering high-quality solutions and driving business outcomes.`;
  }
}
