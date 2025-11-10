import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { PublicHeader } from '@/components/PublicHeader';
import { Briefcase, TrendingUp, Users, Zap, GraduationCap, Building2 } from 'lucide-react';

export default function Landing() {
  return (
    <div className="min-h-screen bg-background">
      <PublicHeader />

      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-secondary/5 to-accent -z-10" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-foreground mb-6">
              Connecting Local Youth to{' '}
              <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Micro-Opportunities
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-10 max-w-3xl mx-auto">
              SkillBridge empowers college students and local youth to showcase their skills and connect with small businesses for affordable, meaningful gigs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/register">
                <Button size="lg" className="text-lg px-8 h-14" data-testid="button-get-started">
                  Get Started Free
                </Button>
              </Link>
              <Link href="/browse">
                <Button size="lg" variant="outline" className="text-lg px-8 h-14" data-testid="button-browse">
                  Browse Opportunities
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-foreground mb-4">Why Choose SkillBridge?</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            We make it easy for talented youth to find work and for businesses to find talent
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <Card className="text-center overflow-visible hover-elevate transition-all">
            <CardHeader className="pt-8">
              <div className="flex justify-center mb-4">
                <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-secondary">
                  <Zap className="w-8 h-8 text-primary-foreground" />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-foreground">Quick Matching</h3>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Our smart algorithm matches students with opportunities based on their skills and interests
              </p>
            </CardContent>
          </Card>

          <Card className="text-center overflow-visible hover-elevate transition-all">
            <CardHeader className="pt-8">
              <div className="flex justify-center mb-4">
                <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-secondary to-primary">
                  <Users className="w-8 h-8 text-primary-foreground" />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-foreground">Local Focus</h3>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Connect with opportunities in your community and build meaningful local relationships
              </p>
            </CardContent>
          </Card>

          <Card className="text-center overflow-visible hover-elevate transition-all">
            <CardHeader className="pt-8">
              <div className="flex justify-center mb-4">
                <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-secondary">
                  <TrendingUp className="w-8 h-8 text-primary-foreground" />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-foreground">Grow Together</h3>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Build your portfolio, gain experience, and help local businesses thrive
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* For Students & Businesses */}
      <div className="bg-muted/30 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12">
            <Card className="overflow-visible hover-elevate transition-all">
              <CardHeader>
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10">
                    <GraduationCap className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-2xl font-bold text-foreground">For Students</h3>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/20 shrink-0 mt-0.5">
                    <span className="text-primary text-sm font-bold">✓</span>
                  </div>
                  <p className="text-muted-foreground">Showcase your skills and build your portfolio</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/20 shrink-0 mt-0.5">
                    <span className="text-primary text-sm font-bold">✓</span>
                  </div>
                  <p className="text-muted-foreground">Find flexible gigs that fit your schedule</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/20 shrink-0 mt-0.5">
                    <span className="text-primary text-sm font-bold">✓</span>
                  </div>
                  <p className="text-muted-foreground">Earn money while gaining real-world experience</p>
                </div>
                <Link href="/register">
                  <Button className="w-full mt-4" data-testid="button-student-signup">
                    Sign Up as Student
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="overflow-visible hover-elevate transition-all">
              <CardHeader>
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-secondary/10">
                    <Building2 className="w-6 h-6 text-secondary" />
                  </div>
                  <h3 className="text-2xl font-bold text-foreground">For Businesses</h3>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="flex items-center justify-center w-6 h-6 rounded-full bg-secondary/20 shrink-0 mt-0.5">
                    <span className="text-secondary text-sm font-bold">✓</span>
                  </div>
                  <p className="text-muted-foreground">Access a pool of talented, motivated youth</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="flex items-center justify-center w-6 h-6 rounded-full bg-secondary/20 shrink-0 mt-0.5">
                    <span className="text-secondary text-sm font-bold">✓</span>
                  </div>
                  <p className="text-muted-foreground">Get affordable help for short-term projects</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="flex items-center justify-center w-6 h-6 rounded-full bg-secondary/20 shrink-0 mt-0.5">
                    <span className="text-secondary text-sm font-bold">✓</span>
                  </div>
                  <p className="text-muted-foreground">Support local talent and build community</p>
                </div>
                <Link href="/register">
                  <Button variant="secondary" className="w-full mt-4" data-testid="button-business-signup">
                    Sign Up as Business
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <Card className="overflow-visible bg-gradient-to-br from-primary to-secondary text-primary-foreground">
          <CardContent className="py-16 text-center">
            <h2 className="text-4xl font-bold mb-4">Ready to Get Started?</h2>
            <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
              Join SkillBridge today and start connecting with opportunities in your community
            </p>
            <Link href="/register">
              <Button size="lg" variant="secondary" className="text-lg px-8 h-14" data-testid="button-cta">
                Create Your Free Account
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* Footer */}
      <footer className="border-t bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center space-x-2">
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-secondary">
                <Briefcase className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="text-lg font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                SkillBridge
              </span>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2025 SkillBridge. Connecting local youth to micro-opportunities.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
