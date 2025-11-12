import { useAuth } from '@/contexts/AuthContext';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useLocation } from 'wouter';
import { Navbar } from '@/components/Navbar';
import { GigCard } from '@/components/GigCard';
import { SkillBadge } from '@/components/SkillBadge';
import { ManageGigDialog } from '@/components/ManageGigDialog';
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { queryClient, apiRequest } from '@/lib/queryClient';
import { 
  Briefcase, 
  TrendingUp, 
  Users, 
  CheckCircle, 
  Clock, 
  XCircle, 
  Award,
  Target,
  Eye,
  Calendar,
  DollarSign,
  Activity,
  Star,
  Plus
} from 'lucide-react';
import { useMemo, useState } from 'react';

export default function Dashboard() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [manageGig, setManageGig] = useState(null);

  const { data: gigs, isLoading } = useQuery({
    queryKey: ['/api/gigs/all'],
  });

  const { data: matchedGigs } = useQuery({
    queryKey: ['/api/gigs/matched'],
    enabled: user?.role === 'student',
  });

  const { data: myApplications } = useQuery({
    queryKey: ['/api/applications/my'],
    enabled: user?.role === 'student',
  });

  const applicationsByGig = useMemo(() => {
    if (!myApplications) return {};
    return myApplications.reduce((acc, app) => {
      acc[app.gigId] = app;
      return acc;
    }, {});
  }, [myApplications]);

  // Student Statistics
  const studentStats = useMemo(() => {
    if (!myApplications || !Array.isArray(myApplications) || user?.role !== 'student') {
      return { total: 0, pending: 0, accepted: 0, rejected: 0, acceptanceRate: 0 };
    }
    
    const total = myApplications.length;
    const pending = myApplications.filter(app => app.status === 'pending').length;
    const accepted = myApplications.filter(app => app.status === 'accepted').length;
    const rejected = myApplications.filter(app => app.status === 'rejected').length;
    const acceptanceRate = total > 0 ? Math.round((accepted / total) * 100) : 0;
    
    return { total, pending, accepted, rejected, acceptanceRate };
  }, [myApplications, user?.role]);

  // Business Statistics
  const businessStats = useMemo(() => {
    if (!gigs || !Array.isArray(gigs) || !user?.id || user?.role !== 'business') {
      return { totalGigs: 0, totalApplicants: 0, avgApplicantsPerGig: 0, totalBudget: 0 };
    }
    
    const myGigs = gigs.filter(g => g.postedBy === user.id);
    const totalGigs = myGigs.length;
    const totalApplicants = myGigs.reduce((sum, gig) => {
      const applicants = Array.isArray(gig.applicants) ? gig.applicants : [];
      return sum + applicants.length;
    }, 0);
    const avgApplicantsPerGig = totalGigs > 0 ? Math.round(totalApplicants / totalGigs) : 0;
    
    // Calculate total budget offered
    const totalBudget = myGigs.reduce((sum, gig) => sum + (gig.budget || 0), 0);
    
    return { totalGigs, totalApplicants, avgApplicantsPerGig, totalBudget };
  }, [gigs, user?.id, user?.role]);

  const applyMutation = useMutation({
    mutationFn: async (gigId) => {
      return apiRequest('POST', `/api/applications/gig/${gigId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/gigs/all'] });
      queryClient.invalidateQueries({ queryKey: ['/api/gigs/matched'] });
      queryClient.invalidateQueries({ queryKey: ['/api/applications/my'] });
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
  }, {});

  const totalApplicants = Object.values(applicantCounts).reduce((sum, count) => sum + count, 0);

  const handleApply = (gigId) => {
    applyMutation.mutate(gigId);
  };

  const handleManage = (gigId) => {
    const gig = gigs?.find(g => g.id === gigId);
    if (gig) {
      setManageGig({ id: gig.id, title: gig.title });
    }
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
            {/* Student Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="overflow-visible">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Applications</p>
                      <p className="text-3xl font-bold text-foreground mt-2">
                        {studentStats?.total || 0}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">Total submitted</p>
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
                      <p className="text-sm font-medium text-muted-foreground">Pending</p>
                      <p className="text-3xl font-bold text-foreground mt-2">
                        {studentStats?.pending || 0}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">Under review</p>
                    </div>
                    <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-yellow-500/10">
                      <Clock className="w-6 h-6 text-yellow-600 dark:text-yellow-500" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="overflow-visible">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Accepted</p>
                      <p className="text-3xl font-bold text-foreground mt-2">
                        {studentStats?.accepted || 0}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">Successfully hired</p>
                    </div>
                    <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-green-500/10">
                      <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-500" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="overflow-visible">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Success Rate</p>
                      <p className="text-3xl font-bold text-foreground mt-2">
                        {studentStats?.acceptanceRate || 0}%
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">Acceptance rate</p>
                    </div>
                    <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-secondary/10">
                      <Target className="w-6 h-6 text-secondary" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Profile Card with Enhanced UI */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="overflow-visible lg:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Award className="w-5 h-5 text-primary" />
                    Your Profile
                  </CardTitle>
                  <CardDescription>Showcase your skills and experience</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {user.bio && (
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground mb-2">Bio</h3>
                      <p className="text-foreground leading-relaxed" data-testid="text-bio">{user.bio}</p>
                    </div>
                  )}
                  
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-sm font-medium text-muted-foreground">Skills</h3>
                      <Badge variant="secondary">{userSkills.length} skills</Badge>
                    </div>
                    {userSkills.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {userSkills.map((skill) => (
                          <SkillBadge key={skill} skill={skill} />
                        ))}
                      </div>
                    ) : (
                      <div className="text-sm text-muted-foreground italic bg-muted/30 p-4 rounded-lg">
                        💡 No skills added yet. Add skills to see matched opportunities!
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card className="overflow-visible">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="w-5 h-5 text-primary" />
                    Quick Actions
                  </CardTitle>
                  <CardDescription>Navigate to key sections</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button 
                    className="w-full justify-start gap-2" 
                    variant="outline"
                    onClick={() => setLocation('/browse')}
                  >
                    <Eye className="w-4 h-4" />
                    Browse All Gigs
                  </Button>
                  <Button 
                    className="w-full justify-start gap-2" 
                    variant="outline"
                    onClick={() => setLocation('/my-applications')}
                  >
                    <Calendar className="w-4 h-4" />
                    My Applications
                  </Button>
                  {matchedGigs && matchedGigs.length > 0 && (
                    <div className="pt-2 border-t">
                      <p className="text-sm text-muted-foreground mb-2">
                        <Star className="w-4 h-4 inline mr-1 text-yellow-500" />
                        {matchedGigs.length} new matches!
                      </p>
                      <Progress value={(matchedGigs.length / 10) * 100} className="h-2" />
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Matched Gigs */}
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-primary">
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
                    const application = applicationsByGig[gig.id];
                    return (
                      <GigCard
                        key={gig.id}
                        gig={gig}
                        onApply={handleApply}
                        applicationStatus={application?.status}
                        applicationId={application?.id}
                      />
                    );
                  })}
                </div>
              ) : (
                <Card className="overflow-visible">
                  <CardContent className="py-12 text-center">
                    <Briefcase className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                    <h3 className="text-xl font-semibold text-foreground mb-2">
                      {userSkills.length === 0 ? 'Add skills to see matches' : 'No matched gigs yet'}
                    </h3>
                    <p className="text-muted-foreground mb-6">
                      {userSkills.length === 0 
                        ? 'Add skills to your profile to see opportunities that match your expertise' 
                        : 'Try adding more skills to your profile or browse all available gigs'}
                    </p>
                    <Button 
                      variant="outline" 
                      onClick={() => setLocation('/browse')}
                      className="gap-2"
                    >
                      <Briefcase className="w-4 h-4" />
                      Browse All Gigs
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        )}

        {/* Business Dashboard */}
        {user.role === 'business' && (
          <div className="space-y-8">
            {/* Enhanced Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="overflow-visible">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Posted Gigs</p>
                      <p className="text-3xl font-bold text-foreground mt-2" data-testid="text-posted-count">
                        {businessStats?.totalGigs || 0}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">Total opportunities</p>
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
                        {businessStats?.totalApplicants || 0}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">All-time applications</p>
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
                      <p className="text-sm font-medium text-muted-foreground">Avg. Applicants</p>
                      <p className="text-3xl font-bold text-foreground mt-2">
                        {businessStats?.avgApplicantsPerGig || 0}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">Per gig</p>
                    </div>
                    <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-green-500/10">
                      <TrendingUp className="w-6 h-6 text-green-600 dark:text-green-500" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="overflow-visible">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Total Budget</p>
                      <p className="text-3xl font-bold text-foreground mt-2">
                        ₹{businessStats?.totalBudget || 0}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">Offered across gigs</p>
                    </div>
                    <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-yellow-500/10">
                      <DollarSign className="w-6 h-6 text-yellow-600 dark:text-yellow-500" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Company Overview */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="overflow-visible lg:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Award className="w-5 h-5 text-primary" />
                    Company Profile
                  </CardTitle>
                  <CardDescription>Your business information</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {user.companyName && (
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground mb-2">Company Name</h3>
                      <p className="text-lg font-semibold text-foreground">{user.companyName}</p>
                    </div>
                  )}
                  {user.description && (
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground mb-2">Description</h3>
                      <p className="text-foreground leading-relaxed">{user.description}</p>
                    </div>
                  )}
                  {!user.companyName && !user.description && (
                    <div className="text-sm text-muted-foreground italic bg-muted/30 p-4 rounded-lg">
                      💡 Add company details to attract more talent!
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Performance Insights */}
              <Card className="overflow-visible">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="w-5 h-5 text-primary" />
                    Performance
                  </CardTitle>
                  <CardDescription>Your hiring metrics</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm font-medium">Interest Rate</p>
                      <Badge variant="secondary">
                        {businessStats?.avgApplicantsPerGig || 0}/gig
                      </Badge>
                    </div>
                    <Progress 
                      value={Math.min((businessStats?.avgApplicantsPerGig || 0) * 20, 100)} 
                      className="h-2" 
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      {businessStats?.avgApplicantsPerGig >= 5 ? 'Excellent!' : 
                       businessStats?.avgApplicantsPerGig >= 3 ? 'Good' : 
                       'Keep posting!'}
                    </p>
                  </div>

                  <div className="pt-4 border-t space-y-3">
                    <Button 
                      className="w-full justify-start gap-2" 
                      variant="outline"
                      onClick={() => setLocation('/browse')}
                    >
                      <Plus className="w-4 h-4" />
                      Post New Gig
                    </Button>
                    <Button 
                      className="w-full justify-start gap-2" 
                      variant="outline"
                      onClick={() => setLocation('/browse')}
                    >
                      <Eye className="w-4 h-4" />
                      Browse Talent
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Posted Gigs */}
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-primary">
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
                      onManage={handleManage}
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

      <ManageGigDialog
        gigId={manageGig?.id || null}
        gigTitle={manageGig?.title || ''}
        open={!!manageGig}
        onOpenChange={(open) => !open && setManageGig(null)}
      />
    </div>
  );
}
