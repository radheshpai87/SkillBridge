import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { queryClient, apiRequest } from '@/lib/queryClient';
import { CheckCircle, XCircle, User } from 'lucide-react';

const statusVariants = {
  pending: 'default',
  accepted: 'outline',
  rejected: 'destructive',
  completed: 'secondary',
};

export function ManageGigDialog({ gigId, gigTitle, open, onOpenChange }) {
  const { toast } = useToast();

  const { data: applications, isLoading } = useQuery({
    queryKey: [`/api/applications/gig/${gigId}`],
    enabled: open && !!gigId,
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ applicationId, status }) => {
      return apiRequest('PATCH', `/api/applications/${applicationId}/status`, { status });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/applications/gig/${gigId}`] });
      queryClient.invalidateQueries({ queryKey: ['/api/applications/my'] });
      queryClient.invalidateQueries({ queryKey: ['/api/gigs/all'] });
      toast({
        title: 'Status updated!',
        description: 'Application status has been updated successfully.',
      });
    },
    onError: () => {
      toast({
        title: 'Update failed',
        description: 'Failed to update application status.',
        variant: 'destructive',
      });
    },
  });

  const handleAccept = (applicationId) => {
    updateStatusMutation.mutate({ applicationId, status: 'accepted' });
  };

  const handleReject = (applicationId) => {
    updateStatusMutation.mutate({ applicationId, status: 'rejected' });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto" data-testid="dialog-manage-gig">
        <DialogHeader>
          <DialogTitle className="text-2xl">Manage Applicants</DialogTitle>
          <DialogDescription>{gigTitle}</DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <Card key={i}>
                <CardContent className="p-4">
                  <Skeleton className="h-4 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-1/2" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : applications && applications.length > 0 ? (
          <div className="space-y-4">
            {applications.map((app) => (
              <Card key={app.id} className="overflow-visible" data-testid={`card-applicant-${app.id}`}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-muted-foreground" />
                        <span className="font-medium text-foreground" data-testid={`text-applicant-email-${app.id}`}>
                          {app.student?.email || app.studentId}
                        </span>
                      </div>
                      {app.student?.skills && app.student.skills.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {app.student.skills.map((skill) => (
                            <Badge key={skill} variant="secondary" className="text-xs">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      )}
                      {app.student?.bio && (
                        <p className="text-sm text-muted-foreground">{app.student.bio}</p>
                      )}
                      <div className="flex items-center gap-2">
                        <Badge variant={statusVariants[app.status]} data-testid={`badge-applicant-status-${app.id}`}>
                          {app.status}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          Applied {app.createdAt ? new Date(app.createdAt).toLocaleDateString() : 'Recently'}
                        </span>
                      </div>
                    </div>

                    {app.status === 'pending' && (
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleAccept(app.id)}
                          disabled={updateStatusMutation.isPending}
                          className="bg-green-50 dark:bg-green-950 hover:bg-green-100 dark:hover:bg-green-900 text-green-700 dark:text-green-300 border-green-300 dark:border-green-700"
                          data-testid={`button-accept-${app.id}`}
                        >
                          <CheckCircle className="w-4 h-4 mr-1" />
                          Accept
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleReject(app.id)}
                          disabled={updateStatusMutation.isPending}
                          data-testid={`button-reject-${app.id}`}
                        >
                          <XCircle className="w-4 h-4 mr-1" />
                          Reject
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <User className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold text-foreground mb-2">No applicants yet</h3>
            <p className="text-sm text-muted-foreground">
              Applications will appear here when students apply to your gig.
            </p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
