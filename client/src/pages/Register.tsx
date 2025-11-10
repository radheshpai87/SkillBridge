import { useState } from 'react';
import { useLocation } from 'wouter';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Briefcase, Mail, Lock, User, GraduationCap, Building2 } from 'lucide-react';
import { SkillBadge } from '@/components/SkillBadge';

export default function Register() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'student' as 'student' | 'business',
    skills: [] as string[],
    bio: '',
    companyName: '',
    description: '',
  });
  const [skillInput, setSkillInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const handleAddSkill = () => {
    if (skillInput.trim() && !formData.skills.includes(skillInput.trim())) {
      setFormData({
        ...formData,
        skills: [...formData.skills, skillInput.trim()],
      });
      setSkillInput('');
    }
  };

  const handleRemoveSkill = (skill: string) => {
    setFormData({
      ...formData,
      skills: formData.skills.filter(s => s !== skill),
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Registration failed');
      }

      login(data.token, data.user);
      toast({
        title: 'Account created!',
        description: 'Welcome to SkillBridge',
      });
      setLocation('/dashboard');
    } catch (error: any) {
      toast({
        title: 'Registration failed',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-accent via-background to-muted p-4 py-12">
      <Card className="w-full max-w-2xl shadow-2xl">
        <CardHeader className="space-y-4 text-center pb-6">
          <div className="flex justify-center">
            <div className="flex items-center justify-center w-16 h-16 rounded-xl bg-gradient-to-br from-primary to-secondary shadow-lg">
              <Briefcase className="w-8 h-8 text-primary-foreground" />
            </div>
          </div>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Join SkillBridge</h1>
            <p className="text-muted-foreground mt-2">Connect with opportunities or find talent</p>
          </div>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Role Selection */}
            <div className="space-y-3">
              <label className="text-sm font-medium text-foreground">I am a...</label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, role: 'student' })}
                  className={`p-6 rounded-xl border-2 transition-all ${
                    formData.role === 'student'
                      ? 'border-primary bg-accent'
                      : 'border-border hover-elevate'
                  }`}
                  data-testid="button-role-student"
                >
                  <GraduationCap className={`w-8 h-8 mx-auto mb-3 ${
                    formData.role === 'student' ? 'text-primary' : 'text-muted-foreground'
                  }`} />
                  <p className="font-semibold text-foreground">Student</p>
                  <p className="text-xs text-muted-foreground mt-1">Looking for gigs</p>
                </button>

                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, role: 'business' })}
                  className={`p-6 rounded-xl border-2 transition-all ${
                    formData.role === 'business'
                      ? 'border-secondary bg-secondary/10'
                      : 'border-border hover-elevate'
                  }`}
                  data-testid="button-role-business"
                >
                  <Building2 className={`w-8 h-8 mx-auto mb-3 ${
                    formData.role === 'business' ? 'text-secondary' : 'text-muted-foreground'
                  }`} />
                  <p className="font-semibold text-foreground">Business</p>
                  <p className="text-xs text-muted-foreground mt-1">Post opportunities</p>
                </button>
              </div>
            </div>

            {/* Common Fields */}
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium text-foreground">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    id="name"
                    placeholder="John Doe"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    className="pl-10 h-12"
                    data-testid="input-name"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium text-foreground">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                    className="pl-10 h-12"
                    data-testid="input-email"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium text-foreground">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  placeholder="At least 6 characters"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                  minLength={6}
                  className="pl-10 h-12"
                  data-testid="input-password"
                />
              </div>
            </div>

            {/* Student-specific fields */}
            {formData.role === 'student' && (
              <>
                <div className="space-y-2">
                  <label htmlFor="skills" className="text-sm font-medium text-foreground">
                    Skills
                  </label>
                  <div className="flex gap-2">
                    <Input
                      id="skills"
                      placeholder="e.g., Content Creation, Design, Tutoring"
                      value={skillInput}
                      onChange={(e) => setSkillInput(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddSkill())}
                      className="h-12"
                      data-testid="input-skill"
                    />
                    <Button
                      type="button"
                      onClick={handleAddSkill}
                      variant="secondary"
                      data-testid="button-add-skill"
                    >
                      Add
                    </Button>
                  </div>
                  {formData.skills.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-3">
                      {formData.skills.map((skill) => (
                        <SkillBadge
                          key={skill}
                          skill={skill}
                          onRemove={() => handleRemoveSkill(skill)}
                        />
                      ))}
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <label htmlFor="bio" className="text-sm font-medium text-foreground">
                    Bio
                  </label>
                  <Textarea
                    id="bio"
                    placeholder="Tell us about yourself..."
                    value={formData.bio}
                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                    className="min-h-24"
                    data-testid="input-bio"
                  />
                </div>
              </>
            )}

            {/* Business-specific fields */}
            {formData.role === 'business' && (
              <>
                <div className="space-y-2">
                  <label htmlFor="companyName" className="text-sm font-medium text-foreground">
                    Company Name
                  </label>
                  <Input
                    id="companyName"
                    placeholder="Your Company LLC"
                    value={formData.companyName}
                    onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                    className="h-12"
                    data-testid="input-company"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="description" className="text-sm font-medium text-foreground">
                    Company Description
                  </label>
                  <Textarea
                    id="description"
                    placeholder="Tell us about your company..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="min-h-24"
                    data-testid="input-description"
                  />
                </div>
              </>
            )}

            <Button
              type="submit"
              className="w-full h-12 text-base font-semibold"
              disabled={isLoading}
              data-testid="button-submit"
            >
              {isLoading ? 'Creating account...' : 'Create Account'}
            </Button>
          </form>
        </CardContent>

        <CardFooter className="flex justify-center border-t pt-6">
          <p className="text-sm text-muted-foreground">
            Already have an account?{' '}
            <a
              href="/login"
              className="font-semibold text-primary hover:underline"
              data-testid="link-login"
            >
              Sign in
            </a>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
