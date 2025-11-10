import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Navbar } from '@/components/Navbar';
import { GigCard } from '@/components/GigCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { queryClient, apiRequest } from '@/lib/queryClient';
import { Briefcase, Plus, Search, DollarSign, MapPin } from 'lucide-react';
import type { Gig } from '@shared/types';

export default function BrowseGigs() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [showPostForm, setShowPostForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    budget: '',
    location: '',
  });

  const { data: gigs, isLoading } = useQuery<Gig[]>({
    queryKey: ['/api/gigs/all'],
  });

  const postGigMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      return apiRequest('POST', '/api/gigs/create', {
        ...data,
        budget: parseInt(data.budget),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/gigs/all'] });
      toast({
        title: 'Gig posted!',
        description: 'Your opportunity is now live.',
      });
      setShowPostForm(false);
      setFormData({ title: '', description: '', budget: '', location: '' });
    },
    onError: () => {
      toast({
        title: 'Failed to post gig',
        description: 'Please try again later.',
        variant: 'destructive',
      });
    },
  });

  const applyMutation = useMutation({
    mutationFn: async (gigId: string) => {
      return apiRequest('POST', `/api/gigs/apply/${gigId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/gigs/all'] });
      queryClient.invalidateQueries({ queryKey: ['/api/gigs/matched'] });
      toast({
        title: 'Application submitted!',
        description: 'The business will review your application.',
      });
    },
    onError: () => {
      toast({
        title: 'Application failed',
        description: 'Please try again later.',
        variant: 'destructive',
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    postGigMutation.mutate(formData);
  };

  const handleApply = (gigId: string) => {
    applyMutation.mutate(gigId);
  };

  const filteredGigs = gigs?.filter((gig) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      gig.title.toLowerCase().includes(query) ||
      gig.description.toLowerCase().includes(query) ||
      gig.location.toLowerCase().includes(query)
    );
  }) || [];

  const displayGigs = user?.role === 'student' 
    ? filteredGigs.filter(g => g.postedBy !== user.id)
    : filteredGigs;

  if (!user) return null;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-secondary">
              <Briefcase className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-foreground">
                {user.role === 'business' ? 'Post a Gig' : 'Browse Gigs'}
              </h1>
              <p className="text-muted-foreground mt-1">
                {user.role === 'business' 
                  ? 'Find talented students for your projects' 
                  : 'Find opportunities that match your skills'}
              </p>
            </div>
          </div>

          {user.role === 'business' && !showPostForm && (
            <Button
              onClick={() => setShowPostForm(true)}
              size="lg"
              className="gap-2"
              data-testid="button-show-post-form"
            >
              <Plus className="w-5 h-5" />
              Post New Gig
            </Button>
          )}
        </div>

        {/* Post Gig Form (Business Only) */}
        {user.role === 'business' && showPostForm && (
          <Card className="mb-8 overflow-visible">
            <CardHeader>
              <h2 className="text-2xl font-bold text-foreground">Create New Gig</h2>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label htmlFor="title" className="text-sm font-medium text-foreground">
                    Gig Title
                  </label>
                  <Input
                    id="title"
                    placeholder="e.g., Social Media Content Creator Needed"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                    className="h-12"
                    data-testid="input-gig-title"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="description" className="text-sm font-medium text-foreground">
                    Description
                  </label>
                  <Textarea
                    id="description"
                    placeholder="Describe the work you need done..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    required
                    className="min-h-32"
                    data-testid="input-gig-description"
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="budget" className="text-sm font-medium text-foreground">
                      Budget ($)
                    </label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                      <Input
                        id="budget"
                        type="number"
                        placeholder="500"
                        value={formData.budget}
                        onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                        required
                        min="1"
                        className="pl-10 h-12"
                        data-testid="input-gig-budget"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="location" className="text-sm font-medium text-foreground">
                      Location
                    </label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                      <Input
                        id="location"
                        placeholder="e.g., Remote, New York, NY"
                        value={formData.location}
                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                        required
                        className="pl-10 h-12"
                        data-testid="input-gig-location"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 justify-end">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowPostForm(false)}
                    data-testid="button-cancel"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={postGigMutation.isPending}
                    data-testid="button-submit-gig"
                  >
                    {postGigMutation.isPending ? 'Posting...' : 'Post Gig'}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Search Bar (Student Only) */}
        {user.role === 'student' && (
          <div className="mb-8">
            <div className="relative max-w-2xl">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                placeholder="Search by title, description, or location..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 h-14 text-base"
                data-testid="input-search"
              />
            </div>
          </div>
        )}

        {/* Gigs Grid */}
        <div>
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <Card key={i} className="overflow-visible">
                  <CardHeader>
                    <Skeleton className="h-6 w-3/4" />
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-2/3" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : displayGigs.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {displayGigs.map((gig) => {
                const applicants = Array.isArray(gig.applicants) ? gig.applicants : [];
                return (
                  <GigCard
                    key={gig.id}
                    gig={gig}
                    onApply={user.role === 'student' ? handleApply : undefined}
                    isApplied={user.role === 'student' && applicants.includes(user.id)}
                    isOwner={user.role === 'business' && gig.postedBy === user.id}
                    applicantCount={user.role === 'business' ? applicants.length : undefined}
                  />
                );
              })}
            </div>
          ) : (
            <Card className="overflow-visible">
              <CardContent className="py-16 text-center">
                <Briefcase className="w-20 h-20 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-2xl font-semibold text-foreground mb-2">
                  {searchQuery ? 'No gigs found' : 'No gigs available'}
                </h3>
                <p className="text-muted-foreground">
                  {searchQuery 
                    ? 'Try adjusting your search terms' 
                    : user.role === 'business' 
                      ? 'Post your first gig to get started' 
                      : 'Check back soon for new opportunities'}
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
