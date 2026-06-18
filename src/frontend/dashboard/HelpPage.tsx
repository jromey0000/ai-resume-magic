import { HelpCircle, Mail, MessageCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const faqs = [
  {
    q: 'How does ATS scoring work?',
    a: 'Paste a job description in the ATS Optimization step. We analyze keyword and skill overlap and give you a match score with actionable suggestions.',
  },
  {
    q: 'Can I build a resume without signing in?',
    a: "Yes. Start from the homepage and build freely. Sign in when you're ready to save and export your PDF.",
  },
  {
    q: 'What file formats can I export?',
    a: 'PDF export is available today. Additional formats are on the roadmap for Pro users.',
  },
  {
    q: 'How do I tailor my resume to a job?',
    a: 'Choose "Start with a Job Posting" when creating a resume, or paste a job URL/description in the ATS section of the editor.',
  },
];

export default function HelpPage() {
  return (
    <div className="p-8 max-w-3xl mx-auto">
      <h1 className="text-3xl font-light mb-2">Help & Support</h1>
      <p className="text-muted-foreground mb-8">Quick answers to common questions.</p>

      <div className="space-y-4 mb-8">
        {faqs.map((faq) => (
          <Card key={faq.q}>
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-start gap-2">
                <HelpCircle className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                {faq.q}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">{faq.a}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardContent className="pt-6 flex flex-col sm:flex-row gap-4">
          <a
            href="mailto:support@ai-resume-magic.com"
            className="flex items-center gap-2 text-sm text-primary hover:underline"
          >
            <Mail className="w-4 h-4" /> support@ai-resume-magic.com
          </a>
          <Link
            to="/dashboard/new"
            className="flex items-center gap-2 text-sm text-primary hover:underline"
          >
            <MessageCircle className="w-4 h-4" /> Start a new resume
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
