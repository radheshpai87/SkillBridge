import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PublicHeader } from '@/components/PublicHeader';
import {
  Code,
  Palette,
  Megaphone,
  Camera,
  FileEdit,
  Laptop,
  TrendingUp,
  Users,
  Search,
  ArrowRight,
  Star,
  Briefcase
} from 'lucide-react';

export default function PopularSkills() {
  const skillCategories = [
    {
      title: "Technology & Development",
      icon: <Code className="w-6 h-6 text-primary" />,
      description: "Build the future with coding and tech skills",
      skills: [
        { name: "Web Development", level: "High Demand", trending: true },
        { name: "Mobile App Development", level: "Growing", trending: true },
        { name: "Data Analysis", level: "High Demand", trending: false },
        { name: "UI/UX Design", level: "High Demand", trending: true },
        { name: "Graphic Design", level: "Steady", trending: false },
        { name: "Video Editing", level: "Growing", trending: false }
      ]
    },
    {
      title: "Creative & Media",
      icon: <Palette className="w-6 h-6 text-primary" />,
      description: "Express yourself through visual and creative work",
      skills: [
        { name: "Content Creation", level: "High Demand", trending: true },
        { name: "Social Media Marketing", level: "High Demand", trending: true },
        { name: "Photography", level: "Steady", trending: false },
        { name: "Video Production", level: "Growing", trending: true },
        { name: "Digital Art", level: "Growing", trending: false },
        { name: "Animation", level: "Growing", trending: false }
      ]
    },
    {
      title: "Business & Marketing",
      icon: <Megaphone className="w-6 h-6 text-primary" />,
      description: "Drive success with business and marketing expertise",
      skills: [
        { name: "Digital Marketing", level: "High Demand", trending: true },
        { name: "Market Research", level: "Growing", trending: false },
        { name: "Customer Service", level: "Steady", trending: false },
        { name: "Sales", level: "Steady", trending: false },
        { name: "Project Management", level: "High Demand", trending: false },
        { name: "Business Analysis", level: "Growing", trending: false }
      ]
    },
    {
      title: "Writing & Communication",
      icon: <FileEdit className="w-6 h-6 text-primary" />,
      description: "Share ideas and stories that matter",
      skills: [
        { name: "Content Writing", level: "High Demand", trending: true },
        { name: "Copywriting", level: "High Demand", trending: false },
        { name: "Technical Writing", level: "Growing", trending: false },
        { name: "Blog Writing", level: "Steady", trending: false },
        { name: "Social Media Management", level: "High Demand", trending: true },
        { name: "Public Relations", level: "Growing", trending: false }
      ]
    }
  ];

    const topSkills = [
    { name: "Web Development", growth: "+45%", avgRate: "₹600/hr", demand: "High" },
    { name: "Digital Marketing", growth: "+38%", avgRate: "₹500/hr", demand: "High" },
    { name: "Mobile App Development", growth: "+52%", avgRate: "₹700/hr", demand: "Very High" },
    { name: "Data Entry", growth: "+25%", avgRate: "₹300/hr", demand: "Medium" },
    { name: "Content Writing", growth: "+35%", avgRate: "₹400/hr", demand: "High" },
    { name: "Graphic Design", growth: "+40%", avgRate: "₹550/hr", demand: "High" }
  ];

  const getLevelColor = (level) => {
    switch (level) {
      case 'High Demand': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100';
      case 'Growing': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100';
      case 'Steady': return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-100';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-100';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <PublicHeader />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-foreground mb-6">
            Popular Skills
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            Discover the most in-demand skills that are shaping the future of work.
            Find opportunities that match your talents and interests.
          </p>
          <div className="flex gap-4 justify-center">
            <Button asChild size="lg">
              <Link href="/register">
                Start Building Skills
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link href="/browse">Browse Gigs</Link>
            </Button>
          </div>
        </div>

        {/* Top Skills Stats */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center text-foreground mb-8">
            Most Popular Skills This Month
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {topSkills.map((skill, index) => (
              <Card key={index} className="text-center">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-center mb-4">
                    <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10">
                      <Briefcase className="w-6 h-6 text-primary" />
                    </div>
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">{skill.name}</h3>
                  <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
                    <span>{skill.count} gigs</span>
                    <Badge variant="secondary" className="text-green-600">
                      <TrendingUp className="w-3 h-3 mr-1" />
                      {skill.growth}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Skill Categories */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-center text-foreground mb-12">
            Explore Skill Categories
          </h2>
          <div className="space-y-12">
            {skillCategories.map((category, categoryIndex) => (
              <Card key={categoryIndex} className="overflow-visible">
                <CardHeader>
                  <div className="flex items-center gap-4 mb-2">
                    <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10">
                      {category.icon}
                    </div>
                    <div>
                      <CardTitle className="text-2xl">{category.title}</CardTitle>
                      <p className="text-muted-foreground">{category.description}</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {category.skills.map((skill, skillIndex) => (
                      <div key={skillIndex} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                        <div>
                          <h4 className="font-medium text-foreground">{skill.name}</h4>
                          <Badge className={`mt-1 ${getLevelColor(skill.level)}`}>
                            {skill.level}
                          </Badge>
                        </div>
                        {skill.trending && (
                          <div className="flex items-center text-orange-500">
                            <TrendingUp className="w-4 h-4" />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Why Learn These Skills */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-center text-foreground mb-12">
            Why These Skills Matter
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="text-center">
              <CardContent className="pt-6">
                <div className="flex justify-center mb-4">
                  <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10">
                    <TrendingUp className="w-6 h-6 text-primary" />
                  </div>
                </div>
                <h3 className="font-semibold text-foreground mb-2">Future-Proof Your Career</h3>
                <p className="text-sm text-muted-foreground">
                  These skills are in high demand and will continue to grow as technology evolves.
                  Invest in yourself today for a brighter tomorrow.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="pt-6">
                <div className="flex justify-center mb-4">
                  <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10">
                    <span className="w-6 h-6 text-primary flex items-center justify-center font-bold">₹</span>
                  </div>
                </div>
                <h3 className="font-semibold text-foreground mb-2">Earn Competitive Rates</h3>
                <p className="text-sm text-muted-foreground">
                  Skilled professionals in these areas command premium rates.
                  Start building your expertise and increase your earning potential.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="pt-6">
                <div className="flex justify-center mb-4">
                  <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10">
                    <Users className="w-6 h-6 text-primary" />
                  </div>
                </div>
                <h3 className="font-semibold text-foreground mb-2">Build Your Network</h3>
                <p className="text-sm text-muted-foreground">
                  Connect with like-minded professionals and build relationships that last.
                  Your network is your net worth in today's economy.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center bg-muted/50 rounded-2xl p-12">
          <h2 className="text-3xl font-bold text-foreground mb-4">
            Ready to Develop Your Skills?
          </h2>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
            Whether you're just starting out or looking to expand your expertise,
            SkillBridge connects you with opportunities to learn, grow, and succeed.
          </p>
          <div className="flex gap-4 justify-center">
            <Button asChild size="lg">
              <Link href="/register">
                Join SkillBridge
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link href="/how-it-works">Learn More</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}