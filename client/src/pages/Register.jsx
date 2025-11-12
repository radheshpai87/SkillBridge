import { useState } from 'react';
import { useLocation } from 'wouter';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { PublicHeader } from '@/components/PublicHeader';
import { useToast } from '@/hooks/use-toast';
import { Briefcase, Mail, Lock, User, GraduationCap, Building2 } from 'lucide-react';
import { SkillBadge } from '@/components/SkillBadge';

export default function Register() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'student',
    skills: [],
    bio: '',
    companyName: '',
    description: '',
  });
  const [skillInput, setSkillInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const calculatePasswordStrength = (password) => {
    let score = 0;
    const checks = {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      numbers: /\d/.test(password),
      special: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password),
    };

    // Count passed checks
    const passedChecks = Object.values(checks).filter(Boolean).length;
    score = (passedChecks / 5) * 100;

    // Determine strength level
    let strength = 'weak';
    if (score >= 80) strength = 'strong';
    else if (score >= 60) strength = 'good';
    else if (score >= 40) strength = 'fair';

    return { score, strength, checks };
  };

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate password confirmation
    if (formData.password !== formData.confirmPassword) {
      toast({
        title: 'Password mismatch',
        description: 'Please make sure your passwords match.',
        variant: 'destructive',
      });
      return;
    }

    // Validate password strength
    const passwordStrength = calculatePasswordStrength(formData.password);
    if (passwordStrength.strength === 'weak') {
      toast({
        title: 'Weak password',
        description: 'Please choose a stronger password with at least 8 characters, including uppercase, lowercase, numbers, and special characters.',
        variant: 'destructive',
      });
      return;
    }

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
    } catch (error) {
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
    <div className="min-h-screen bg-background">
      <PublicHeader showCTA={false} />
  <div className="flex items-center justify-center bg-muted p-4 py-12" style={{ minHeight: 'calc(100vh - 64px)' }}>
      <Card className="w-full max-w-2xl shadow-2xl">
        <CardHeader className="space-y-4 text-center pb-6">
          <div className="flex justify-center">
            <div className="flex items-center justify-center w-16 h-16 rounded-xl bg-primary shadow-lg">
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
            <div className="space-y-3">
              <label className="text-sm font-medium text-foreground">I am a...</label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, role: 'student' })}
                  className={`group relative p-6 rounded-xl border-2 transition-all duration-300 ${
                    formData.role === 'student'
                      ? 'border-primary bg-primary/5 shadow-lg shadow-primary/20 ring-2 ring-primary/20'
                      : 'border-border hover:border-primary/50 hover:shadow-md hover:bg-primary/5 active:scale-[0.98]'
                  }`}
                  data-testid="button-role-student"
                >
                  <div className={`absolute -top-2 -right-2 w-6 h-6 rounded-full transition-all duration-300 ${
                    formData.role === 'student' 
                      ? 'bg-primary scale-100 opacity-100' 
                      : 'scale-0 opacity-0'
                  }`}>
                    <svg className="w-4 h-4 text-primary-foreground m-auto mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <GraduationCap className={`w-10 h-10 mx-auto mb-3 transition-all duration-300 ${
                    formData.role === 'student' 
                      ? 'text-primary scale-110' 
                      : 'text-muted-foreground group-hover:text-primary group-hover:scale-105'
                  }`} />
                  <p className="font-semibold text-foreground text-lg">Student</p>
                  <p className="text-xs text-muted-foreground mt-1">Looking for gigs</p>
                </button>

                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, role: 'business' })}
                  className={`group relative p-6 rounded-xl border-2 transition-all duration-300 ${
                    formData.role === 'business'
                      ? 'border-secondary bg-secondary/5 shadow-lg shadow-secondary/20 ring-2 ring-secondary/20'
                      : 'border-border hover:border-secondary/50 hover:shadow-md hover:bg-secondary/10 active:scale-[0.98]'
                  }`}
                  data-testid="button-role-business"
                >
                  <div className={`absolute -top-2 -right-2 w-6 h-6 rounded-full transition-all duration-300 ${
                    formData.role === 'business' 
                      ? 'bg-secondary scale-100 opacity-100' 
                      : 'scale-0 opacity-0'
                  }`}>
                    <svg className="w-4 h-4 text-secondary-foreground m-auto mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <Building2 className={`w-10 h-10 mx-auto mb-3 transition-all duration-300 ${
                    formData.role === 'business' 
                      ? 'text-secondary scale-110' 
                      : 'text-muted-foreground group-hover:text-secondary group-hover:scale-105'
                  }`} />
                  <p className="font-semibold text-foreground text-lg">Business</p>
                  <p className="text-xs text-muted-foreground mt-1">Post opportunities</p>
                </button>
              </div>
            </div>

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
                  placeholder="At least 8 characters"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                  minLength={6}
                  className="pl-10 h-12"
                  data-testid="input-password"
                />
              </div>
              {formData.password && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">Password strength:</span>
                    <span className={`text-xs font-medium ${
                      calculatePasswordStrength(formData.password).strength === 'weak' ? 'text-red-500' :
                      calculatePasswordStrength(formData.password).strength === 'fair' ? 'text-yellow-500' :
                      calculatePasswordStrength(formData.password).strength === 'good' ? 'text-blue-500' :
                      'text-green-500'
                    }`}>
                      {calculatePasswordStrength(formData.password).strength.charAt(0).toUpperCase() + 
                       calculatePasswordStrength(formData.password).strength.slice(1)}
                    </span>
                  </div>
                  <Progress 
                    value={calculatePasswordStrength(formData.password).score} 
                    className="h-2"
                  />
                  <div className="grid grid-cols-2 gap-1 text-xs text-muted-foreground">
                    <div className={`flex items-center gap-1 ${calculatePasswordStrength(formData.password).checks.length ? 'text-green-600' : ''}`}>
                      <div className={`w-1.5 h-1.5 rounded-full ${calculatePasswordStrength(formData.password).checks.length ? 'bg-green-500' : 'bg-muted-foreground'}`} />
                      8+ characters
                    </div>
                    <div className={`flex items-center gap-1 ${calculatePasswordStrength(formData.password).checks.uppercase ? 'text-green-600' : ''}`}>
                      <div className={`w-1.5 h-1.5 rounded-full ${calculatePasswordStrength(formData.password).checks.uppercase ? 'bg-green-500' : 'bg-muted-foreground'}`} />
                      Uppercase
                    </div>
                    <div className={`flex items-center gap-1 ${calculatePasswordStrength(formData.password).checks.lowercase ? 'text-green-600' : ''}`}>
                      <div className={`w-1.5 h-1.5 rounded-full ${calculatePasswordStrength(formData.password).checks.lowercase ? 'bg-green-500' : 'bg-muted-foreground'}`} />
                      Lowercase
                    </div>
                    <div className={`flex items-center gap-1 ${calculatePasswordStrength(formData.password).checks.numbers ? 'text-green-600' : ''}`}>
                      <div className={`w-1.5 h-1.5 rounded-full ${calculatePasswordStrength(formData.password).checks.numbers ? 'bg-green-500' : 'bg-muted-foreground'}`} />
                      Number
                    </div>
                    <div className={`flex items-center gap-1 ${calculatePasswordStrength(formData.password).checks.special ? 'text-green-600' : ''}`}>
                      <div className={`w-1.5 h-1.5 rounded-full ${calculatePasswordStrength(formData.password).checks.special ? 'bg-green-500' : 'bg-muted-foreground'}`} />
                      Special char
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <label htmlFor="confirmPassword" className="text-sm font-medium text-foreground">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="Confirm your password"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  required
                  className="pl-10 h-12"
                  data-testid="input-confirm-password"
                />
              </div>
              {formData.confirmPassword && formData.password !== formData.confirmPassword && (
                <p className="text-xs text-red-500">Passwords do not match</p>
              )}
              {formData.confirmPassword && formData.password === formData.confirmPassword && formData.password && (
                <p className="text-xs text-green-600">Passwords match ✓</p>
              )}
            </div>

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
            <button
              onClick={() => setLocation('/login')}
              className="font-semibold text-primary hover:underline bg-transparent border-none p-0 cursor-pointer"
              data-testid="link-login"
            >
              Sign in
            </button>
          </p>
        </CardFooter>
      </Card>
      </div>
    </div>
  );
}
