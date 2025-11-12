import { useAuth } from '@/contexts/AuthContext';
import { useQuery } from '@tanstack/react-query';
import { useLocation } from 'wouter';
import { Navbar } from '@/components/Navbar';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ClipboardList, DollarSign, MapPin, Calendar, CheckCircle2, XCircle, Clock, FileText, AlertCircle, ArrowLeft } from 'lucide-react';

export default function MyApplications() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();

  const { data: applications, isLoading } = useQuery({
    queryKey: ['/api/applications/my'],
    enabled: user?.role === 'student',
  });

  if (!user || user.role !== 'student') {
    return null;
  }

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { variant: 'secondary', icon: Clock, label: 'Pending' },
      accepted: { variant: 'default', icon: CheckCircle2, label: 'Accepted' },
      rejected: { variant: 'destructive', icon: XCircle, label: 'Rejected' },
      completed: { variant: 'outline', icon: CheckCircle2, label: 'Completed' },
    };

    const config = statusConfig[status] || statusConfig.pending;
    const Icon = config.icon;

    return (
      <Badge variant={config.variant} className="gap-1">
        <Icon className="w-3 h-3" />
        {config.label}
      </Badge>
    );
  };

  const groupedApplications = applications?.reduce((acc, app) => {
    const status = app.status || 'pending';
    if (!acc[status]) acc[status] = [];
    acc[status].push(app);
    return acc;
  }, {}) || {};

  const statusOrder = ['pending', 'accepted', 'rejected', 'completed'];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between gap-3 mb-8">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-primary">
              <ClipboardList className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-foreground">My Applications</h1>
              <p className="text-muted-foreground mt-1">
                Track all your gig applications in one place
              </p>
            </div>
          </div>
          <Button
            variant="outline"
            onClick={() => setLocation('/dashboard')}
            className="gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Button>
        </div>

        {/* Summary Cards */}
        {!isLoading && applications && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <Card className="overflow-visible">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total</p>
                    <p className="text-3xl font-bold text-foreground">{applications.length}</p>
                  </div>
                  <FileText className="w-8 h-8 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>

            <Card className="overflow-visible">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Pending</p>
                    <p className="text-3xl font-bold text-foreground">{groupedApplications.pending?.length || 0}</p>
                  </div>
                  <Clock className="w-8 h-8 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>

            <Card className="overflow-visible">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Accepted</p>
                    <p className="text-3xl font-bold text-green-600 dark:text-green-500">{groupedApplications.accepted?.length || 0}</p>
                  </div>
                  <CheckCircle2 className="w-8 h-8 text-green-600 dark:text-green-500" />
                </div>
              </CardContent>
            </Card>

            <Card className="overflow-visible">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Rejected</p>
                    <p className="text-3xl font-bold text-destructive">{groupedApplications.rejected?.length || 0}</p>
                  </div>
                  <XCircle className="w-8 h-8 text-destructive" />
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Applications List */}
        <div className="space-y-6">
          {isLoading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <Card key={i} className="overflow-visible">
                  <CardHeader>
                    <Skeleton className="h-6 w-3/4" />
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-2/3" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : applications && applications.length > 0 ? (
            statusOrder.map(status => {
              const apps = groupedApplications[status];
              if (!apps || apps.length === 0) return null;

              return (
                <div key={status}>
                  <h2 className="text-xl font-semibold text-foreground mb-4 capitalize flex items-center gap-2">
                    {getStatusBadge(status)}
                    <span className="text-muted-foreground text-sm">({apps.length})</span>
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {apps.map((app) => (
                      <Card key={app.id} className="overflow-visible hover-elevate" data-testid={`card-application-${app.id}`}>
                        <CardHeader>
                          <div className="flex items-start justify-between gap-2">
                            <CardTitle className="text-xl" data-testid="text-gig-title">{app.gig?.title}</CardTitle>
                            {getStatusBadge(app.status)}
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <p className="text-muted-foreground line-clamp-2" data-testid="text-gig-description">
                            {app.gig?.description}
                          </p>

                          <Separator />

                          <div className="space-y-2">
                            <div className="flex items-center gap-2 text-sm">
                              <DollarSign className="w-4 h-4 text-muted-foreground" />
                              <span className="font-semibold text-foreground">${app.gig?.budget}</span>
                            </div>

                            <div className="flex items-center gap-2 text-sm">
                              <MapPin className="w-4 h-4 text-muted-foreground" />
                              <span className="text-muted-foreground">{app.gig?.location}</span>
                            </div>

                            <div className="flex items-center gap-2 text-sm">
                              <Calendar className="w-4 h-4 text-muted-foreground" />
                              <span className="text-muted-foreground">
                                Applied {new Date(app.createdAt).toLocaleDateString()}
                              </span>
                            </div>
                          </div>

                          {app.gig?.postedByUser && (
                            <>
                              <Separator />
                              <div className="text-sm">
                                <p className="text-muted-foreground">Posted by</p>
                                <p className="font-medium text-foreground">{app.gig.postedByUser.companyName || app.gig.postedByUser.name}</p>
                              </div>
                            </>
                          )}

                          {app.applicationMessage && (
                            <>
                              <Separator />
                              <div className="text-sm">
                                <p className="text-muted-foreground font-medium mb-1.5">Your Application:</p>
                                <div className="p-3 bg-muted rounded-lg">
                                  <p className="text-foreground whitespace-pre-wrap">{app.applicationMessage}</p>
                                </div>
                              </div>
                            </>
                          )}

                          {app.status === 'rejected' && app.rejectionReason && (
                            <>
                              <Separator />
                              <Alert variant="destructive" className="border-destructive/50">
                                <AlertCircle className="h-4 w-4" />
                                <AlertDescription className="ml-2">
                                  <p className="text-sm font-medium mb-1">Rejection Reason:</p>
                                  <p className="text-sm">{app.rejectionReason}</p>
                                </AlertDescription>
                              </Alert>
                            </>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              );
            })
          ) : (
            <Card className="overflow-visible">
              <CardContent className="py-16 text-center">
                <ClipboardList className="w-20 h-20 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-2xl font-semibold text-foreground mb-2">
                  No applications yet
                </h3>
                <p className="text-muted-foreground mb-6">
                  Start applying to gigs to see them here
                </p>
                <Button asChild>
                  <a href="/browse" data-testid="link-browse-gigs">
                    Browse Gigs
                  </a>
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
