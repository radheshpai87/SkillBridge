import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PublicHeader } from '@/components/PublicHeader';
import { Shield, ArrowRight, FileText, Calendar } from 'lucide-react';

export default function PrivacyPolicy() {
  const lastUpdated = "December 15, 2024";

  const sections = [
    {
      id: "information-we-collect",
      title: "Information We Collect",
      content: [
        "Personal Information: Name, email address, phone number, date of birth, educational background, and profile information you provide when registering.",
        "Usage Data: Information about how you use our platform, including pages visited, features used, and time spent on the platform.",
        "Device Information: IP address, browser type, operating system, and device identifiers.",
        "Payment Information: Billing address and payment method details (processed securely by third-party providers).",
        "Communication Data: Messages, feedback, and support interactions within our platform."
      ]
    },
    {
      id: "how-we-use-information",
      title: "How We Use Your Information",
      content: [
        "Provide and maintain our services, including account creation and gig matching.",
        "Process payments and manage subscriptions.",
        "Communicate with you about your account, gigs, and platform updates.",
        "Improve our platform through analytics and user feedback.",
        "Ensure platform security and prevent fraud.",
        "Comply with legal obligations and enforce our terms of service."
      ]
    },
    {
      id: "information-sharing",
      title: "Information Sharing and Disclosure",
      content: [
        "With other users as necessary for gig completion (e.g., contact information for communication).",
        "With service providers who assist in platform operations (payment processors, hosting services).",
        "When required by law or to protect our rights and safety.",
        "In connection with a business transfer or acquisition.",
        "With your explicit consent for specific purposes."
      ]
    },
    {
      id: "data-security",
      title: "Data Security",
      content: [
        "We implement industry-standard security measures to protect your personal information.",
        "All data transmission is encrypted using SSL/TLS protocols.",
        "We regularly audit our systems for security vulnerabilities.",
        "Access to personal information is restricted to authorized personnel only.",
        "We maintain backup systems to prevent data loss."
      ]
    },
    {
      id: "your-rights",
      title: "Your Rights and Choices",
      content: [
        "Access: Request a copy of the personal information we hold about you.",
        "Correction: Update or correct inaccurate information in your account.",
        "Deletion: Request deletion of your personal information (subject to legal requirements).",
        "Portability: Request your data in a structured, machine-readable format.",
        "Opt-out: Unsubscribe from marketing communications at any time.",
        "Restriction: Request limitation of how we process your information."
      ]
    },
    {
      id: "cookies",
      title: "Cookies and Tracking Technologies",
      content: [
        "We use cookies to enhance your experience and analyze platform usage.",
        "Essential cookies are required for platform functionality.",
        "Analytics cookies help us understand user behavior and improve services.",
        "You can control cookie preferences through your browser settings.",
        "Third-party services may also use cookies for their own purposes."
      ]
    },
    {
      id: "international-transfers",
      title: "International Data Transfers",
      content: [
        "Your information may be transferred to and processed in countries other than your own.",
        "We ensure appropriate safeguards are in place for international transfers.",
        "All transfers comply with applicable data protection laws.",
        "We use standard contractual clauses approved by regulatory authorities."
      ]
    },
    {
      id: "childrens-privacy",
      title: "Children's Privacy",
      content: [
        "Our platform is intended for users aged 13 and above.",
        "We do not knowingly collect personal information from children under 13.",
        "If we become aware of such collection, we will delete the information immediately.",
        "Parents can contact us to review or delete their child's information."
      ]
    },
    {
      id: "changes-to-policy",
      title: "Changes to This Privacy Policy",
      content: [
        "We may update this policy periodically to reflect changes in our practices.",
        "Material changes will be communicated via email or platform notification.",
        "Your continued use of our services constitutes acceptance of updated policies.",
        "We encourage you to review this policy regularly.",
        "Previous versions will be archived and available upon request."
      ]
    },
    {
      id: "contact-us",
      title: "Contact Us",
      content: [
        "If you have questions about this Privacy Policy, please contact us:",
        "Email: privacy@skillbridge.in",
        "Phone: +91 80 4567-8901",
        "Address: 123 Brigade Road, 4th Floor, Bangalore, Karnataka 560025",
        "Our Data Protection Officer can be reached at dpo@skillbridge.in"
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <PublicHeader />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10">
              <Shield className="w-6 h-6 text-primary" />
            </div>
            <h1 className="text-4xl font-bold text-foreground">Privacy Policy</h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-4">
            Your privacy is important to us. This policy explains how we collect, use, and protect your information.
          </p>
          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <Calendar className="w-4 h-4" />
            <span>Last updated: {lastUpdated}</span>
          </div>
        </div>

        {/* Quick Navigation */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-lg">Quick Navigation</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {sections.map((section) => (
                <a
                  key={section.id}
                  href={`#${section.id}`}
                  className="text-primary hover:text-primary/80 transition-colors text-sm"
                >
                  {section.title}
                </a>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Policy Content */}
        <div className="space-y-8">
          {sections.map((section, index) => (
            <Card key={section.id} id={section.id}>
              <CardHeader>
                <CardTitle className="text-xl flex items-center gap-2">
                  <span className="text-primary font-mono text-sm">{(index + 1).toString().padStart(2, '0')}</span>
                  {section.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {section.content.map((item, itemIndex) => (
                    <li key={itemIndex} className="flex items-start gap-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0"></div>
                      <span className="text-muted-foreground leading-relaxed">{item}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Footer Actions */}
        <div className="mt-12 text-center">
          <div className="bg-muted/50 rounded-2xl p-8">
            <FileText className="w-12 h-12 text-primary mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-foreground mb-4">
              Questions About Your Privacy?
            </h2>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              If you have any questions about this Privacy Policy or how we handle your data,
              please don't hesitate to contact our privacy team.
            </p>
            <div className="flex gap-4 justify-center">
              <Button asChild>
                <Link href="/contact">
                  Contact Privacy Team
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/terms-of-service">View Terms of Service</Link>
              </Button>
            </div>
          </div>
        </div>

        {/* Additional Resources */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="text-center">
            <CardContent className="pt-6">
              <Shield className="w-8 h-8 text-primary mx-auto mb-3" />
              <h3 className="font-semibold mb-2">Data Protection</h3>
              <p className="text-sm text-muted-foreground">
                Learn about our security measures and data protection practices.
              </p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardContent className="pt-6">
              <FileText className="w-8 h-8 text-primary mx-auto mb-3" />
              <h3 className="font-semibold mb-2">Legal Compliance</h3>
              <p className="text-sm text-muted-foreground">
                We comply with GDPR, CCPA, and Indian data protection laws including the Information Technology Act, 2000 and upcoming Personal Data Protection Bill.
              </p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardContent className="pt-6">
              <ArrowRight className="w-8 h-8 text-primary mx-auto mb-3" />
              <h3 className="font-semibold mb-2">Your Rights</h3>
              <p className="text-sm text-muted-foreground">
                Access, update, or delete your personal information anytime.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}