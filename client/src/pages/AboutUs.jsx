import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PublicHeader } from '@/components/PublicHeader';
import {
  Heart,
  Users,
  Target,
  Award,
  Globe,
  TrendingUp,
  ArrowRight,
  CheckCircle2,
  Star,
  Building2,
  GraduationCap,
  HandHeart
} from 'lucide-react';

export default function AboutUs() {
  const values = [
    {
      icon: <Heart className="w-8 h-8 text-primary" />,
      title: "Empowerment",
      description: "We believe in empowering the next generation by connecting talent with opportunity, fostering growth and independence."
    },
    {
      icon: <Users className="w-8 h-8 text-primary" />,
      title: "Community",
      description: "Building bridges between students and businesses creates stronger communities and more prosperous futures."
    },
    {
      icon: <Target className="w-8 h-8 text-primary" />,
      title: "Excellence",
      description: "We strive for excellence in everything we do, from platform quality to user experience and customer support."
    },
    {
      icon: <Award className="w-8 h-8 text-primary" />,
      title: "Innovation",
      description: "We're constantly innovating to make the gig economy work better for young talent and growing businesses."
    }
  ];

  const milestones = [
    {
      year: "2020",
      title: "Founded",
      description: "SkillBridge was born from a simple idea: connect talented youth with meaningful work opportunities."
    },
    {
      year: "2021",
      title: "10,000 Users",
      description: "Reached our first major milestone with 10,000 active users on the platform."
    },
    {
      year: "2022",
      title: "Series A Funding",
      description: "Secured $5M in funding to expand our platform and team."
    },
    {
      year: "2023",
      title: "50,000 Gigs",
      description: "Celebrated completing 50,000 successful gigs, creating real impact for our community."
    },
    {
      year: "2024",
      title: "Global Expansion",
      description: "Expanded to serve students and businesses across North America and Europe."
    }
  ];

  const team = [
    {
      name: "Sarah Chen",
      role: "CEO & Co-Founder",
      bio: "Former tech executive passionate about youth empowerment. MBA from Stanford, previously led product at a Fortune 500 company.",
      image: "/api/placeholder/150/150"
    },
    {
      name: "Marcus Johnson",
      role: "CTO & Co-Founder",
      bio: "Serial entrepreneur with 15+ years in edtech. PhD in Computer Science, built 3 successful startups before SkillBridge.",
      image: "/api/placeholder/150/150"
    },
    {
      name: "Dr. Emily Rodriguez",
      role: "Head of Education",
      bio: "Education researcher and former university professor. PhD in Education Technology, focused on career development for youth.",
      image: "/api/placeholder/150/150"
    },
    {
      name: "David Kim",
      role: "VP of Engineering",
      bio: "Engineering leader with expertise in scalable platforms. Previously built engineering teams at major tech companies.",
      image: "/api/placeholder/150/150"
    }
  ];

  const stats = [
    { number: "100,000+", label: "Students Helped" },
    { number: "5,000+", label: "Business Partners" },
    { number: "150,000+", label: "Gigs Completed" },
    { number: "95%", label: "User Satisfaction" },
    { number: "50+", label: "Countries Served" },
    { number: "4.9★", label: "Average Rating" }
  ];

  return (
    <div className="min-h-screen bg-background">
      <PublicHeader />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-foreground mb-6">
            About SkillBridge
          </h1>
          <p className="text-xl text-muted-foreground max-w-4xl mx-auto mb-8">
            We're on a mission to bridge the gap between talented youth and meaningful work opportunities.
            By connecting students with businesses, we're building a future where young people can gain
            experience, earn income, and launch successful careers.
          </p>
          <div className="flex gap-4 justify-center">
            <Button asChild size="lg">
              <Link href="/register">
                Join Our Community
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link href="/how-it-works">Learn How We Help</Link>
            </Button>
          </div>
        </div>

        {/* Mission Section */}
        <div className="mb-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-foreground mb-6">
                Our Mission
              </h2>
              <p className="text-lg text-muted-foreground mb-6">
                In today's rapidly changing job market, young people need more than just degrees—they need
                real-world experience. At the same time, businesses struggle to find skilled talent for
                project-based work.
              </p>
              <p className="text-lg text-muted-foreground mb-6">
                SkillBridge solves this by creating a trusted platform where students can build portfolios,
                gain experience, and earn money while businesses can access a pipeline of motivated,
                skilled young talent.
              </p>
              <div className="flex items-center gap-3 text-primary">
                <HandHeart className="w-6 h-6" />
                <span className="font-medium">Empowering the next generation, one gig at a time</span>
              </div>
            </div>
            <div className="relative">
              <div className="aspect-square bg-gradient-to-br from-primary/20 to-secondary/20 rounded-2xl flex items-center justify-center">
                <div className="text-center">
                  <Globe className="w-24 h-24 text-primary mx-auto mb-4" />
                  <p className="text-2xl font-bold text-foreground">Global Impact</p>
                  <p className="text-muted-foreground">Connecting talent worldwide</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 mb-20">
          {stats.map((stat, index) => (
            <Card key={index} className="text-center">
              <CardContent className="pt-6">
                <div className="text-2xl font-bold text-primary mb-2">{stat.number}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Values Section */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-center text-foreground mb-12">
            Our Values
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <Card key={index} className="text-center hover-elevate transition-all duration-200">
                <CardHeader>
                  <div className="flex justify-center mb-4">
                    <div className="flex items-center justify-center w-16 h-16 rounded-full bg-primary/10">
                      {value.icon}
                    </div>
                  </div>
                  <CardTitle className="text-xl mb-2">{value.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Timeline Section */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-center text-foreground mb-12">
            Our Journey
          </h2>
          <div className="relative">
            <div className="absolute left-1/2 transform -translate-x-1/2 w-0.5 h-full bg-border"></div>
            <div className="space-y-12">
              {milestones.map((milestone, index) => (
                <div key={index} className={`flex items-center ${index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}>
                  <div className={`w-1/2 ${index % 2 === 0 ? 'pr-8 text-right' : 'pl-8 text-left'}`}>
                    <Card className="hover-elevate transition-all duration-200">
                      <CardContent className="pt-6">
                        <div className="text-2xl font-bold text-primary mb-2">{milestone.year}</div>
                        <h3 className="text-xl font-semibold mb-2">{milestone.title}</h3>
                        <p className="text-muted-foreground">{milestone.description}</p>
                      </CardContent>
                    </Card>
                  </div>
                  <div className="relative flex-shrink-0 w-4 h-4 bg-primary rounded-full border-4 border-background"></div>
                  <div className="w-1/2"></div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Team Section */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-center text-foreground mb-12">
            Meet Our Team
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <Card key={index} className="text-center hover-elevate transition-all duration-200">
                <CardHeader>
                  <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
                    <Users className="w-12 h-12 text-muted-foreground" />
                  </div>
                  <CardTitle className="text-lg">{member.name}</CardTitle>
                  <p className="text-primary font-medium">{member.role}</p>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{member.bio}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Impact Section */}
        <div className="mb-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-foreground mb-6">
                Real Impact, Real Stories
              </h2>
              <div className="space-y-6">
                <div className="flex gap-4">
                  <CheckCircle2 className="w-6 h-6 text-green-500 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">Career Launch Success</h3>
                    <p className="text-muted-foreground">85% of our active users report improved career prospects within 6 months</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <CheckCircle2 className="w-6 h-6 text-green-500 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">Income Generation</h3>
                    <p className="text-muted-foreground">Students earn an average of $18-35/hour on our platform</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <CheckCircle2 className="w-6 h-6 text-green-500 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">Business Growth</h3>
                    <p className="text-muted-foreground">Companies save 40% on hiring costs compared to traditional recruitment</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <CheckCircle2 className="w-6 h-6 text-green-500 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">Skill Development</h3>
                    <p className="text-muted-foreground">Users develop an average of 3-5 new professional skills per year</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="aspect-square bg-gradient-to-br from-secondary/20 to-primary/20 rounded-2xl flex items-center justify-center">
                <div className="text-center">
                  <TrendingUp className="w-24 h-24 text-secondary mx-auto mb-4" />
                  <p className="text-2xl font-bold text-foreground">Growing Together</p>
                  <p className="text-muted-foreground">Building futures, one opportunity at a time</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center bg-muted/50 rounded-2xl p-12">
          <h2 className="text-3xl font-bold text-foreground mb-4">
            Join Our Mission
          </h2>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
            Whether you're a student looking to build your career or a business seeking talent,
            SkillBridge is here to help you succeed. Join our growing community today.
          </p>
          <div className="flex gap-4 justify-center">
            <Button asChild size="lg">
              <Link href="/register">
                Get Started Now
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link href="/contact">Contact Us</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}