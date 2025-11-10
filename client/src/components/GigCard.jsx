import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MapPin, DollarSign, Briefcase } from 'lucide-react';
import type { Gig, Application } from '@shared/types';

interface GigCardProps {
  gig;
  onApply?: (gigId) => void;
  onManage?: (gigId) => void;
  applicationStatus?: Application['status'];
  applicationId?;
  isOwner?: boolean;
  applicantCount?: number;
}

const statusVariants: Record<Application['status'], 'default' | 'secondary' | 'destructive' | 'outline'> = {
  pending: 'default',
  accepted: 'outline',
  rejected: 'destructive',
  completed: 'secondary',
};

const statusLabels: Record<Application['status'], string> = {
  pending: 'Pending',
  accepted: 'Accepted',
  rejected: 'Rejected',
  completed: 'Completed',
};

export function GigCard({ gig, onApply, onManage, applicationStatus, applicationId, isOwner, applicantCount }CardProps) {
  return (
    <Card className="hover-elevate transition-all duration-200 overflow-visible" data-testid={`card-gig-${gig.id}`}>
      <CardHeader className="space-y-3">
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-xl font-semibold text-foreground line-clamp-2" data-testid={`text-gig-title-${gig.id}`}>
            {gig.title}
          </h3>
          <div className="flex gap-2 shrink-0">
            {applicationStatus && (
              <Badge 
                variant={statusVariants[applicationStatus]} 
                className={applicationStatus === 'accepted' ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-100 border-green-300 dark:border-green-700' : ''}
                data-testid={`badge-status-${gig.id}`}
              >
                {statusLabels[applicationStatus]}
              </Badge>
            )}
            <Badge variant="secondary" className="font-semibold">
              <DollarSign className="w-3 h-3" />
              {gig.budget}
            </Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground line-clamp-3" data-testid={`text-gig-description-${gig.id}`}>
          {gig.description}
        </p>

        <div className="flex items-center text-sm text-muted-foreground">
          <MapPin className="w-4 h-4 mr-1.5 text-primary" />
          <span data-testid={`text-gig-location-${gig.id}`}>{gig.location}</span>
        </div>

        {isOwner && applicantCount !== undefined && (
          <div className="flex items-center text-sm text-muted-foreground">
            <Briefcase className="w-4 h-4 mr-1.5 text-secondary" />
            <span data-testid={`text-applicant-count-${gig.id}`}>
              {applicantCount} {applicantCount === 1 ? 'applicant' : 'applicants'}
            </span>
          </div>
        )}
      </CardContent>

      <CardFooter>
        {isOwner ? (
          <Button 
            onClick={() => onManage?.(gig.id)} 
            variant="outline" 
            className="w-full"
            data-testid={`button-manage-${gig.id}`}
          >
            Manage Gig
          </Button>
        ) : (
          <Button
            onClick={() => onApply?.(gig.id)}
            disabled={!!applicationStatus}
            className="w-full"
            data-testid={`button-apply-${gig.id}`}
          >
            {applicationStatus ? 
              (applicationStatus === 'accepted' ? 'Accepted ✓' : 
               applicationStatus === 'rejected' ? 'Rejected' :
               applicationStatus === 'completed' ? 'Completed' :
               'Applied') 
              : 'Apply Now'}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
