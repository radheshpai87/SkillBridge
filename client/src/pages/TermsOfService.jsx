import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PublicHeader } from '@/components/PublicHeader';
import { FileText, ArrowRight, Scale, Calendar } from 'lucide-react';

export default function TermsOfService() {
  const lastUpdated = "December 15, 2024";

  const sections = [
    {
      id: "acceptance-of-terms",
      title: "Acceptance of Terms",
      content: [
        "By accessing and using SkillBridge, you accept and agree to be bound by the terms and provision of this agreement.",
        "If you do not agree to abide by the above, please do not use this service.",
        "These terms apply to all users of the platform, including students, businesses, and visitors.",
        "We reserve the right to update these terms at any time without prior notice.",
        "Your continued use of the platform constitutes acceptance of updated terms."
      ]
    },
    {
      id: "description-of-service",
      title: "Description of Service",
      content: [
        "SkillBridge is a platform that connects students with businesses for gig-based work opportunities.",
        "We provide tools for profile creation, gig posting, application management, and payment processing.",
        "Services include account management, communication tools, and dispute resolution.",
        "We act as a platform provider and are not directly involved in the work arrangements between users.",
        "All gigs and work arrangements are made directly between students and businesses."
      ]
    },
    {
      id: "user-accounts",
      title: "User Accounts and Registration",
      content: [
        "Users must be at least 13 years old to create an account.",
        "You must provide accurate and complete information during registration.",
        "You are responsible for maintaining the confidentiality of your account credentials.",
        "You must immediately notify us of any unauthorized use of your account.",
        "One person may not maintain more than one account without permission.",
        "Account suspension or termination may result from violations of these terms."
      ]
    },
    {
      id: "user-conduct",
      title: "User Conduct and Responsibilities",
      content: [
        "Users must comply with all applicable laws and regulations.",
        "Content posted must be accurate, legal, and not infringe on others' rights.",
        "Harassment, discrimination, or abusive behavior is strictly prohibited.",
        "Users must respect intellectual property rights of others.",
        "Misrepresentation of skills, experience, or project requirements is not allowed.",
        "Users are responsible for the accuracy of information provided in their profiles.",
        "Violation of these rules may result in account suspension or permanent ban."
      ]
    },
    {
      id: "gigs-and-work-arrangements",
      title: "Gigs and Work Arrangements",
      content: [
        "Businesses post gigs with clear requirements, deliverables, and compensation.",
        "Students apply to gigs and may be selected based on their qualifications.",
        "All work arrangements are made directly between students and businesses.",
        "SkillBridge facilitates communication but is not responsible for work outcomes.",
        "Users must fulfill agreed-upon obligations and deliver work as specified.",
        "Disputes should be resolved through our platform's dispute resolution process.",
        "We reserve the right to intervene in disputes to maintain platform integrity."
      ]
    },
    {
      id: "payment-terms",
      title: "Payment Terms and Fees",
      content: [
        "Businesses pay for completed work through our secure payment system.",
        "Students receive payments after work completion and approval.",
        "SkillBridge charges fees for premium services and successful transactions.",
        "All fees are clearly disclosed before any transaction.",
        "Payments are processed securely through third-party providers.",
        "Refunds may be issued at our discretion for valid disputes.",
        "Users are responsible for applicable taxes on their earnings."
      ]
    },
    {
      id: "intellectual-property",
      title: "Intellectual Property Rights",
      content: [
        "Users retain ownership of content they create and upload to the platform.",
        "By posting content, users grant SkillBridge a license to use it for platform purposes.",
        "Users must not upload content that infringes on others' intellectual property rights.",
        "SkillBridge's trademarks, logos, and content are protected by copyright and trademark laws.",
        "Users may not reproduce or distribute our intellectual property without permission.",
        "We respect the intellectual property rights of others and respond to takedown requests."
      ]
    },
    {
      id: "privacy-and-data",
      title: "Privacy and Data Protection",
      content: [
        "Your privacy is protected in accordance with our Privacy Policy.",
        "We collect and use personal information as described in our Privacy Policy.",
        "Users must comply with applicable data protection laws.",
        "We implement security measures to protect user data.",
        "Users are responsible for protecting their own account security.",
        "Data breaches should be reported immediately to our security team."
      ]
    },
    {
      id: "termination",
      title: "Account Termination",
      content: [
        "Either party may terminate the account at any time.",
        "We reserve the right to suspend or terminate accounts for violations.",
        "Upon termination, users lose access to their accounts and data.",
        "Outstanding obligations must still be fulfilled after termination.",
        "We may retain certain data as required by law or for legitimate business purposes.",
        "Terminated users may not create new accounts without permission."
      ]
    },
    {
      id: "disclaimers",
      title: "Disclaimers and Limitations",
      content: [
        "Services are provided 'as is' without warranties of any kind.",
        "We do not guarantee employment outcomes or work opportunities.",
        "We are not responsible for the actions or conduct of other users.",
        "Platform availability and performance are not guaranteed.",
        "Users use the platform at their own risk.",
        "Our liability is limited to the maximum extent permitted by law."
      ]
    },
    {
      id: "indemnification",
      title: "Indemnification",
      content: [
        "Users agree to indemnify and hold SkillBridge harmless from claims arising from their use of the platform.",
        "This includes claims related to content, conduct, or violations of these terms.",
        "Users must cover all costs, damages, and legal fees incurred by SkillBridge.",
        "Indemnification applies to claims from other users or third parties.",
        "We reserve the right to assume exclusive defense of any indemnified claims."
      ]
    },
    {
      id: "governing-law",
      title: "Governing Law and Dispute Resolution",
      content: [
        "These terms are governed by the laws of India, specifically the Information Technology Act, 2000 and the Indian Contract Act, 1872.",
        "Disputes will be resolved through binding arbitration in Bangalore, Karnataka.",
        "Users waive their right to participate in class action lawsuits.",
        "Arbitration will be conducted by a neutral third-party arbitrator under the Arbitration and Conciliation Act, 1996.",
        "The prevailing party in any dispute is entitled to recover reasonable attorney's fees."
      ]
    },
    {
      id: "changes-to-terms",
      title: "Changes to Terms",
      content: [
        "We may modify these terms at any time without prior notice.",
        "Material changes will be communicated via email or platform notification.",
        "Continued use of the platform constitutes acceptance of updated terms.",
        "Users should review these terms periodically.",
        "Previous versions of the terms will be archived and available upon request."
      ]
    },
    {
      id: "contact-information",
      title: "Contact Information",
      content: [
        "For questions about these terms, contact us at legal@skillbridge.in",
        "Phone: +91 80 4567-8901",
        "Address: 123 Brigade Road, 4th Floor, Bangalore, Karnataka 560025",
        "Our legal team is available to address concerns and questions.",
        "We aim to respond to inquiries within 48 hours."
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
              <Scale className="w-6 h-6 text-primary" />
            </div>
            <h1 className="text-4xl font-bold text-foreground">Terms of Service</h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-4">
            These terms govern your use of SkillBridge. Please read them carefully before using our platform.
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

        {/* Terms Content */}
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

        {/* Agreement Section */}
        <Card className="mt-12">
          <CardHeader>
            <CardTitle className="text-xl">Agreement to Terms</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-6">
              By using SkillBridge, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service.
              If you do not agree to these terms, please do not use our platform.
            </p>
            <div className="bg-muted/50 rounded-lg p-4">
              <p className="text-sm text-muted-foreground">
                <strong>Important:</strong> These terms contain important legal information including arbitration agreements,
                limitation of liability, and indemnification provisions. Please read them carefully. If you have questions,
                contact our legal team at legal@skillbridge.in.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Footer Actions */}
        <div className="mt-12 text-center">
          <div className="bg-muted/50 rounded-2xl p-8">
            <FileText className="w-12 h-12 text-primary mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-foreground mb-4">
              Questions About These Terms?
            </h2>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              If you have any questions about these Terms of Service or need clarification,
              our legal team is here to help.
            </p>
            <div className="flex gap-4 justify-center">
              <Button asChild>
                <Link href="/contact">
                  Contact Legal Team
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/privacy-policy">View Privacy Policy</Link>
              </Button>
            </div>
          </div>
        </div>

        {/* Related Documents */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="text-center">
            <CardContent className="pt-6">
              <Scale className="w-8 h-8 text-primary mx-auto mb-3" />
              <h3 className="font-semibold mb-2">Legal Compliance</h3>
              <p className="text-sm text-muted-foreground">
                We comply with all applicable laws and regulations.
              </p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardContent className="pt-6">
              <FileText className="w-8 h-8 text-primary mx-auto mb-3" />
              <h3 className="font-semibold mb-2">User Rights</h3>
              <p className="text-sm text-muted-foreground">
                Clear terms protect both students and businesses.
              </p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardContent className="pt-6">
              <ArrowRight className="w-8 h-8 text-primary mx-auto mb-3" />
              <h3 className="font-semibold mb-2">Fair Platform</h3>
              <p className="text-sm text-muted-foreground">
                Terms ensure fair treatment for all users.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}