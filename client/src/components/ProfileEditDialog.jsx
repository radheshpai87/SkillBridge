import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { SkillBadge } from '@/components/SkillBadge';
import { User, Building2, X, Plus } from 'lucide-react';

export function ProfileEditDialog({ user, open, onOpenChange, onSave, isLoading }) {
  const [formData, setFormData] = useState({
    name: '',
    bio: '',
    skills: [],
    companyName: '',
    description: '',
  });
  const [skillInput, setSkillInput] = useState('');
  const { toast } = useToast();

  // Initialize form data when user changes or dialog opens
  useEffect(() => {
    if (user && open) {
      setFormData({
        name: user.name || '',
        bio: user.bio || '',
        skills: user.skills || [],
        companyName: user.companyName || '',
        description: user.description || '',
      });
    }
  }, [user, open]);

  const handleAddSkill = () => {
    if (skillInput.trim() && !formData.skills.includes(skillInput.trim())) {
      setFormData({
        ...formData,
        skills: [...formData.skills, skillInput.trim()],
      });
      setSkillInput('');
    }
  };

  const handleRemoveSkill = (skill) => {
    setFormData({
      ...formData,
      skills: formData.skills.filter(s => s !== skill),
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Prepare update data based on user role
    const updateData = {
      name: formData.name,
    };

    if (user.role === 'student') {
      updateData.bio = formData.bio;
      updateData.skills = formData.skills;
    } else if (user.role === 'business') {
      updateData.companyName = formData.companyName;
      updateData.description = formData.description;
    }

    onSave(updateData);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddSkill();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {user?.role === 'student' ? (
              <User className="w-5 h-5" />
            ) : (
              <Building2 className="w-5 h-5" />
            )}
            Edit Profile
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name Field - Common for both roles */}
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Enter your full name"
              required
            />
          </div>

          {/* Student-specific fields */}
          {user?.role === 'student' && (
            <>
              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  placeholder="Tell us about yourself, your experience, and what you're looking for..."
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label>Skills</Label>
                <div className="flex gap-2">
                  <Input
                    placeholder="Add a skill (e.g., React, Python, Design)"
                    value={skillInput}
                    onChange={(e) => setSkillInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                  />
                  <Button
                    type="button"
                    onClick={handleAddSkill}
                    variant="outline"
                    size="sm"
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                {formData.skills.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {formData.skills.map((skill) => (
                      <SkillBadge
                        key={skill}
                        skill={skill}
                        onRemove={() => handleRemoveSkill(skill)}
                      />
                    ))}
                  </div>
                )}
                <p className="text-xs text-muted-foreground">
                  Add skills to get better gig recommendations
                </p>
              </div>
            </>
          )}

          {/* Business-specific fields */}
          {user?.role === 'business' && (
            <>
              <div className="space-y-2">
                <Label htmlFor="companyName">Company Name</Label>
                <Input
                  id="companyName"
                  value={formData.companyName}
                  onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                  placeholder="Enter your company name"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Company Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Describe your company, what you do, and the type of talent you're looking for..."
                  rows={3}
                />
              </div>
            </>
          )}

          <DialogFooter className="gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Saving...' : 'Save Changes'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}