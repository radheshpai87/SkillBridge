import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';

export function SkillBadge({ skill, onRemove, variant = 'default' }) {
  return (
    <Badge
      variant={variant}
      className="px-3 py-1 font-medium"
      data-testid={`badge-skill-${skill.toLowerCase().replace(/\s+/g, '-')}`}
    >
      {skill}
      {onRemove && (
        <button
          onClick={onRemove}
          className="ml-1.5 hover-elevate active-elevate-2 rounded-full p-0.5"
          data-testid={`button-remove-skill-${skill.toLowerCase().replace(/\s+/g, '-')}`}
        >
          <X className="w-3 h-3" />
        </button>
      )}
    </Badge>
  );
}
