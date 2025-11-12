import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Briefcase } from 'lucide-react';

export function ApplyToGigDialog({ gig, open, onOpenChange, onSubmit, isSubmitting }) {
  const [applicationMessage, setApplicationMessage] = useState('');
  const charCount = applicationMessage.length;
  const minChars = 50;
  const maxChars = 1000;
  const isValid = charCount >= minChars && charCount <= maxChars;

  const handleSubmit = () => {
    if (isValid) {
      onSubmit(gig.id, applicationMessage);
      setApplicationMessage('');
    }
  };

  const handleClose = (open) => {
    onOpenChange(open);
    if (!open) {
      setApplicationMessage('');
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10">
              <Briefcase className="w-5 h-5 text-primary" />
            </div>
            <div className="flex-1">
              <DialogTitle className="text-left">Apply to Gig</DialogTitle>
              <DialogDescription className="text-left mt-1">
                {gig?.title}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="application-message" className="text-base font-semibold">
              Why should you be hired for this gig? *
            </Label>
            <p className="text-sm text-muted-foreground">
              Explain your relevant skills, experience, and why you're a great fit for this opportunity.
            </p>
            <Textarea
              id="application-message"
              placeholder="I am an excellent fit for this position because..."
              value={applicationMessage}
              onChange={(e) => setApplicationMessage(e.target.value)}
              className="min-h-[200px] resize-none"
              maxLength={maxChars}
            />
            <div className="flex justify-between items-center text-xs">
              <span className={charCount < minChars ? 'text-destructive' : 'text-muted-foreground'}>
                {charCount < minChars 
                  ? `Minimum ${minChars} characters required (${minChars - charCount} more needed)`
                  : `${charCount} / ${maxChars} characters`}
              </span>
              {charCount > maxChars && (
                <span className="text-destructive">
                  Character limit exceeded
                </span>
              )}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => handleClose(false)}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!isValid || isSubmitting}
          >
            {isSubmitting ? 'Submitting...' : 'Submit Application'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
