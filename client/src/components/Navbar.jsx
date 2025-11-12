import { Link, useLocation } from 'wouter';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Briefcase, LogOut, User, ClipboardList } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

export function Navbar() {
  const { user, logout, isAuthenticated } = useAuth();
  const [location, setLocation] = useLocation();

  const handleLogout = () => {
    logout();
    setLocation('/login');
  };

  const getInitials = (name) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <nav className="border-b bg-card">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href={isAuthenticated ? "/dashboard" : "/"} className="flex items-center space-x-2 hover-elevate active-elevate-2 px-3 py-2 rounded-lg transition-all" data-testid="link-logo">
            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary">
              <Briefcase className="w-6 h-6 text-primary-foreground" />
            </div>
            <span className="text-2xl font-bold text-foreground">
              SkillBridge
            </span>
          </Link>

          {isAuthenticated && user && (
            <div className="flex items-center space-x-4">
              <Link 
                href="/dashboard"
                className={`px-4 py-2 rounded-lg font-medium transition-all hover-elevate active-elevate-2 ${
                  location === '/dashboard' ? 'bg-accent text-accent-foreground' : 'text-foreground'
                }`}
                data-testid="link-dashboard"
              >
                Dashboard
              </Link>
              <Link 
                href="/browse"
                className={`px-4 py-2 rounded-lg font-medium transition-all hover-elevate active-elevate-2 ${
                  location === '/browse' ? 'bg-accent text-accent-foreground' : 'text-foreground'
                }`}
                data-testid="link-browse"
              >
                {user.role === 'business' ? 'Post Gig' : 'Browse Gigs'}
              </Link>

              {user.role === 'student' && (
                <Link 
                  href="/my-applications"
                  className={`px-4 py-2 rounded-lg font-medium transition-all hover-elevate active-elevate-2 ${
                    location === '/my-applications' ? 'bg-accent text-accent-foreground' : 'text-foreground'
                  }`}
                  data-testid="link-my-applications"
                >
                  My Applications
                </Link>
              )}

              {user.role === 'business' && (
                <Link 
                  href="/my-gigs"
                  className={`px-4 py-2 rounded-lg font-medium transition-all hover-elevate active-elevate-2 ${
                    location === '/my-gigs' ? 'bg-accent text-accent-foreground' : 'text-foreground'
                  }`}
                  data-testid="link-my-gigs"
                >
                  My Gigs
                </Link>
              )}

              <ThemeToggle />

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="hover-elevate active-elevate-2 rounded-full transition-all" data-testid="button-user-menu">
                    <Avatar className="w-10 h-10 border-2 border-primary">
                      <AvatarFallback className="bg-primary text-primary-foreground font-semibold">
                        {getInitials(user.name)}
                      </AvatarFallback>
                    </Avatar>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <div className="px-2 py-2 border-b">
                    <p className="font-semibold text-foreground" data-testid="text-username">{user.name}</p>
                    <p className="text-sm text-muted-foreground" data-testid="text-email">{user.email}</p>
                    <p className="text-xs text-muted-foreground mt-1 capitalize">
                      {user.role === 'student' ? '🎓 Student' : '🏢 Business'}
                    </p>
                  </div>
                  <DropdownMenuItem onClick={handleLogout} data-testid="button-logout">
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )}

          {!isAuthenticated && (
            <div className="flex items-center space-x-3">
              <ThemeToggle />
              <Link href="/login">
                <Button variant="ghost" data-testid="button-login" asChild>
                  <span>Login</span>
                </Button>
              </Link>
              <Link href="/register">
                <Button data-testid="button-register" asChild>
                  <span>Get Started</span>
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
