import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Briefcase } from 'lucide-react';

interface PublicHeaderProps {
  showCTA?: boolean;
}

export function PublicHeader({ showCTA = true }: PublicHeaderProps) {
  return (
    <nav className="border-b bg-card">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/">
            <a className="flex items-center space-x-2 hover-elevate active-elevate-2 px-3 py-2 rounded-lg transition-all" data-testid="link-logo">
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-secondary">
                <Briefcase className="w-6 h-6 text-primary-foreground" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                SkillBridge
              </span>
            </a>
          </Link>

          <div className="flex items-center space-x-3">
            <ThemeToggle />
            {showCTA && (
              <>
                <Link href="/login">
                  <Button variant="ghost" data-testid="button-login">Login</Button>
                </Link>
                <Link href="/register">
                  <Button data-testid="button-register">Get Started</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
