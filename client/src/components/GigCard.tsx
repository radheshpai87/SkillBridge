import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MapPin, DollarSign, Briefcase } from 'lucide-react';
import type { Gig } from '@shared/types';

interface GigCardProps {
  gig: Gig;
  onApply?: (gigId: string) => void;
  onManage?: (gigId: string) => void;
  isApplied?: boolean;
  isOwner?: boolean;
  applicantCount?: number;
}

export function GigCard({ gig, onApply, onManage, isApplied, isOwner, applicantCount }: GigCardProps) {
  return (
    <Card className="hover-elevate transition-all duration-200 overflow-visible" data-testid={`card-gig-${gig.id}`}>
      <CardHeader className="space-y-3">
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-xl font-semibold text-foreground line-clamp-2" data-testid={`text-gig-title-${gig.id}`}>
            {gig.title}
          </h3>
          <Badge variant="secondary" className="shrink-0 font-semibold">
            <DollarSign className="w-3 h-3" />
            {gig.budget}
          </Badge>
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
            disabled={isApplied}
            className="w-full"
            data-testid={`button-apply-${gig.id}`}
          >
            {isApplied ? 'Already Applied' : 'Apply Now'}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
