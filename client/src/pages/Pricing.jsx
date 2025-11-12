import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PublicHeader } from '@/components/PublicHeader';
import {
  Check,
  Star,
  Zap,
  Crown,
  ArrowRight,
  Users,
  Briefcase,
  TrendingUp,
  Shield
} from 'lucide-react';

export default function Pricing() {
  const plans = [
    {
      name: "Free",
      price: "$0",
      period: "forever",
      description: "Perfect for getting started and exploring the platform",
      icon: <Users className="w-8 h-8 text-muted-foreground" />,
      features: [
        "Create student profile",
        "Browse up to 10 gigs",
        "Apply to 3 gigs per month",
        "Basic skill verification",
        "Community support",
        "Mobile app access"
      ],
      limitations: [
        "Limited gig applications",
        "Basic profile visibility",
        "No priority support"
      ],
      buttonText: "Get Started Free",
      buttonVariant: "outline",
      popular: false
    },
    {
      name: "Pro",
      price: "$9.99",
      period: "month",
      description: "Ideal for serious students building their career",
      icon: <Zap className="w-8 h-8 text-primary" />,
      features: [
        "Everything in Free",
        "Unlimited gig applications",
        "Enhanced profile with portfolio",
        "Priority in search results",
        "Direct messaging with clients",
        "Advanced skill verification",
        "Monthly progress reports",
        "Resume optimization tips",
        "Interview preparation resources"
      ],
      limitations: [],
      buttonText: "Start Pro Trial",
      buttonVariant: "default",
      popular: true
    },
    {
      name: "Business",
      price: "$29.99",
      period: "month",
      description: "For businesses hiring regularly and scaling teams",
      icon: <Crown className="w-8 h-8 text-secondary" />,
      features: [
        "Everything in Pro",
        "Post unlimited gigs",
        "Advanced candidate filtering",
        "Bulk hiring tools",
        "Dedicated account manager",
        "Custom contracts",
        "Team collaboration tools",
        "Analytics dashboard",
        "Priority support",
        "White-label options",
        "API access"
      ],
      limitations: [],
      buttonText: "Start Business Trial",
      buttonVariant: "default",
      popular: false
    }
  ];

  const faqs = [
    {
      question: "Can I change plans anytime?",
      answer: "Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately, and we'll prorate any charges."
    },
    {
      question: "Is there a setup fee?",
      answer: "No, there are no setup fees for any of our plans. You only pay the monthly subscription fee."
    },
    {
      question: "Do you offer discounts for students?",
      answer: "Yes! Students with a valid .edu email address get 50% off Pro and Business plans. Contact our support team to apply."
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept all major credit cards, PayPal, and bank transfers. All payments are processed securely through Stripe."
    },
    {
      question: "Can I cancel anytime?",
      answer: "Absolutely. You can cancel your subscription at any time. You'll continue to have access until the end of your billing period."
    },
    {
      question: "Do you offer refunds?",
      answer: "We offer a 30-day money-back guarantee for all paid plans. If you're not satisfied, we'll refund your payment."
    }
  ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Computer Science Student",
      content: "The Pro plan helped me land my first freelance gig. The enhanced profile visibility made all the difference!",
      rating: 5
    },
    {
      name: "TechCorp Solutions",
      role: "Small Business Owner",
      content: "The Business plan's bulk hiring tools saved us hours of work. We found amazing talent quickly and affordably.",
      rating: 5
    },
    {
      name: "Mike Chen",
      role: "Marketing Student",
      content: "Started with Free, upgraded to Pro, and now I'm making $25/hour. This platform changed my college experience.",
      rating: 5
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <PublicHeader />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-foreground mb-6">
            Choose Your Plan
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            Start free and scale as you grow. All plans include our core features
            with different levels of access and support.
          </p>
          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <Shield className="w-4 h-4" />
            <span>30-day money-back guarantee on all paid plans</span>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          {plans.map((plan, index) => (
            <Card key={index} className={`relative ${plan.popular ? 'border-primary shadow-lg scale-105' : ''}`}>
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-primary text-primary-foreground px-3 py-1">
                    <Star className="w-3 h-3 mr-1" />
                    Most Popular
                  </Badge>
                </div>
              )}

              <CardHeader className="text-center pb-8">
                <div className="flex justify-center mb-4">
                  {plan.icon}
                </div>
                <CardTitle className="text-2xl mb-2">{plan.name}</CardTitle>
                <div className="text-4xl font-bold text-primary mb-1">
                  {plan.price}
                  <span className="text-lg font-normal text-muted-foreground">/{plan.period}</span>
                </div>
                <p className="text-muted-foreground">{plan.description}</p>
              </CardHeader>

              <CardContent>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start">
                      <Check className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>

                {plan.limitations.length > 0 && (
                  <div className="mb-8">
                    <p className="text-sm font-medium text-muted-foreground mb-2">Limitations:</p>
                    <ul className="space-y-2">
                      {plan.limitations.map((limitation, limitIndex) => (
                        <li key={limitIndex} className="flex items-start text-sm text-muted-foreground">
                          <span className="mr-3">•</span>
                          <span>{limitation}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <Button
                  className="w-full"
                  variant={plan.buttonVariant}
                  size="lg"
                  asChild
                >
                  <Link href="/register">
                    {plan.buttonText}
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Testimonials */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-center text-foreground mb-12">
            What Our Users Say
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index}>
                <CardContent className="pt-6">
                  <div className="flex mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-muted-foreground mb-4">"{testimonial.content}"</p>
                  <div>
                    <div className="font-medium text-foreground">{testimonial.name}</div>
                    <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Features Comparison */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-center text-foreground mb-12">
            Compare All Features
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-4 px-6 font-medium">Features</th>
                  <th className="text-center py-4 px-6 font-medium">Free</th>
                  <th className="text-center py-4 px-6 font-medium">Pro</th>
                  <th className="text-center py-4 px-6 font-medium">Business</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="py-4 px-6 font-medium">Gig Applications</td>
                  <td className="text-center py-4 px-6">3/month</td>
                  <td className="text-center py-4 px-6">Unlimited</td>
                  <td className="text-center py-4 px-6">Unlimited</td>
                </tr>
                <tr className="border-b">
                  <td className="py-4 px-6 font-medium">Profile Enhancement</td>
                  <td className="text-center py-4 px-6">Basic</td>
                  <td className="text-center py-4 px-6">Enhanced</td>
                  <td className="text-center py-4 px-6">Premium</td>
                </tr>
                <tr className="border-b">
                  <td className="py-4 px-6 font-medium">Support</td>
                  <td className="text-center py-4 px-6">Community</td>
                  <td className="text-center py-4 px-6">Priority</td>
                  <td className="text-center py-4 px-6">Dedicated</td>
                </tr>
                <tr className="border-b">
                  <td className="py-4 px-6 font-medium">Analytics</td>
                  <td className="text-center py-4 px-6">—</td>
                  <td className="text-center py-4 px-6">Basic</td>
                  <td className="text-center py-4 px-6">Advanced</td>
                </tr>
                <tr className="border-b">
                  <td className="py-4 px-6 font-medium">API Access</td>
                  <td className="text-center py-4 px-6">—</td>
                  <td className="text-center py-4 px-6">—</td>
                  <td className="text-center py-4 px-6">✓</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-center text-foreground mb-12">
            Frequently Asked Questions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {faqs.map((faq, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="text-lg">{faq.question}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{faq.answer}</p>
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
            Join thousands of students and businesses already using SkillBridge.
            Start free today and upgrade when you're ready.
          </p>
          <div className="flex gap-4 justify-center">
            <Button asChild size="lg">
              <Link href="/register">
                Start Free Trial
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link href="/benefits">View Benefits</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}