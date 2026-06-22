import {
  ArrowRight,
  Building2,
  Check,
  CheckCircle2,
  Crown,
  Download,
  FileCheck,
  FileText,
  Shield,
  Sparkles,
  Star,
  Target,
  TrendingUp,
  Upload,
  WandSparkles,
  X,
  Zap,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import Header from '@/components/custom/Header';
import Button from './ui/Button';
import { Badge } from './ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Separator } from './ui/separator';

const stats = [
  { value: 'ATS', label: 'Optimized Format' },
  { value: 'AI', label: 'Smart Suggestions' },
  { value: 'Free', label: 'To Get Started' },
  { value: '< 5 min', label: 'Average Build Time' },
];

const features = [
  {
    icon: Target,
    title: 'ATS-Friendly Formatting',
    description:
      'Clean, parseable layouts designed to pass major ATS systems like Workday, Taleo, and Greenhouse.',
  },
  {
    icon: Zap,
    title: 'AI-Powered Suggestions',
    description:
      'Get real-time feedback on keywords, formatting, and content that recruiters and ATS algorithms are looking for.',
  },
  {
    icon: FileCheck,
    title: 'Instant ATS Score',
    description:
      'See exactly how your resume performs against ATS requirements with our proprietary scoring algorithm.',
  },
  {
    icon: TrendingUp,
    title: 'Job-Specific Optimization',
    description:
      'Paste any job description and watch our AI tailor your resume to match the exact requirements.',
  },
];

const testimonials = [
  {
    name: 'Sarah M.',
    role: 'Software Engineer',
    company: 'Now at Google',
    quote:
      'After months of rejections, I used AI Resume Magic and landed 5 interviews in 2 weeks. The ATS optimization made all the difference.',
    rating: 5,
  },
  {
    name: 'James K.',
    role: 'Marketing Manager',
    company: 'Now at HubSpot',
    quote:
      'I had no idea my resume was getting filtered out by ATS systems. This tool showed me exactly what to fix.',
    rating: 5,
  },
  {
    name: 'Emily R.',
    role: 'Product Designer',
    company: 'Now at Stripe',
    quote:
      'The job-matching feature is incredible. My resume now speaks directly to what hiring managers want to see.',
    rating: 5,
  },
];

const trustLogos = ['Workday', 'Taleo', 'Greenhouse', 'Lever', 'iCIMS', 'BambooHR'];

const howItWorksSteps = [
  {
    step: '01',
    icon: Upload,
    title: 'Upload or Start Fresh',
    description:
      'Import your existing resume or start from a blank canvas. Our AI instantly parses and organizes your experience.',
    features: ['PDF/DOCX import', 'Smart data extraction', 'No account required to start'],
    preview: {
      type: 'upload',
      elements: ['Drop your resume here', 'or connect LinkedIn', 'Parsing experience...'],
    },
  },
  {
    step: '02',
    icon: Target,
    title: 'Match to Your Dream Job',
    description:
      "Paste any job description and our AI analyzes it instantly. See exactly which keywords you're missing and get suggestions to close the gap.",
    features: ['Keyword analysis', 'Skills matching', 'Gap identification'],
    preview: {
      type: 'analysis',
      score: 94,
      matches: ['React', 'TypeScript', 'Node.js'],
      missing: ['AWS', 'Docker'],
    },
  },
  {
    step: '03',
    icon: FileText,
    title: 'AI Optimizes Your Content',
    description:
      'Watch as our AI rewrites bullet points to include relevant keywords, quantifies achievements, and structures content for maximum ATS compatibility.',
    features: ['Bullet point enhancement', 'Achievement quantification', 'ATS formatting'],
    preview: {
      type: 'rewrite',
      before: 'Worked on web projects',
      after: 'Delivered 12+ React applications serving 50K+ users, reducing load time by 40%',
    },
  },
  {
    step: '04',
    icon: Download,
    title: 'Export & Apply Confidently',
    description:
      'Download your polished resume as a PDF. Track your ATS score and apply with confidence.',
    features: ['PDF export', 'ATS score tracking', 'Sign in to save'],
    preview: {
      type: 'export',
      formats: ['PDF'],
      score: 97,
    },
  },
];

const pricingTiers = [
  {
    name: 'Free',
    price: '$0',
    period: 'forever',
    description: 'Perfect for getting started with your job search',
    icon: Sparkles,
    featured: false,
    cta: 'Start Free',
    features: [
      { text: '1 resume', included: true },
      { text: '3 AI optimizations/month', included: true },
      { text: 'Basic ATS score', included: true },
      { text: 'ATS-friendly layout', included: true },
      { text: 'PDF export', included: true },
      { text: 'Job matching', included: true },
      { text: 'Multiple templates', included: false },
      { text: 'Priority support', included: false },
    ],
  },
  {
    name: 'Pro',
    price: '$12',
    period: '/month',
    description: 'For serious job seekers who want every advantage',
    icon: Crown,
    featured: true,
    cta: 'Go Pro',
    features: [
      { text: 'Unlimited resumes', included: true },
      { text: 'Unlimited AI optimizations', included: true },
      { text: 'Advanced ATS scoring', included: true },
      { text: 'Multiple templates', included: true },
      { text: 'PDF export', included: true },
      { text: 'Job description matching', included: true },
      { text: 'Resume duplication', included: true },
      { text: 'Priority email support', included: false },
    ],
  },
  {
    name: 'Enterprise',
    price: '$29',
    period: '/month',
    description: 'For career coaches, recruiters & teams',
    icon: Building2,
    featured: false,
    cta: 'Contact Sales',
    features: [
      { text: 'Everything in Pro', included: true },
      { text: 'Team management (5 seats)', included: true },
      { text: 'White-label exports', included: true },
      { text: 'Custom branding', included: true },
      { text: 'API access', included: true },
      { text: 'Bulk resume processing', included: true },
      { text: 'Analytics dashboard', included: true },
      { text: 'Dedicated account manager', included: true },
    ],
  },
];

function Home() {
  return (
    <div className="min-h-screen bg-cod-gray-50 dark:bg-cod-gray-950 text-cod-gray-900 dark:text-white transition-colors">
      <Header />

      <div className="bg-gradient-to-b from-cod-gray-100/50 via-transparent to-transparent dark:from-fuchsia-pink-950/10 dark:via-transparent dark:to-transparent">
        {/* Hero Section */}
        <section className="container mx-auto px-4 pt-16 pb-20">
          <div className="max-w-5xl mx-auto text-center">
            <Badge
              variant="outline"
              className="px-4 py-2 mb-8 border-fuchsia-pink-300 dark:border-fuchsia-pink-700/30 bg-fuchsia-pink-100 dark:bg-fuchsia-pink-950/50"
            >
              <Shield className="w-4 h-4 mr-2 text-fuchsia-pink-600 dark:text-fuchsia-pink-400" />
              <span className="text-fuchsia-pink-700 dark:text-fuchsia-pink-200">
                Trusted by job seekers building ATS-ready resumes
              </span>
            </Badge>

            <h1 className="text-5xl md:text-7xl font-extrabold mb-6 leading-tight">
              Stop Getting{' '}
              <span className="relative">
                <span className="text-coral-rose-400 line-through opacity-60">Rejected</span>
              </span>
              <br />
              <span className="bg-gradient-to-r from-secondary via-fuchsia-pink-300 to-primary text-transparent bg-clip-text">
                Start Getting Interviews
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-cod-gray-600 dark:text-cod-gray-300 mb-4 max-w-3xl mx-auto leading-relaxed">
              <strong className="text-cod-gray-900 dark:text-white">
                75% of resumes are rejected by ATS systems
              </strong>{' '}
              before a human ever sees them. Our AI ensures yours isn't one of them.
            </p>

            <p className="text-lg text-cod-gray-500 dark:text-cod-gray-400 mb-10 max-w-2xl mx-auto">
              Build an ATS-optimized resume in minutes with AI-powered suggestions, real-time
              scoring, and job-specific customization.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <Link to="/dashboard/new">
                <Button
                  variant="primary"
                  size="lg"
                  className="group text-lg px-8 py-4 shadow-lg shadow-primary/25"
                >
                  Build Your Resume Free
                  <ArrowRight className="inline-block ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
              <a href="#how-it-works">
                <Button variant="ghost" size="lg" className="text-lg px-8 py-4">
                  See How It Works
                </Button>
              </a>
            </div>

            <div className="flex flex-wrap justify-center gap-8 md:gap-12">
              {stats.map((stat) => (
                <div key={stat.label} className="text-center">
                  <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-secondary to-fuchsia-pink-400 text-transparent bg-clip-text">
                    {stat.value}
                  </div>
                  <div className="text-sm text-muted-foreground mt-1">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ATS Compatibility Bar */}
        <section className="border-y border-border bg-card/50 py-8">
          <div className="container mx-auto px-4">
            <p className="text-center text-muted-foreground text-sm mb-6">
              Optimized for all major Applicant Tracking Systems
            </p>
            <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12">
              {trustLogos.map((logo) => (
                <span
                  key={logo}
                  className="text-muted-foreground font-semibold text-lg hover:text-foreground transition-colors"
                >
                  {logo}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* Problem/Solution Section */}
        <section className="container mx-auto px-4 py-20">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <Card className="bg-gradient-to-br from-coral-rose-100 to-white dark:from-coral-rose-950/30 dark:to-card border-coral-rose-200 dark:border-coral-rose-900/30">
                <CardHeader>
                  <Badge
                    variant="outline"
                    className="w-fit mb-2 border-coral-rose-300 text-coral-rose-600 dark:text-coral-rose-400"
                  >
                    The Problem
                  </Badge>
                  <CardTitle className="text-2xl md:text-3xl">
                    Your Resume Never Reaches Human Eyes
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-4">
                    {[
                      'ATS systems scan for specific keywords and formatting',
                      'Beautiful designs often fail machine parsing',
                      'Missing keywords = automatic rejection',
                      "You never know why you didn't hear back",
                    ].map((item) => (
                      <li key={item} className="flex items-start gap-3 text-muted-foreground">
                        <span className="text-coral-rose-500 dark:text-coral-rose-400 mt-1">✕</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-fuchsia-pink-100 to-white dark:from-fuchsia-pink-950/30 dark:to-card border-fuchsia-pink-200 dark:border-fuchsia-pink-700/30">
                <CardHeader>
                  <Badge
                    variant="outline"
                    className="w-fit mb-2 border-fuchsia-pink-300 text-fuchsia-pink-600 dark:text-fuchsia-pink-400"
                  >
                    The Solution
                  </Badge>
                  <CardTitle className="text-2xl md:text-3xl">
                    AI That Speaks ATS Language
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-4">
                    {[
                      'Templates optimized for ATS parsing',
                      'Real-time keyword optimization',
                      'Instant compatibility scoring',
                      'Job-specific tailoring in seconds',
                    ].map((item) => (
                      <li key={item} className="flex items-start gap-3 text-muted-foreground">
                        <CheckCircle2 className="w-5 h-5 text-fuchsia-pink-600 dark:text-fuchsia-pink-400 mt-0.5 flex-shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="container mx-auto px-4 py-20">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <Badge
                variant="outline"
                className="px-4 py-2 mb-6 border-secondary/30 bg-secondary/10"
              >
                <Sparkles className="w-4 h-4 mr-2 text-secondary" />
                <span className="text-secondary">Powered by Advanced AI</span>
              </Badge>
              <h2 className="text-3xl md:text-5xl font-bold mb-6">
                Everything You Need to{' '}
                <span className="bg-gradient-to-r from-secondary to-fuchsia-pink-400 text-transparent bg-clip-text">
                  Land the Interview
                </span>
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Our AI analyzes thousands of successful resumes and job postings to give you an
                unfair advantage.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {features.map((feature) => (
                <Card
                  key={feature.title}
                  className="group hover:border-fuchsia-pink-400 dark:hover:border-fuchsia-pink-700/50 transition-all duration-300"
                >
                  <CardHeader>
                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-fuchsia-pink-600 to-primary flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                      <feature.icon className="w-7 h-7 text-white" />
                    </div>
                    <CardTitle>{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base">{feature.description}</CardDescription>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section id="how-it-works" className="container mx-auto px-4 py-20">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <Badge
                variant="outline"
                className="px-4 py-2 mb-6 border-secondary/30 bg-secondary/10"
              >
                <WandSparkles className="w-4 h-4 mr-2 text-secondary" />
                <span className="text-secondary">See It In Action</span>
              </Badge>
              <h2 className="text-3xl md:text-5xl font-bold mb-6">
                From Upload to Interview in{' '}
                <span className="bg-gradient-to-r from-secondary to-fuchsia-pink-400 text-transparent bg-clip-text">
                  4 Simple Steps
                </span>
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Our AI handles the heavy lifting so you can focus on landing your dream job.
              </p>
            </div>

            <div className="space-y-16">
              {howItWorksSteps.map((item, index) => (
                <div
                  key={item.step}
                  className={`flex flex-col ${index % 2 === 1 ? 'lg:flex-row-reverse' : 'lg:flex-row'} gap-8 lg:gap-12 items-center`}
                >
                  <div className="flex-1 w-full">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-fuchsia-pink-600 to-primary flex items-center justify-center">
                        <item.icon className="w-7 h-7 text-white" />
                      </div>
                      <span className="text-5xl font-bold text-muted/30">{item.step}</span>
                    </div>
                    <h3 className="text-2xl md:text-3xl font-bold mb-4">{item.title}</h3>
                    <p className="text-muted-foreground text-lg mb-6 leading-relaxed">
                      {item.description}
                    </p>
                    <div className="flex flex-wrap gap-3">
                      {item.features.map((feature) => (
                        <Badge
                          key={feature}
                          variant="outline"
                          className="border-fuchsia-pink-200 dark:border-fuchsia-pink-700/30 bg-fuchsia-pink-100 dark:bg-fuchsia-pink-950/50"
                        >
                          <Check className="w-3.5 h-3.5 mr-1.5 text-fuchsia-pink-700 dark:text-fuchsia-pink-200" />
                          <span className="text-fuchsia-pink-700 dark:text-fuchsia-pink-200">
                            {feature}
                          </span>
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="flex-1 w-full">
                    <Card className="shadow-xl dark:shadow-2xl dark:shadow-fuchsia-pink-950/20">
                      <CardContent className="p-6">
                        {item.preview.type === 'upload' && (
                          <div className="space-y-4">
                            <div className="border-2 border-dashed border-border rounded-xl p-8 text-center hover:border-fuchsia-pink-500/50 transition-colors">
                              <Upload className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                              <p className="font-medium">Drop your resume here</p>
                              <p className="text-muted-foreground text-sm mt-1">
                                PDF, DOCX up to 5MB
                              </p>
                            </div>
                            <div className="flex items-center gap-4">
                              <Separator className="flex-1" />
                              <span className="text-muted-foreground text-sm">or</span>
                              <Separator className="flex-1" />
                            </div>
                            <button
                              type="button"
                              className="w-full py-3 px-4 rounded-xl border border-border text-foreground font-medium flex items-center justify-center gap-2 opacity-60 cursor-not-allowed"
                              disabled
                            >
                              LinkedIn import — coming soon
                            </button>
                          </div>
                        )}

                        {item.preview.type === 'analysis' && (
                          <div className="space-y-4">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-muted-foreground text-sm">Match Score</span>
                              <span className="text-2xl font-bold text-fuchsia-pink-600 dark:text-fuchsia-pink-400">
                                {item.preview.score}%
                              </span>
                            </div>
                            <div className="h-3 bg-muted rounded-full overflow-hidden">
                              <div
                                className="h-full bg-gradient-to-r from-fuchsia-pink-500 to-primary rounded-full transition-all duration-1000"
                                style={{ width: `${item.preview.score}%` }}
                              />
                            </div>
                            <div className="grid grid-cols-2 gap-4 mt-6">
                              <div>
                                <p className="text-sm text-muted-foreground mb-2">Keywords Found</p>
                                <div className="space-y-2">
                                  {item.preview.matches?.map((match) => (
                                    <div
                                      key={match}
                                      className="flex items-center gap-2 text-teal-600 dark:text-teal-400 text-sm"
                                    >
                                      <CheckCircle2 className="w-4 h-4" />
                                      {match}
                                    </div>
                                  ))}
                                </div>
                              </div>
                              <div>
                                <p className="text-sm text-muted-foreground mb-2">Suggested Adds</p>
                                <div className="space-y-2">
                                  {item.preview.missing?.map((miss) => (
                                    <div
                                      key={miss}
                                      className="flex items-center gap-2 text-amber-500 dark:text-amber-400 text-sm"
                                    >
                                      <Zap className="w-4 h-4" />
                                      {miss}
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </div>
                        )}

                        {item.preview.type === 'rewrite' && (
                          <div className="space-y-4">
                            <Card className="bg-coral-rose-100 dark:bg-coral-rose-950/30 border-coral-rose-200 dark:border-coral-rose-900/30">
                              <CardContent className="p-4">
                                <p className="text-xs text-coral-rose-600 dark:text-coral-rose-400 uppercase tracking-wide mb-2">
                                  Before
                                </p>
                                <p className="text-muted-foreground line-through">
                                  {item.preview.before}
                                </p>
                              </CardContent>
                            </Card>
                            <div className="flex justify-center">
                              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-fuchsia-pink-600 to-primary flex items-center justify-center">
                                <Sparkles className="w-5 h-5 text-white" />
                              </div>
                            </div>
                            <Card className="bg-fuchsia-pink-100 dark:bg-fuchsia-pink-950/30 border-fuchsia-pink-200 dark:border-fuchsia-pink-700/30">
                              <CardContent className="p-4">
                                <p className="text-xs text-fuchsia-pink-600 dark:text-fuchsia-pink-400 uppercase tracking-wide mb-2">
                                  After (AI Enhanced)
                                </p>
                                <p className="font-medium">{item.preview.after}</p>
                              </CardContent>
                            </Card>
                          </div>
                        )}

                        {item.preview.type === 'export' && (
                          <div className="space-y-4">
                            <Card className="bg-gradient-to-br from-fuchsia-pink-100 to-white dark:from-fuchsia-pink-950/50 dark:to-card border-fuchsia-pink-200 dark:border-fuchsia-pink-700/30">
                              <CardContent className="p-6 text-center">
                                <div className="text-5xl font-bold text-fuchsia-pink-600 dark:text-fuchsia-pink-400 mb-2">
                                  {item.preview.score}%
                                </div>
                                <p className="text-fuchsia-pink-700 dark:text-fuchsia-pink-200 text-sm">
                                  ATS Ready Score
                                </p>
                              </CardContent>
                            </Card>
                            <div className="grid grid-cols-3 gap-3">
                              {item.preview.formats?.map((format) => (
                                <Button
                                  key={format}
                                  variant="outline"
                                  className="flex items-center justify-center gap-2"
                                >
                                  <Download className="w-4 h-4" />
                                  {format}
                                </Button>
                              ))}
                            </div>
                            <p className="text-center text-muted-foreground text-sm">
                              Your resume is optimized and ready to apply!
                            </p>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section className="container mx-auto px-4 py-20" id="pricing">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <Badge
                variant="outline"
                className="px-4 py-2 mb-6 border-secondary/30 bg-secondary/10"
              >
                <Crown className="w-4 h-4 mr-2 text-secondary" />
                <span className="text-secondary">Simple, Transparent Pricing</span>
              </Badge>
              <h2 className="text-3xl md:text-5xl font-bold mb-6">
                Choose Your{' '}
                <span className="bg-gradient-to-r from-secondary to-fuchsia-pink-400 text-transparent bg-clip-text">
                  Career Advantage
                </span>
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Start free and upgrade when you're ready to supercharge your job search.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {pricingTiers.map((tier) => (
                <Card
                  key={tier.name}
                  className={
                    tier.featured
                      ? 'relative bg-gradient-to-br from-fuchsia-pink-100 to-white dark:from-fuchsia-pink-950/50 dark:to-card border-2 border-fuchsia-pink-500'
                      : 'relative'
                  }
                >
                  {tier.featured && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                      <Badge className="bg-gradient-to-r from-fuchsia-pink-500 to-primary border-0">
                        Most Popular
                      </Badge>
                    </div>
                  )}

                  <CardHeader>
                    <div className="flex items-center gap-3 mb-2">
                      <div
                        className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                          tier.featured
                            ? 'bg-gradient-to-br from-fuchsia-pink-600 to-primary'
                            : 'bg-muted'
                        }`}
                      >
                        <tier.icon
                          className={`w-6 h-6 ${tier.featured ? 'text-white' : 'text-muted-foreground'}`}
                        />
                      </div>
                      <CardTitle className="text-2xl">{tier.name}</CardTitle>
                    </div>
                    <div className="mb-2">
                      <span className="text-4xl font-bold">{tier.price}</span>
                      <span className="text-muted-foreground">{tier.period}</span>
                    </div>
                    <CardDescription>{tier.description}</CardDescription>
                  </CardHeader>

                  <CardContent>
                    <Link to="/dashboard">
                      <Button
                        variant={tier.featured ? 'primary' : 'ghost'}
                        size="lg"
                        className="w-full mb-6"
                      >
                        {tier.cta}
                      </Button>
                    </Link>

                    <ul className="space-y-3">
                      {tier.features.map((feature) => (
                        <li key={feature.text} className="flex items-center gap-3">
                          {feature.included ? (
                            <Check className="w-5 h-5 text-fuchsia-pink-600 dark:text-fuchsia-pink-400 flex-shrink-0" />
                          ) : (
                            <X className="w-5 h-5 text-muted-foreground/50 flex-shrink-0" />
                          )}
                          <span
                            className={
                              feature.included ? 'text-foreground' : 'text-muted-foreground/50'
                            }
                          >
                            {feature.text}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="mt-12 text-center">
              <p className="text-muted-foreground">
                All plans include a 7-day money-back guarantee. No questions asked.
              </p>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="container mx-auto px-4 py-20">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-bold mb-6">
                Join Thousands Who{' '}
                <span className="bg-gradient-to-r from-secondary to-fuchsia-pink-400 text-transparent bg-clip-text">
                  Landed Their Dream Job
                </span>
              </h2>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {testimonials.map((testimonial) => (
                <Card key={testimonial.name}>
                  <CardContent className="pt-6">
                    <div className="flex gap-1 mb-4">
                      {[1, 2, 3, 4, 5].slice(0, testimonial.rating).map((star) => (
                        <Star key={star} className="w-5 h-5 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                    <p className="text-muted-foreground mb-6 leading-relaxed">
                      "{testimonial.quote}"
                    </p>
                    <div>
                      <div className="font-semibold">{testimonial.name}</div>
                      <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                      <div className="text-sm text-fuchsia-pink-600 dark:text-fuchsia-pink-400">
                        {testimonial.company}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="container mx-auto px-4 py-20">
          <div className="max-w-4xl mx-auto">
            <Card className="relative rounded-3xl bg-gradient-to-br from-fuchsia-pink-600 to-primary border-0 overflow-hidden">
              <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzRjMC0yIDItNCAyLTRzLTItMi00LTJoLTRjLTIgMC00IDItNCAyczIgNCAyIDQgMiAyIDQgMmg0YzIgMCA0LTIgNC0yeiIvPjwvZz48L2c+PC9zdmc+')] opacity-30" />
              <CardContent className="relative p-12 md:p-16 text-center">
                <WandSparkles className="w-16 h-16 mx-auto mb-6 text-white/90" />
                <h2 className="text-3xl md:text-5xl font-bold mb-6 text-white">
                  Ready to Beat the ATS?
                </h2>
                <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
                  Start building your interview-winning resume today — no account required.
                </p>
                <Link to="/dashboard/new">
                  <Button
                    variant="secondary"
                    size="lg"
                    className="text-lg px-10 py-5 bg-white text-primary hover:bg-cod-gray-100 border-white shadow-xl"
                  >
                    Create Your Free Resume
                    <ArrowRight className="inline-block ml-2 w-5 h-5" />
                  </Button>
                </Link>
                <p className="text-white/70 text-sm mt-6">
                  No credit card required • Free to start • Sign in to save & export
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-border py-12">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row justify-between items-center gap-6">
              <div className="flex items-center gap-2">
                <WandSparkles className="w-6 h-6 text-fuchsia-pink-600 dark:text-fuchsia-pink-400" />
                <span className="font-bold text-xl">AI Resume Magic</span>
              </div>
              <p className="text-muted-foreground text-sm">
                © 2026 AI Resume Magic. Built to help you land your dream job.
              </p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default Home;
