import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PublicHeader } from '@/components/PublicHeader';
import {
  Briefcase,
  Users,
  Search,
  CheckCircle2,
  ArrowRight,
  GraduationCap,
  Building2,
  MessageSquare,
  Clock,
  Star
} from 'lucide-react';

export default function HowItWorks() {
  const steps = [
    {
      icon: <Users className="w-8 h-8 text-primary" />,
      title: "Create Your Profile",
      description: "Sign up as a student or business and build your profile with relevant skills, experience, and preferences.",
      details: ["Add your skills and experience", "Upload a professional profile", "Set your availability and location"]
    },
    {
      icon: <Search className="w-8 h-8 text-primary" />,
      title: "Find Opportunities",
      description: "Browse through available gigs that match your skills, or post opportunities to find talented youth.",
      details: ["Filter by skills and location", "View detailed gig requirements", "Save favorite opportunities"]
    },
    {
      icon: <MessageSquare className="w-8 h-8 text-primary" />,
      title: "Connect & Apply",
      description: "Submit thoughtful applications explaining why you're the perfect fit for the opportunity.",
      details: ["Write compelling cover letters", "Highlight relevant experience", "Get responses within 24 hours"]
    },
    {
      icon: <CheckCircle2 className="w-8 h-8 text-primary" />,
      title: "Get Hired & Succeed",
      description: "Complete gigs successfully, build your reputation, and unlock more opportunities.",
      details: ["Track your progress", "Receive payments securely", "Earn reviews and ratings"]
    }
  ];

  const features = [
    {
      icon: <Clock className="w-6 h-6 text-secondary" />,
      title: "Quick Matching",
      description: "Our smart algorithm matches you with relevant opportunities within minutes."
    },
    {
      icon: <span className="w-6 h-6 text-secondary flex items-center justify-center font-bold">₹</span>,
      title: "Secure Payments",
      description: "All transactions are protected with bank-level security and instant payouts."
    },
    {
      icon: <Star className="w-6 h-6 text-secondary" />,
      title: "Verified Reviews",
      description: "Build your reputation with verified reviews from real clients and employers."
    },
    {
      icon: <MessageSquare className="w-6 h-6 text-secondary" />,
      title: "24/7 Support",
      description: "Get help whenever you need it with our dedicated support team."
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <PublicHeader />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-foreground mb-6">
            How SkillBridge Works
          </h1>
                      <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Join thousands of Indian students and businesses already connecting on SkillBridge
            </p>
          <div className="flex gap-4 justify-center">
            <Button asChild size="lg">
              <Link href="/register">
                Get Started Today
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link href="/browse">Browse Gigs</Link>
            </Button>
          </div>
        </div>

        {/* Steps Section */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-center text-foreground mb-12">
            Your Journey to Success
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <Card key={index} className="relative overflow-visible">
                <CardHeader className="text-center pb-4">
                  <div className="flex justify-center mb-4">
                    <div className="flex items-center justify-center w-16 h-16 rounded-full bg-primary/10">
                      {step.icon}
                    </div>
                  </div>
                  <div className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm">
                    {index + 1}
                  </div>
                  <CardTitle className="text-xl">{step.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">{step.description}</p>
                  <ul className="space-y-2">
                    {step.details.map((detail, detailIndex) => (
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

        {/* For Students vs Businesses */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">
          <Card className="overflow-visible">
            <CardHeader>
              <div className="flex items-center gap-3 mb-2">
                <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10">
                  <GraduationCap className="w-6 h-6 text-primary" />
                </div>
                <CardTitle className="text-2xl">For Students</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                Build your career with flexible, meaningful work opportunities that fit your schedule and interests.
              </p>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-sm">Find gigs that match your skills and availability</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-sm">Earn competitive rates for quality work</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-sm">Build a professional portfolio and references</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-sm">Learn new skills and gain real-world experience</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className="overflow-visible">
            <CardHeader>
              <div className="flex items-center gap-3 mb-2">
                <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-secondary/10">
                  <Building2 className="w-6 h-6 text-secondary" />
                </div>
                <CardTitle className="text-2xl">For Businesses</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                Access a pool of talented, motivated Indian youth from top universities for your project needs with our streamlined hiring process.
              </p>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-sm">Post gigs and receive qualified applications quickly</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-sm">Review detailed profiles and skill assessments</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-sm">Manage projects with our built-in tools</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-sm">Scale your team as needed with flexible hiring</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Features Section */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-center text-foreground mb-12">
            Why Choose SkillBridge?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="text-center">
                <CardContent className="pt-6">
                  <div className="flex justify-center mb-4">
                    <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-secondary/10">
                      {feature.icon}
                    </div>
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center bg-muted/50 rounded-2xl p-12">
          <h2 className="text-3xl font-bold text-foreground mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join thousands of students and businesses already using SkillBridge to connect,
            collaborate, and succeed. Your next opportunity is just a few clicks away.
          </p>
          <div className="flex gap-4 justify-center">
            <Button asChild size="lg">
              <Link href="/register">
                Create Your Account
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link href="/browse">Explore Gigs</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}