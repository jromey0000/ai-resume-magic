import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  ArrowLeft,
  ArrowUp,
  Building2,
  CheckCircle2,
  CreditCard,
  FileText,
  Globe,
  Lock,
  Mail,
  RefreshCcw,
  Scale,
  Shield,
  ShieldCheck,
  WandSparkles,
} from 'lucide-react';
import { Badge } from './ui/badge';
import { Card, CardContent } from './ui/card';
import { Separator } from './ui/separator';

const LAST_UPDATED = 'June 22, 2026';

interface SectionProps {
  id: string;
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}

function Section({ id, icon, title, children }: SectionProps) {
  return (
    <section id={id} className="scroll-mt-24">
      <div className="flex items-center gap-4 mb-8">
        <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-fuchsia-pink-500 to-primary flex items-center justify-center shadow-lg shadow-fuchsia-pink-500/20">
          {icon}
        </div>
        <div>
          <h2 className="text-2xl md:text-3xl font-bold">{title}</h2>
          <p className="text-sm text-muted-foreground">Last updated: {LAST_UPDATED}</p>
        </div>
      </div>
      <div className="space-y-8">{children}</div>
    </section>
  );
}

interface ArticleProps {
  number: string;
  title: string;
  children: React.ReactNode;
}

function Article({ number, title, children }: ArticleProps) {
  return (
    <article className="relative pl-8 md:pl-12">
      <div className="absolute left-0 top-0 w-6 h-6 md:w-8 md:h-8 rounded-full bg-muted flex items-center justify-center text-xs md:text-sm font-bold text-muted-foreground">
        {number}
      </div>
      <h3 className="text-lg md:text-xl font-semibold mb-3">{title}</h3>
      <div className="text-muted-foreground leading-relaxed space-y-4">{children}</div>
    </article>
  );
}

interface CalloutProps {
  type: 'info' | 'warning' | 'success';
  title?: string;
  children: React.ReactNode;
}

function Callout({ type, title, children }: CalloutProps) {
  const styles = {
    info: 'bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800',
    warning: 'bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800',
    success: 'bg-teal-50 dark:bg-teal-950/30 border-teal-200 dark:border-teal-800',
  };
  const icons = {
    info: <Shield className="w-5 h-5 text-blue-600 dark:text-blue-400" />,
    warning: <Scale className="w-5 h-5 text-amber-600 dark:text-amber-400" />,
    success: <CheckCircle2 className="w-5 h-5 text-teal-600 dark:text-teal-400" />,
  };

  return (
    <div className={`rounded-xl border p-4 md:p-6 ${styles[type]}`}>
      <div className="flex gap-3">
        <div className="flex-shrink-0 mt-0.5">{icons[type]}</div>
        <div>
          {title && <p className="font-semibold mb-1">{title}</p>}
          <div className="text-sm">{children}</div>
        </div>
      </div>
    </div>
  );
}

function LegalPage() {
  const location = useLocation();
  const [showBackToTop, setShowBackToTop] = useState(false);

  useEffect(() => {
    if (location.hash) {
      const element = document.getElementById(location.hash.slice(1));
      if (element) {
        setTimeout(() => element.scrollIntoView({ behavior: 'smooth' }), 100);
      }
    }
  }, [location.hash]);

  useEffect(() => {
    const handleScroll = () => setShowBackToTop(window.scrollY > 500);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-lg">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 group">
            <WandSparkles className="w-6 h-6 text-fuchsia-pink-600 dark:text-fuchsia-pink-400 transition-transform group-hover:rotate-12" />
            <span className="font-bold text-xl">AI Resume Magic</span>
          </Link>
          <Link
            to="/"
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Back to Home</span>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <div className="relative overflow-hidden border-b border-border">
        <div className="absolute inset-0 bg-gradient-to-br from-fuchsia-pink-500/5 via-transparent to-primary/5" />
        <div className="container mx-auto px-4 py-16 md:py-24 relative">
          <div className="max-w-3xl">
            <Badge variant="outline" className="mb-4 border-fuchsia-pink-300 dark:border-fuchsia-pink-700">
              <Scale className="w-3 h-3 mr-1" />
              Legal Documentation
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Legal &{' '}
              <span className="bg-gradient-to-r from-fuchsia-pink-600 to-primary bg-clip-text text-transparent">
                Privacy
              </span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
              Transparency is important to us. These documents outline how we operate,
              protect your data, and ensure a fair relationship with our users.
            </p>
          </div>
        </div>
      </div>

      <main className="container mx-auto px-4 py-12 md:py-16">
        <div className="grid lg:grid-cols-[280px_1fr] gap-8 lg:gap-12">
          {/* Sidebar Navigation */}
          <aside className="lg:sticky lg:top-24 lg:h-fit">
            <Card className="overflow-hidden">
              <CardContent className="p-0">
                <div className="p-4 bg-muted/50 border-b border-border">
                  <p className="text-sm font-medium text-muted-foreground">On this page</p>
                </div>
                <nav className="p-2">
                  <a
                    href="#terms"
                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm hover:bg-muted transition-colors"
                  >
                    <FileText className="w-4 h-4 text-fuchsia-pink-600 dark:text-fuchsia-pink-400" />
                    Terms of Service
                  </a>
                  <a
                    href="#privacy"
                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm hover:bg-muted transition-colors"
                  >
                    <Lock className="w-4 h-4 text-fuchsia-pink-600 dark:text-fuchsia-pink-400" />
                    Privacy Policy
                  </a>
                  <a
                    href="#refunds"
                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm hover:bg-muted transition-colors"
                  >
                    <RefreshCcw className="w-4 h-4 text-fuchsia-pink-600 dark:text-fuchsia-pink-400" />
                    Refund Policy
                  </a>
                </nav>
                <Separator />
                <div className="p-4 space-y-3">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Building2 className="w-4 h-4" />
                    <span>Louis Interactive LLC</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Globe className="w-4 h-4" />
                    <span>Louisiana, USA</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Mail className="w-4 h-4 text-muted-foreground" />
                    <a
                      href="mailto:legal@airesumemagic.com"
                      className="text-fuchsia-pink-600 dark:text-fuchsia-pink-400 hover:underline"
                    >
                      legal@airesumemagic.com
                    </a>
                  </div>
                </div>
              </CardContent>
            </Card>
          </aside>

          {/* Main Content */}
          <div className="max-w-3xl space-y-20">
            {/* Terms of Service */}
            <Section id="terms" icon={<FileText className="w-6 h-6 text-white" />} title="Terms of Service">
              <Callout type="info" title="Agreement">
                By accessing AI Resume Magic, you agree to these terms. Please read them carefully.
              </Callout>

              <Article number="1" title="Acceptance of Terms">
                <p>
                  By accessing or using AI Resume Magic ("Service"), operated by Louis Interactive LLC
                  ("Company", "we", "us"), you agree to be bound by these Terms of Service. If you do
                  not agree to these terms, please do not use our Service.
                </p>
              </Article>

              <Article number="2" title="Description of Service">
                <p>
                  AI Resume Magic provides AI-powered resume building and optimization tools designed
                  to help job seekers create ATS-friendly resumes. Our Service includes:
                </p>
                <ul className="list-disc list-inside space-y-1 mt-3">
                  <li>Resume creation and editing tools</li>
                  <li>AI-powered content suggestions and optimizations</li>
                  <li>ATS compatibility scoring</li>
                  <li>Job description matching</li>
                  <li>Export functionality (PDF, DOCX, TXT)</li>
                </ul>
              </Article>

              <Article number="3" title="User Accounts">
                <p>
                  To access certain features, you must create an account using our authentication system.
                  You are responsible for maintaining the confidentiality of your account credentials
                  and for all activities that occur under your account.
                </p>
              </Article>

              <Article number="4" title="Payment">
                <p>
                  Our paid plans are one-time purchases that grant lifetime access to the Service.
                  Payments are processed securely through Stripe.
                </p>
                <div className="grid sm:grid-cols-2 gap-3 mt-4">
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                    <CreditCard className="w-5 h-5 text-fuchsia-pink-600" />
                    <div>
                      <p className="font-medium">Pro Plan</p>
                      <p className="text-sm">$79 one-time</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                    <CreditCard className="w-5 h-5 text-fuchsia-pink-600" />
                    <div>
                      <p className="font-medium">Enterprise Plan</p>
                      <p className="text-sm">$249 one-time</p>
                    </div>
                  </div>
                </div>
              </Article>

              <Article number="5" title="AI Usage Limits">
                <p>Each plan includes a specific number of AI optimizations per month:</p>
                <div className="grid grid-cols-3 gap-2 mt-4">
                  <div className="text-center p-3 rounded-lg bg-muted/50">
                    <p className="text-2xl font-bold">3</p>
                    <p className="text-xs text-muted-foreground">Free</p>
                  </div>
                  <div className="text-center p-3 rounded-lg bg-muted/50">
                    <p className="text-2xl font-bold">30</p>
                    <p className="text-xs text-muted-foreground">Pro</p>
                  </div>
                  <div className="text-center p-3 rounded-lg bg-muted/50">
                    <p className="text-2xl font-bold">100</p>
                    <p className="text-xs text-muted-foreground">Enterprise</p>
                  </div>
                </div>
                <p className="text-sm mt-3">
                  Unused optimizations do not roll over. Limits reset monthly.
                </p>
              </Article>

              <Article number="6" title="Acceptable Use">
                <p>You agree not to:</p>
                <ul className="list-disc list-inside space-y-1 mt-3">
                  <li>Use the Service for any unlawful purpose</li>
                  <li>Submit false or misleading information</li>
                  <li>Attempt to gain unauthorized access to our systems</li>
                  <li>Use automated tools to access the Service (except authorized APIs)</li>
                  <li>Resell or redistribute the Service without authorization</li>
                </ul>
              </Article>

              <Article number="7" title="Intellectual Property">
                <p>
                  You retain ownership of all content you create using our Service. We retain ownership
                  of the Service, including all software, templates, and AI models. By using our Service,
                  you grant us a limited license to process your content for the purpose of providing
                  the Service.
                </p>
              </Article>

              <Article number="8" title="Disclaimer">
                <Callout type="warning">
                  The Service is provided "as is" without warranties of any kind. We do not guarantee
                  that your resume will result in job interviews or employment. AI suggestions are
                  recommendations only; you are responsible for the accuracy of your resume content.
                </Callout>
              </Article>

              <Article number="9" title="Limitation of Liability">
                <p>
                  To the maximum extent permitted by law, Louis Interactive LLC shall not be liable
                  for any indirect, incidental, special, consequential, or punitive damages resulting
                  from your use of the Service.
                </p>
              </Article>

              <Article number="10" title="Changes to Terms">
                <p>
                  We reserve the right to modify these terms at any time. We will notify users of
                  significant changes via email or through the Service. Continued use after changes
                  constitutes acceptance of the new terms.
                </p>
              </Article>

              <Article number="11" title="Governing Law">
                <p>
                  These Terms shall be governed by and construed in accordance with the laws of the
                  State of Louisiana, without regard to its conflict of law provisions.
                </p>
              </Article>

              <Article number="12" title="Contact">
                <p>
                  For questions about these Terms, please contact Louis Interactive LLC at{' '}
                  <a href="mailto:legal@airesumemagic.com" className="text-fuchsia-pink-600 dark:text-fuchsia-pink-400 hover:underline">
                    legal@airesumemagic.com
                  </a>
                </p>
              </Article>
            </Section>

            <Separator className="my-16" />

            {/* Privacy Policy */}
            <Section id="privacy" icon={<Lock className="w-6 h-6 text-white" />} title="Privacy Policy">
              <Callout type="success" title="Your Privacy Matters">
                We collect only what's necessary and never sell your personal data.
              </Callout>

              <Article number="1" title="Information We Collect">
                <div className="space-y-4">
                  <div>
                    <p className="font-medium text-foreground mb-2">Account Information</p>
                    <ul className="list-disc list-inside space-y-1">
                      <li>Email address (via authentication)</li>
                      <li>Name (if provided)</li>
                      <li>Profile picture (if provided via OAuth)</li>
                    </ul>
                  </div>
                  <div>
                    <p className="font-medium text-foreground mb-2">Resume Data</p>
                    <ul className="list-disc list-inside space-y-1">
                      <li>Personal details you enter (name, contact info, etc.)</li>
                      <li>Work experience and education history</li>
                      <li>Skills and achievements</li>
                      <li>Uploaded resume files for parsing</li>
                    </ul>
                  </div>
                  <div>
                    <p className="font-medium text-foreground mb-2">Usage Data</p>
                    <ul className="list-disc list-inside space-y-1">
                      <li>Feature usage and interactions</li>
                      <li>AI optimization requests</li>
                      <li>Export history</li>
                    </ul>
                  </div>
                </div>
              </Article>

              <Article number="2" title="How We Use Your Information">
                <ul className="list-disc list-inside space-y-1">
                  <li>To provide and improve our Service</li>
                  <li>To process AI optimization requests</li>
                  <li>To communicate with you about your account</li>
                  <li>To process payments</li>
                  <li>To analyze usage patterns and improve features</li>
                </ul>
              </Article>

              <Article number="3" title="Third-Party Services">
                <p className="mb-4">We use the following trusted third-party services:</p>
                <div className="grid sm:grid-cols-2 gap-3">
                  {[
                    { name: 'Clerk', desc: 'Authentication' },
                    { name: 'Stripe', desc: 'Payments' },
                    { name: 'OpenAI', desc: 'AI Processing' },
                    { name: 'Hostinger', desc: 'Hosting' },
                  ].map((service) => (
                    <div key={service.name} className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                      <ShieldCheck className="w-5 h-5 text-teal-600" />
                      <div>
                        <p className="font-medium text-sm">{service.name}</p>
                        <p className="text-xs text-muted-foreground">{service.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </Article>

              <Article number="4" title="Data Retention">
                <p>
                  We retain your data for as long as your account is active. You can request deletion
                  of your account and associated data at any time. After account deletion, we may retain
                  anonymized usage data for analytics purposes.
                </p>
              </Article>

              <Article number="5" title="Data Security">
                <p className="mb-3">We implement industry-standard security measures including:</p>
                <div className="grid sm:grid-cols-2 gap-2">
                  {['HTTPS encryption', 'Secure authentication', 'Regular security audits', 'Access controls'].map((item) => (
                    <div key={item} className="flex items-center gap-2 text-sm">
                      <CheckCircle2 className="w-4 h-4 text-teal-600" />
                      {item}
                    </div>
                  ))}
                </div>
              </Article>

              <Article number="6" title="Your Rights">
                <p>You have the right to:</p>
                <ul className="list-disc list-inside space-y-1 mt-3">
                  <li>Access your personal data</li>
                  <li>Correct inaccurate data</li>
                  <li>Request deletion of your data</li>
                  <li>Export your resume data</li>
                  <li>Opt out of marketing communications</li>
                </ul>
              </Article>

              <Article number="7" title="Cookies">
                <p>
                  We use essential cookies for authentication and session management. We do not use
                  third-party tracking cookies for advertising purposes.
                </p>
              </Article>

              <Article number="8" title="Children's Privacy">
                <p>
                  Our Service is not intended for users under 16 years of age. We do not knowingly
                  collect data from children.
                </p>
              </Article>

              <Article number="9" title="Changes & Contact">
                <p>
                  We will notify you of significant changes to this policy via email. For privacy inquiries,
                  contact us at{' '}
                  <a href="mailto:privacy@airesumemagic.com" className="text-fuchsia-pink-600 dark:text-fuchsia-pink-400 hover:underline">
                    privacy@airesumemagic.com
                  </a>
                </p>
              </Article>
            </Section>

            <Separator className="my-16" />

            {/* Refund Policy */}
            <Section id="refunds" icon={<RefreshCcw className="w-6 h-6 text-white" />} title="Refund Policy">
              <Callout type="success" title="14-Day Money-Back Guarantee">
                Not satisfied? Get a full refund within 14 days — no questions asked.
              </Callout>

              <Article number="1" title="Money-Back Guarantee">
                <p>
                  We want you to be satisfied with AI Resume Magic. All paid plans come with a
                  14-day money-back guarantee. If you're not happy with your purchase, we'll refund
                  you — no questions asked.
                </p>
              </Article>

              <Article number="2" title="Eligible Purchases">
                <p className="mb-4">Refunds are available for:</p>
                <div className="grid sm:grid-cols-2 gap-3">
                  <div className="p-4 rounded-lg border border-border bg-card">
                    <p className="font-semibold">Pro Plan</p>
                    <p className="text-2xl font-bold text-fuchsia-pink-600">$79</p>
                    <p className="text-sm text-muted-foreground">one-time purchase</p>
                  </div>
                  <div className="p-4 rounded-lg border border-border bg-card">
                    <p className="font-semibold">Enterprise Plan</p>
                    <p className="text-2xl font-bold text-fuchsia-pink-600">$249</p>
                    <p className="text-sm text-muted-foreground">one-time purchase</p>
                  </div>
                </div>
              </Article>

              <Article number="3" title="How to Request a Refund">
                <div className="space-y-3">
                  <div className="flex gap-3 items-start">
                    <div className="w-6 h-6 rounded-full bg-fuchsia-pink-100 dark:bg-fuchsia-pink-900/30 flex items-center justify-center text-xs font-bold text-fuchsia-pink-600">1</div>
                    <p>Email <a href="mailto:refunds@airesumemagic.com" className="text-fuchsia-pink-600 hover:underline">refunds@airesumemagic.com</a></p>
                  </div>
                  <div className="flex gap-3 items-start">
                    <div className="w-6 h-6 rounded-full bg-fuchsia-pink-100 dark:bg-fuchsia-pink-900/30 flex items-center justify-center text-xs font-bold text-fuchsia-pink-600">2</div>
                    <p>Include "Refund Request" in the subject line</p>
                  </div>
                  <div className="flex gap-3 items-start">
                    <div className="w-6 h-6 rounded-full bg-fuchsia-pink-100 dark:bg-fuchsia-pink-900/30 flex items-center justify-center text-xs font-bold text-fuchsia-pink-600">3</div>
                    <p>Receive your refund within 5-7 business days</p>
                  </div>
                </div>
              </Article>

              <Article number="4" title="After Refund">
                <p>Upon refund approval:</p>
                <ul className="list-disc list-inside space-y-1 mt-3">
                  <li>Your account will revert to the Free plan</li>
                  <li>You will lose access to paid features immediately</li>
                  <li>Your resume data will be preserved</li>
                  <li>You may repurchase at any time</li>
                </ul>
              </Article>

              <Article number="5" title="Exceptions">
                <Callout type="warning">
                  <p>Refunds may be denied if:</p>
                  <ul className="list-disc list-inside mt-2 space-y-1">
                    <li>The request is made after the 14-day window</li>
                    <li>You have violated our Terms of Service</li>
                    <li>There is evidence of abuse or fraudulent activity</li>
                    <li>You have previously received a refund for the same product</li>
                  </ul>
                </Callout>
              </Article>

              <Article number="6" title="Contact">
                <p>
                  For refund inquiries, contact Louis Interactive LLC at{' '}
                  <a href="mailto:refunds@airesumemagic.com" className="text-fuchsia-pink-600 dark:text-fuchsia-pink-400 hover:underline">
                    refunds@airesumemagic.com
                  </a>
                </p>
              </Article>
            </Section>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-muted/30 py-12 mt-16">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-2">
              <WandSparkles className="w-5 h-5 text-fuchsia-pink-600 dark:text-fuchsia-pink-400" />
              <span className="font-bold">AI Resume Magic</span>
            </div>
            <p className="text-muted-foreground text-sm text-center">
              © 2026 Louis Interactive LLC. All rights reserved.
            </p>
            <Link to="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Back to Home
            </Link>
          </div>
        </div>
      </footer>

      {/* Back to Top Button */}
      {showBackToTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 p-3 rounded-full bg-fuchsia-pink-600 text-white shadow-lg hover:bg-fuchsia-pink-700 transition-all hover:scale-110 z-50"
          aria-label="Back to top"
        >
          <ArrowUp className="w-5 h-5" />
        </button>
      )}
    </div>
  );
}

export default LegalPage;
