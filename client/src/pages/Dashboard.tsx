import { useAuth } from '@/contexts/AuthContext';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Navbar } from '@/components/Navbar';
import { GigCard } from '@/components/GigCard';
import { SkillBadge } from '@/components/SkillBadge';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { queryClient, apiRequest } from '@/lib/queryClient';
import { Briefcase, TrendingUp, Users, CheckCircle } from 'lucide-react';
import type { Gig } from '@shared/types';

export default function Dashboard() {
  const { user } = useAuth();
  const { toast } = useToast();

  const { data: gigs, isLoading } = useQuery<Gig[]>({
    queryKey: ['/api/gigs/all'],
  });

  const { data: matchedGigs } = useQuery<Gig[]>({
    queryKey: ['/api/gigs/matched'],
    enabled: user?.role === 'student',
  });

  const applyMutation = useMutation({
    mutationFn: async (gigId: string) => {
      return apiRequest('POST', `/api/gigs/apply/${gigId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/gigs/all'] });
      queryClient.invalidateQueries({ queryKey: ['/api/gigs/matched'] });
      toast({
        title: 'Application submitted!',
        description: 'The business will review your application.',
      });
    },
    onError: () => {
      toast({
        title: 'Application failed',
        description: 'Please try again later.',
        variant: 'destructive',
      });
    },
  });

  if (!user) return null;

  const userSkills = user.skills || [];
  const myGigs = gigs?.filter(g => g.postedBy === user.id) || [];
  const applicantCounts = myGigs.reduce((acc, gig) => {
    const applicants = Array.isArray(gig.applicants) ? gig.applicants : [];
    acc[gig.id] = applicants.length;
    return acc;
  }, {} as Record<string, number>);

  const totalApplicants = Object.values(applicantCounts).reduce((sum, count) => sum + count, 0);

  const handleApply = (gigId: string) => {
    applyMutation.mutate(gigId);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2" data-testid="text-welcome">
            Welcome back, {user.name}! 👋
          </h1>
          <p className="text-lg text-muted-foreground">
            {user.role === 'student' 
              ? "Discover opportunities that match your skills" 
              : "Manage your posted opportunities"}
          </p>
        </div>

        {/* Student Dashboard */}
        {user.role === 'student' && (
          <div className="space-y-8">
            {/* Profile Card */}
            <Card className="overflow-visible">
              <CardHeader>
                <h2 className="text-2xl font-bold text-foreground">Your Profile</h2>
              </CardHeader>
              <CardContent className="space-y-4">
                {user.bio && (
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-2">Bio</h3>
                    <p className="text-foreground" data-testid="text-bio">{user.bio}</p>
                  </div>
                )}
                
                {userSkills.length > 0 && (
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-3">Skills</h3>
                    <div className="flex flex-wrap gap-2">
                      {userSkills.map((skill: string) => (
                        <SkillBadge key={skill} skill={skill} />
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Matched Gigs */}
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-secondary">
                  <Briefcase className="w-6 h-6 text-primary-foreground" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-foreground">Matched Opportunities</h2>
                  <p className="text-sm text-muted-foreground">Gigs that match your skills</p>
                </div>
              </div>

              {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[...Array(3)].map((_, i) => (
                    <Card key={i} className="overflow-visible">
                      <CardHeader>
                        <Skeleton className="h-6 w-3/4" />
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-2/3" />
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : matchedGigs && matchedGigs.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {matchedGigs.map((gig) => {
                    const applicants = Array.isArray(gig.applicants) ? gig.applicants : [];
                    return (
                      <GigCard
                        key={gig.id}
                        gig={gig}
                        onApply={handleApply}
                        isApplied={applicants.includes(user.id)}
                      />
                    );
                  })}
                </div>
              ) : (
                <Card className="overflow-visible">
                  <CardContent className="py-12 text-center">
                    <Briefcase className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                    <h3 className="text-xl font-semibold text-foreground mb-2">No matched gigs yet</h3>
                    <p className="text-muted-foreground mb-6">
                      Add more skills to your profile or browse all available gigs
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        )}

        {/* Business Dashboard */}
        {user.role === 'business' && (
          <div className="space-y-8">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="overflow-visible">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Posted Gigs</p>
                      <p className="text-3xl font-bold text-foreground mt-2" data-testid="text-posted-count">
                        {myGigs.length}
                      </p>
                    </div>
                    <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10">
                      <Briefcase className="w-6 h-6 text-primary" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="overflow-visible">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Total Applicants</p>
                      <p className="text-3xl font-bold text-foreground mt-2" data-testid="text-applicant-total">
                        {totalApplicants}
                      </p>
                    </div>
                    <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-secondary/10">
                      <Users className="w-6 h-6 text-secondary" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="overflow-visible">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Active Gigs</p>
                      <p className="text-3xl font-bold text-foreground mt-2" data-testid="text-active-count">
                        {myGigs.length}
                      </p>
                    </div>
                    <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-accent">
                      <TrendingUp className="w-6 h-6 text-accent-foreground" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Posted Gigs */}
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-secondary">
                  <CheckCircle className="w-6 h-6 text-primary-foreground" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-foreground">Your Posted Gigs</h2>
                  <p className="text-sm text-muted-foreground">Manage your opportunities</p>
                </div>
              </div>

              {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[...Array(3)].map((_, i) => (
                    <Card key={i} className="overflow-visible">
                      <CardHeader>
                        <Skeleton className="h-6 w-3/4" />
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-2/3" />
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : myGigs.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {myGigs.map((gig) => (
                    <GigCard
                      key={gig.id}
                      gig={gig}
                      isOwner
                      applicantCount={applicantCounts[gig.id]}
                    />
                  ))}
                </div>
              ) : (
                <Card className="overflow-visible">
                  <CardContent className="py-12 text-center">
                    <Briefcase className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                    <h3 className="text-xl font-semibold text-foreground mb-2">No gigs posted yet</h3>
                    <p className="text-muted-foreground mb-6">
                      Start posting opportunities to connect with talented students
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
