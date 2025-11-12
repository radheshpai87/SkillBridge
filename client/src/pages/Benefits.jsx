import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PublicHeader } from '@/components/PublicHeader';
import {
  Shield,
  Zap,
  Users,
  DollarSign,
  Clock,
  Star,
  TrendingUp,
  CheckCircle2,
  ArrowRight,
  Briefcase,
  GraduationCap,
  Building2
} from 'lucide-react';

export default function Benefits() {
  const studentBenefits = [
    {
      icon: <DollarSign className="w-8 h-8 text-primary" />,
      title: "Earn Competitive Rates",
      description: "Get paid fairly for your skills and experience. Our platform ensures you receive market-rate compensation for quality work in the Indian market.",
      details: ["Transparent pricing", "Quick payouts", "No hidden fees"]
    },
    {
      icon: <TrendingUp className="w-8 h-8 text-primary" />,
      title: "Build Your Portfolio",
      description: "Every completed gig becomes part of your professional portfolio, showcasing your skills to future employers.",
      details: ["Verified work history", "Client testimonials", "Skill endorsements"]
    },
    {
      icon: <Clock className="w-8 h-8 text-primary" />,
      title: "Flexible Schedule",
      description: "Work when it suits you. Choose gigs that fit your availability and maintain control over your time.",
      details: ["Set your own hours", "Work from anywhere", "Balance school and work"]
    },
    {
      icon: <GraduationCap className="w-8 h-8 text-primary" />,
      title: "Learn New Skills",
      description: "Take on diverse projects that challenge you and help you develop new abilities while getting paid.",
      details: ["Real-world experience", "Skill development", "Career advancement"]
    },
    {
      icon: <Users className="w-8 h-8 text-primary" />,
      title: "Network & Connect",
      description: "Build relationships with professionals across industries and expand your professional network.",
      details: ["Industry connections", "Mentorship opportunities", "Collaborative projects"]
    },
    {
      icon: <Star className="w-8 h-8 text-primary" />,
      title: "Earn Recognition",
      description: "Receive reviews and ratings that highlight your strengths and help you stand out to future clients.",
      details: ["Verified reviews", "Achievement badges", "Profile highlights"]
    }
  ];

  const businessBenefits = [
    {
      icon: <Zap className="w-8 h-8 text-secondary" />,
      title: "Fast Hiring",
      description: "Find qualified candidates quickly. Our platform matches you with skilled youth ready to work.",
      details: ["Quick application review", "Instant notifications", "Streamlined hiring process"]
    },
    {
      icon: <Shield className="w-8 h-8 text-secondary" />,
      title: "Quality Talent",
      description: "Access a pool of motivated, skilled youth who are eager to prove themselves and deliver results.",
      details: ["Verified skills", "Background checks", "Performance tracking"]
    },
    {
      icon: <DollarSign className="w-8 h-8 text-secondary" />,
      title: "Cost Effective",
      description: "Hire for specific projects without long-term commitments. Pay only for the work you need.",
      details: ["Project-based pricing", "No overhead costs", "Scalable workforce"]
    },
    {
      icon: <Clock className="w-8 h-8 text-secondary" />,
      title: "Flexible Scaling",
      description: "Scale your team up or down based on project needs. Hire additional help for peak periods.",
      details: ["On-demand hiring", "Short-term projects", "Peak period support"]
    },
    {
      icon: <CheckCircle2 className="w-8 h-8 text-secondary" />,
      title: "Managed Platform",
      description: "We handle the complexities of hiring, payments, and project management so you can focus on results.",
      details: ["Secure payments", "Dispute resolution", "Platform support"]
    },
    {
      icon: <TrendingUp className="w-8 h-8 text-secondary" />,
      title: "Fresh Perspectives",
      description: "Young talent brings new ideas, current technology knowledge, and innovative approaches to your projects.",
      details: ["Modern techniques", "Creative solutions", "Tech-savvy workforce"]
    }
  ];

  const stats = [
    { number: "50,000+", label: "Active Students" },
    { number: "2,500+", label: "Business Partners" },
    { number: "75,000+", label: "Gigs Completed" },
    { number: "95%", label: "Satisfaction Rate" }
  ];

  return (
    <div className="min-h-screen bg-background">
      <PublicHeader />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-foreground mb-6">
            Why Choose SkillBridge?
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            Discover the advantages that make SkillBridge the preferred platform for connecting
            talented youth with meaningful opportunities.
          </p>
          <div className="flex gap-4 justify-center">
            <Button asChild size="lg">
              <Link href="/register">
                Get Started Today
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link href="/how-it-works">Learn How It Works</Link>
            </Button>
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-20">
          {stats.map((stat, index) => (
            <Card key={index} className="text-center">
              <CardContent className="pt-6">
                <div className="text-3xl font-bold text-primary mb-2">{stat.number}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Student Benefits */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10">
                <GraduationCap className="w-6 h-6 text-primary" />
              </div>
              <h2 className="text-3xl font-bold text-foreground">Benefits for Students</h2>
            </div>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Launch your career with flexible opportunities that build your skills,
              experience, and professional network.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {studentBenefits.map((benefit, index) => (
              <Card key={index} className="hover-elevate transition-all duration-200">
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10">
                      {benefit.icon}
                    </div>
                    <CardTitle className="text-xl">{benefit.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">{benefit.description}</p>
                  <ul className="space-y-2">
                    {benefit.details.map((detail, detailIndex) => (
                      <li key={detailIndex} className="flex items-center text-sm text-muted-foreground">
                        <CheckCircle2 className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                        {detail}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Business Benefits */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-secondary/10">
                <Building2 className="w-6 h-6 text-secondary" />
              </div>
              <h2 className="text-3xl font-bold text-foreground">Benefits for Businesses</h2>
            </div>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Access top talent quickly and cost-effectively. Scale your projects with
              skilled youth who deliver results.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {businessBenefits.map((benefit, index) => (
              <Card key={index} className="hover-elevate transition-all duration-200">
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-secondary/10">
                      {benefit.icon}
                    </div>
                    <CardTitle className="text-xl">{benefit.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">{benefit.description}</p>
                  <ul className="space-y-2">
                    {benefit.details.map((detail, detailIndex) => (
                      <li key={detailIndex} className="flex items-center text-sm text-muted-foreground">
                        <CheckCircle2 className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                        {detail}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Platform Benefits */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-center text-foreground mb-12">
            Platform Advantages
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="overflow-visible">
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10">
                    <Shield className="w-6 h-6 text-primary" />
                  </div>
                  <CardTitle className="text-2xl">Secure & Trusted</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Your data and transactions are protected with bank-level security.
                  We verify identities and maintain strict privacy standards.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-center text-sm text-muted-foreground">
                    <CheckCircle2 className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                    SSL encryption for all data
                  </li>
                  <li className="flex items-center text-sm text-muted-foreground">
                    <CheckCircle2 className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                    Secure payment processing
                  </li>
                  <li className="flex items-center text-sm text-muted-foreground">
                    <CheckCircle2 className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                    Identity verification
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="overflow-visible">
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10">
                    <Briefcase className="w-6 h-6 text-primary" />
                  </div>
                  <CardTitle className="text-2xl">Smart Matching</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Our intelligent algorithm connects the right talent with the right opportunities,
                  saving you time and ensuring better outcomes.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-center text-sm text-muted-foreground">
                    <CheckCircle2 className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                    Skill-based matching
                  </li>
                  <li className="flex items-center text-sm text-muted-foreground">
                    <CheckCircle2 className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                    Location preferences
                  </li>
                  <li className="flex items-center text-sm text-muted-foreground">
                    <CheckCircle2 className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                    Availability matching
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center bg-muted/50 rounded-2xl p-12">
          <h2 className="text-3xl font-bold text-foreground mb-4">
            Ready to Experience These Benefits?
          </h2>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join thousands of students and businesses who are already benefiting from
            the SkillBridge platform. Your success story starts here.
          </p>
          <div className="flex gap-4 justify-center">
            <Button asChild size="lg">
              <Link href="/register">
                Join SkillBridge
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link href="/popular-skills">Explore Skills</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}