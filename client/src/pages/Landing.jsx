import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { PublicHeader } from '@/components/PublicHeader';
import { 
  TrendingUp, Users, Zap, GraduationCap, Building2, 
  CheckCircle2, Star, Clock, DollarSign, Search, MessageSquare,
  Code, Palette, Megaphone, Camera, FileEdit, Laptop
} from 'lucide-react';

export default function Landing() {
  return (
    <div className="min-h-screen bg-background">
      <PublicHeader />

      {/* Hero Section */}
      <div className="relative overflow-hidden">
  <div className="absolute inset-0 bg-accent/5 -z-10" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-foreground mb-6">
              Connecting Indian Youth to{' '}
              <span className="text-primary font-semibold">
                Micro-Opportunities
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-10 max-w-3xl mx-auto">
              SkillBridge empowers college students and local youth across India to showcase their skills and connect with small businesses for affordable, meaningful gigs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/register">
                <Button size="lg" className="text-lg px-8 h-14 bg-primary text-primary-foreground hover:opacity-95" data-testid="button-get-started">
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

      {/* Stats Section */}
      <div className="border-y bg-card/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-primary mb-2" data-testid="stat-students">2,500+</div>
              <div className="text-sm text-muted-foreground">Active Students</div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-secondary mb-2" data-testid="stat-businesses">800+</div>
              <div className="text-sm text-muted-foreground">Local Businesses</div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-primary mb-2" data-testid="stat-gigs">5,000+</div>
              <div className="text-sm text-muted-foreground">Gigs Completed</div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-secondary mb-2" data-testid="stat-rate">96%</div>
              <div className="text-sm text-muted-foreground">Satisfaction Rate</div>
            </div>
          </div>
        </div>
      </div>

      {/* How It Works */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-foreground mb-4">How SkillBridge Works</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Get started in three simple steps
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="relative">
            <div className="flex flex-col items-center text-center">
              <div className="flex items-center justify-center w-20 h-20 rounded-full bg-primary text-primary-foreground text-2xl font-bold mb-6">
                1
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-4">Create Your Profile</h3>
              <p className="text-muted-foreground mb-6">
                Sign up in minutes and showcase your skills, experience, or business needs
              </p>
              <div className="w-full h-1 bg-primary/20 hidden md:block absolute top-10 left-1/2" />
            </div>
          </div>

          <div className="relative">
            <div className="flex flex-col items-center text-center">
              <div className="flex items-center justify-center w-20 h-20 rounded-full bg-primary text-primary-foreground text-2xl font-bold mb-6">
                2
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-4">Find Matches</h3>
              <p className="text-muted-foreground mb-6">
                Browse opportunities or get matched based on your skills and interests
              </p>
              <div className="w-full h-1 bg-primary/20 hidden md:block absolute top-10 left-1/2" />
            </div>
          </div>

          <div className="flex flex-col items-center text-center">
            <div className="flex items-center justify-center w-20 h-20 rounded-full bg-primary text-primary-foreground text-2xl font-bold mb-6">
              3
            </div>
            <h3 className="text-2xl font-bold text-foreground mb-4">Start Working</h3>
            <p className="text-muted-foreground mb-6">
              Connect, collaborate, and complete gigs that build experience and grow businesses
            </p>
          </div>
        </div>
      </div>

      {/* Popular Skills */}
      <div className="bg-muted/30 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-foreground mb-4">Popular Skills in Demand</h2>
            <p className="text-xl text-muted-foreground">
              Top categories businesses are looking for
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <Card className="overflow-visible hover-elevate active-elevate-2 cursor-pointer transition-all">
              <CardContent className="p-6 flex flex-col items-center text-center">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-3">
                  <Code className="w-6 h-6 text-primary" />
                </div>
                <span className="font-semibold text-foreground">Web Dev</span>
              </CardContent>
            </Card>

            <Card className="overflow-visible hover-elevate active-elevate-2 cursor-pointer transition-all">
              <CardContent className="p-6 flex flex-col items-center text-center">
                <div className="w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center mb-3">
                  <Palette className="w-6 h-6 text-secondary" />
                </div>
                <span className="font-semibold text-foreground">Design</span>
              </CardContent>
            </Card>

            <Card className="overflow-visible hover-elevate active-elevate-2 cursor-pointer transition-all">
              <CardContent className="p-6 flex flex-col items-center text-center">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-3">
                  <Megaphone className="w-6 h-6 text-primary" />
                </div>
                <span className="font-semibold text-foreground">Marketing</span>
              </CardContent>
            </Card>

            <Card className="overflow-visible hover-elevate active-elevate-2 cursor-pointer transition-all">
              <CardContent className="p-6 flex flex-col items-center text-center">
                <div className="w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center mb-3">
                  <Camera className="w-6 h-6 text-secondary" />
                </div>
                <span className="font-semibold text-foreground">Photo/Video</span>
              </CardContent>
            </Card>

            <Card className="overflow-visible hover-elevate active-elevate-2 cursor-pointer transition-all">
              <CardContent className="p-6 flex flex-col items-center text-center">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-3">
                  <FileEdit className="w-6 h-6 text-primary" />
                </div>
                <span className="font-semibold text-foreground">Writing</span>
              </CardContent>
            </Card>

            <Card className="overflow-visible hover-elevate active-elevate-2 cursor-pointer transition-all">
              <CardContent className="p-6 flex flex-col items-center text-center">
                <div className="w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center mb-3">
                  <Laptop className="w-6 h-6 text-secondary" />
                </div>
                <span className="font-semibold text-foreground">Social Media</span>
              </CardContent>
            </Card>
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
                <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10">
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
                <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-secondary/10">
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
                <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10">
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

      {/* Testimonials */}
      <div className="bg-muted/30 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4">What People Are Saying</h2>
            <p className="text-xl text-muted-foreground">
              Real stories from our community
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="overflow-visible">
              <CardContent className="pt-6">
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-primary text-primary" />
                  ))}
                </div>
                <p className="text-foreground mb-6">
                  "SkillBridge helped me land my first freelance gig! I built a website for a local restaurant in Mumbai and gained real experience."
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold">
                    AP
                  </div>
                  <div>
                    <div className="font-semibold text-foreground">Arjun Patel</div>
                    <div className="text-sm text-muted-foreground">Computer Science Student, IIT Delhi</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="overflow-visible">
              <CardContent className="pt-6">
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-primary text-primary" />
                  ))}
                </div>
                <p className="text-foreground mb-6">
                  "As a small business owner in Bangalore, finding affordable help was always a challenge. SkillBridge connected me with talented students who delivered great work."
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center text-primary-foreground font-bold">
                    RK
                  </div>
                  <div>
                    <div className="font-semibold text-foreground">Rajesh Kumar</div>
                    <div className="text-sm text-muted-foreground">E-commerce Store Owner</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="overflow-visible">
              <CardContent className="pt-6">
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-primary text-primary" />
                  ))}
                </div>
                <p className="text-foreground mb-6">
                  "I've completed over 25 gigs on SkillBridge. It's perfect for earning money between classes while building my design portfolio!"
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold">
                    PS
                  </div>
                  <div>
                    <div className="font-semibold text-foreground">Priya Sharma</div>
                    <div className="text-sm text-muted-foreground">Graphic Design Student, NID Ahmedabad</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* For Students & Businesses */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
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
                <CheckCircle2 className="w-6 h-6 text-primary shrink-0 mt-0.5" />
                <p className="text-muted-foreground">Showcase your skills and build your portfolio</p>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-6 h-6 text-primary shrink-0 mt-0.5" />
                <p className="text-muted-foreground">Find flexible gigs that fit your schedule</p>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-6 h-6 text-primary shrink-0 mt-0.5" />
                <p className="text-muted-foreground">Earn money while gaining real-world experience</p>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-6 h-6 text-primary shrink-0 mt-0.5" />
                <p className="text-muted-foreground">Get matched with local opportunities</p>
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
                <CheckCircle2 className="w-6 h-6 text-secondary shrink-0 mt-0.5" />
                <p className="text-muted-foreground">Access a pool of talented, motivated youth</p>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-6 h-6 text-secondary shrink-0 mt-0.5" />
                <p className="text-muted-foreground">Get affordable help for short-term projects</p>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-6 h-6 text-secondary shrink-0 mt-0.5" />
                <p className="text-muted-foreground">Support local talent and build community</p>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-6 h-6 text-secondary shrink-0 mt-0.5" />
                <p className="text-muted-foreground">Post gigs in minutes and receive applications quickly</p>
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

      {/* Benefits Section */}
      <div className="bg-muted/30 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4">Built for Your Success</h2>
            <p className="text-xl text-muted-foreground">
              Everything you need to connect and succeed
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="flex justify-center mb-4">
                <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10">
                  <DollarSign className="w-8 h-8 text-primary" />
                </div>
              </div>
              <h3 className="text-xl font-bold text-foreground mb-2">Affordable Rates</h3>
              <p className="text-muted-foreground">
                Budget-friendly pricing perfect for small businesses and students
              </p>
            </div>

            <div className="text-center">
              <div className="flex justify-center mb-4">
                <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-secondary/10">
                  <Clock className="w-8 h-8 text-secondary" />
                </div>
              </div>
              <h3 className="text-xl font-bold text-foreground mb-2">Flexible Hours</h3>
              <p className="text-muted-foreground">
                Work on your schedule with short-term, project-based gigs
              </p>
            </div>

            <div className="text-center">
              <div className="flex justify-center mb-4">
                <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10">
                  <Search className="w-8 h-8 text-primary" />
                </div>
              </div>
              <h3 className="text-xl font-bold text-foreground mb-2">Smart Matching</h3>
              <p className="text-muted-foreground">
                AI-powered skill matching connects the right people with the right gigs
              </p>
            </div>

            <div className="text-center">
              <div className="flex justify-center mb-4">
                <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-secondary/10">
                  <MessageSquare className="w-8 h-8 text-secondary" />
                </div>
              </div>
              <h3 className="text-xl font-bold text-foreground mb-2">Easy Communication</h3>
              <p className="text-muted-foreground">
                Simple application and messaging system keeps everyone connected
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <Card className="overflow-visible bg-secondary text-secondary-foreground">
          <CardContent className="py-16 text-center">
            <h2 className="text-4xl font-bold mb-4">Ready to Get Started?</h2>
            <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
              Join thousands of students and businesses already connecting on SkillBridge
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div className="md:col-span-1">
              <div className="flex items-center space-x-2 mb-4">
                <img src="/favicon.svg" alt="SkillBridge Logo" className="w-10 h-10" />
                <span className="text-xl font-bold text-primary">
                  SkillBridge
                </span>
              </div>
              <p className="text-sm text-muted-foreground">
                Connecting Indian youth to meaningful micro-opportunities since 2023.
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-foreground mb-4">For Students</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/browse" className="hover:text-primary transition-colors">Browse Gigs</Link></li>
                <li><Link href="/register" className="hover:text-primary transition-colors">Sign Up</Link></li>
                <li><Link href="/how-it-works" className="hover:text-primary transition-colors">How It Works</Link></li>
                <li><Link href="/popular-skills" className="hover:text-primary transition-colors">Popular Skills</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-foreground mb-4">For Businesses</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/register" className="hover:text-primary transition-colors">Post a Gig</Link></li>
                <li><Link href="/register" className="hover:text-primary transition-colors">Find Talent</Link></li>
                <li><Link href="/benefits" className="hover:text-primary transition-colors">Benefits</Link></li>
                <li><Link href="/pricing" className="hover:text-primary transition-colors">Pricing</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-foreground mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/about-us" className="hover:text-primary transition-colors">About Us</Link></li>
                <li><Link href="/contact" className="hover:text-primary transition-colors">Contact</Link></li>
                <li><Link href="/privacy-policy" className="hover:text-primary transition-colors">Privacy Policy</Link></li>
                <li><Link href="/terms-of-service" className="hover:text-primary transition-colors">Terms of Service</Link></li>
              </ul>
            </div>
          </div>

          <div className="border-t pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground">
              © 2025 SkillBridge India. All rights reserved.
            </p>
            <div className="flex gap-6 text-sm text-muted-foreground">
              <Link href="/privacy-policy" className="hover:text-primary transition-colors">Privacy</Link>
              <Link href="/terms-of-service" className="hover:text-primary transition-colors">Terms</Link>
              <Link href="/contact" className="hover:text-primary transition-colors">Contact</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
