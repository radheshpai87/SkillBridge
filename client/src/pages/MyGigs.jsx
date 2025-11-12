import { useQuery, useMutation } from '@tanstack/react-query';
import { queryClient, apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Loader2, Briefcase, Users, CheckCircle2, XCircle, Clock, User, Mail } from 'lucide-react';
import { format } from 'date-fns';
import { useLocation } from 'wouter';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

export default function MyGigs() {
  const { toast } = useToast();
  const [, setLocation] = useLocation();

  const { data: gigs = [], isLoading } = useQuery({
    queryKey: ['/api/gigs/my'],
  });

  const updateApplicationMutation = useMutation({
    mutationFn: async ({ applicationId, status }) => {
      const response = await fetch(`/api/applications/${applicationId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ status }),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to update application status');
      }
      
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/gigs/my'] });
      toast({
        title: 'Application updated',
        description: 'The application status has been updated successfully.',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to update application status',
        variant: 'destructive',
      });
    },
  });

  const handleStatusUpdate = (applicationId, status) => {
    updateApplicationMutation.mutate({ applicationId, status });
  };

  const getInitials = (name) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'accepted':
        return <CheckCircle2 className="w-4 h-4" />;
      case 'rejected':
        return <XCircle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const getStatusVariant = (status) => {
    switch (status) {
      case 'accepted':
        return 'default';
      case 'rejected':
        return 'destructive';
      default:
        return 'secondary';
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-primary" data-testid="loader-my-gigs" />
      </div>
    );
  }

  const totalApplications = gigs.reduce((sum, gig) => sum + (gig.applications?.length || 0), 0);
  const pendingCount = gigs.reduce(
    (sum, gig) => sum + (gig.applications?.filter(app => app.status === 'pending').length || 0),
    0
  );
  const acceptedCount = gigs.reduce(
    (sum, gig) => sum + (gig.applications?.filter(app => app.status === 'accepted').length || 0),
    0
  );

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2" data-testid="heading-my-gigs">
            My Gigs
          </h1>
          <p className="text-muted-foreground">
            Manage your posted gigs and review applications
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card data-testid="card-total-applications">
            <CardHeader className="flex flex-row items-center justify-between gap-1 space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Applications</CardTitle>
              <Users className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold" data-testid="text-total-applications">
                {totalApplications}
              </div>
            </CardContent>
          </Card>

          <Card data-testid="card-pending-applications">
            <CardHeader className="flex flex-row items-center justify-between gap-1 space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Review</CardTitle>
              <Clock className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-500" data-testid="text-pending-applications">
                {pendingCount}
              </div>
            </CardContent>
          </Card>

          <Card data-testid="card-accepted-applications">
            <CardHeader className="flex flex-row items-center justify-between gap-1 space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Accepted</CardTitle>
              <CheckCircle2 className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600 dark:text-green-500" data-testid="text-accepted-applications">
                {acceptedCount}
              </div>
            </CardContent>
          </Card>
        </div>

        {gigs.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-16">
              <Briefcase className="w-16 h-16 text-muted-foreground mb-4" />
              <h3 className="text-xl font-semibold mb-2">No Gigs Posted Yet</h3>
              <p className="text-muted-foreground text-center mb-6">
                Get started by posting your first gig opportunity
              </p>
              <Button onClick={() => setLocation('/browse')} data-testid="button-post-gig">
                Post Your First Gig
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {gigs.map((gig) => (
              <Card key={gig.id} data-testid={`card-gig-${gig.id}`}>
                <CardHeader>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <CardTitle className="text-xl mb-2" data-testid={`text-gig-title-${gig.id}`}>
                        {gig.title}
                      </CardTitle>
                      <CardDescription>{gig.description}</CardDescription>
                      <div className="flex flex-wrap gap-4 mt-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <span className="font-medium">Budget:</span>
                          <span data-testid={`text-gig-budget-${gig.id}`}>${gig.budget}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <span className="font-medium">Location:</span>
                          <span data-testid={`text-gig-location-${gig.id}`}>{gig.location}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <span className="font-medium">Applications:</span>
                          <Badge variant="secondary" data-testid={`badge-application-count-${gig.id}`}>
                            {gig.applications?.length || 0}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardHeader>

                {gig.applications && gig.applications.length > 0 && (
                  <CardContent>
                    <Accordion type="single" collapsible className="w-full">
                      <AccordionItem value="applications">
                        <AccordionTrigger data-testid={`button-toggle-applications-${gig.id}`}>
                          View Applications ({gig.applications.length})
                        </AccordionTrigger>
                        <AccordionContent>
                          <div className="space-y-4">
                            {gig.applications.map((application) => (
                              <Card key={application.id} data-testid={`card-application-${application.id}`}>
                                <CardContent className="p-4">
                                  <div className="flex items-start gap-4">
                                    <Avatar className="w-12 h-12">
                                      <AvatarFallback className="bg-primary text-primary-foreground">
                                        {application.student ? getInitials(application.student.name) : '??'}
                                      </AvatarFallback>
                                    </Avatar>

                                    <div className="flex-1">
                                      <div className="flex items-start justify-between gap-4 mb-2">
                                        <div>
                                          <h4 className="font-semibold text-foreground" data-testid={`text-student-name-${application.id}`}>
                                            {application.student?.name || 'Unknown Student'}
                                          </h4>
                                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                            <Mail className="w-3 h-3" />
                                            <span data-testid={`text-student-email-${application.id}`}>
                                              {application.student?.email}
                                            </span>
                                          </div>
                                        </div>
                                        <Badge variant={getStatusVariant(application.status)} data-testid={`badge-status-${application.id}`}>
                                          <span className="flex items-center gap-1">
                                            {getStatusIcon(application.status)}
                                            {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                                          </span>
                                        </Badge>
                                      </div>

                                      {application.student?.skills && application.student.skills.length > 0 && (
                                        <div className="flex flex-wrap gap-2 mb-3">
                                          {application.student.skills.map((skill, idx) => (
                                            <Badge key={idx} variant="outline" className="text-xs">
                                              {skill}
                                            </Badge>
                                          ))}
                                        </div>
                                      )}

                                      {application.student?.bio && (
                                        <p className="text-sm text-muted-foreground mb-3">
                                          {application.student.bio}
                                        </p>
                                      )}

                                      <div className="flex items-center justify-between">
                                        <span className="text-xs text-muted-foreground">
                                          Applied {format(new Date(application.createdAt), 'MMM d, yyyy')}
                                        </span>

                                        {application.status === 'pending' && (
                                          <div className="flex gap-2">
                                            <Button
                                              size="sm"
                                              variant="default"
                                              onClick={() => handleStatusUpdate(application.id, 'accepted')}
                                              disabled={updateApplicationMutation.isPending}
                                              data-testid={`button-accept-${application.id}`}
                                            >
                                              <CheckCircle2 className="w-4 h-4 mr-1" />
                                              Accept
                                            </Button>
                                            <Button
                                              size="sm"
                                              variant="destructive"
                                              onClick={() => handleStatusUpdate(application.id, 'rejected')}
                                              disabled={updateApplicationMutation.isPending}
                                              data-testid={`button-reject-${application.id}`}
                                            >
                                              <XCircle className="w-4 h-4 mr-1" />
                                              Reject
                                            </Button>
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                </CardContent>
                              </Card>
                            ))}
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  </CardContent>
                )}
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
