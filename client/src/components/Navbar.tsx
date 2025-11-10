import { Link, useLocation } from 'wouter';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Briefcase, LogOut, User } from 'lucide-react';
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

  const getInitials = (name: string) => {
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
          <Link href={isAuthenticated ? "/dashboard" : "/"}>
            <a className="flex items-center space-x-2 hover-elevate active-elevate-2 px-3 py-2 rounded-lg transition-all" data-testid="link-logo">
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-secondary">
                <Briefcase className="w-6 h-6 text-primary-foreground" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                SkillBridge
              </span>
            </a>
          </Link>

          {isAuthenticated && user && (
            <div className="flex items-center space-x-4">
              <Link href="/dashboard">
                <a
                  className={`px-4 py-2 rounded-lg font-medium transition-all hover-elevate active-elevate-2 ${
                    location === '/dashboard' ? 'bg-accent text-accent-foreground' : 'text-foreground'
                  }`}
                  data-testid="link-dashboard"
                >
                  Dashboard
                </a>
              </Link>
              <Link href="/browse">
                <a
                  className={`px-4 py-2 rounded-lg font-medium transition-all hover-elevate active-elevate-2 ${
                    location === '/browse' ? 'bg-accent text-accent-foreground' : 'text-foreground'
                  }`}
                  data-testid="link-browse"
                >
                  {user.role === 'business' ? 'Post Gig' : 'Browse Gigs'}
                </a>
              </Link>

              <ThemeToggle />

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="hover-elevate active-elevate-2 rounded-full transition-all" data-testid="button-user-menu">
                    <Avatar className="w-10 h-10 border-2 border-primary">
                      <AvatarFallback className="bg-gradient-to-br from-primary to-secondary text-primary-foreground font-semibold">
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
                <Button variant="ghost" data-testid="button-login">Login</Button>
              </Link>
              <Link href="/register">
                <Button data-testid="button-register">Get Started</Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
