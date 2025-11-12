import { useState, useMemo } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Navbar } from '@/components/Navbar';
import { GigCard } from '@/components/GigCard';
import { ApplyToGigDialog } from '@/components/ApplyToGigDialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { queryClient, apiRequest } from '@/lib/queryClient';
import { Briefcase, Plus, Search, DollarSign, MapPin, X, SlidersHorizontal, ArrowLeft } from 'lucide-react';

export default function BrowseGigs() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [minBudget, setMinBudget] = useState(0);
  const [maxBudget, setMaxBudget] = useState(Infinity);
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState('all');
  const [sortBy, setSortBy] = useState('recent');
  const [showPostForm, setShowPostForm] = useState(false);
  const [applyDialogOpen, setApplyDialogOpen] = useState(false);
  const [selectedGig, setSelectedGig] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    budget: '',
    location: '',
  });

  const { data: gigs, isLoading } = useQuery({
    queryKey: ['/api/gigs/all'],
  });

  const budgetRange = useMemo(() => {
    if (!gigs || gigs.length === 0) return { min: 0, max: 1000 };
    const budgets = gigs.map(g => g.budget);
    return {
      min: Math.min(...budgets),
      max: Math.max(...budgets)
    };
  }, [gigs]);

  const { data: myApplications } = useQuery({
    queryKey: ['/api/applications/my'],
    enabled: user?.role === 'student',
  });

  const applicationsByGig = useMemo(() => {
    if (!myApplications) return {};
    return myApplications.reduce((acc, app) => {
      acc[app.gigId] = app;
      return acc;
    }, {});
  }, [myApplications]);

  const postGigMutation = useMutation({
    mutationFn: async (data) => {
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
    mutationFn: async ({ gigId, applicationMessage }) => {
      return apiRequest('POST', `/api/applications/gig/${gigId}`, { applicationMessage });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/gigs/all'] });
      queryClient.invalidateQueries({ queryKey: ['/api/gigs/matched'] });
      queryClient.invalidateQueries({ queryKey: ['/api/applications/my'] });
      setApplyDialogOpen(false);
      setSelectedGig(null);
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

  const handleSubmit = (e) => {
    e.preventDefault();
    postGigMutation.mutate(formData);
  };

  const handleApply = (gigId) => {
    const gig = displayGigs.find(g => g.id === gigId);
    setSelectedGig(gig);
    setApplyDialogOpen(true);
  };

  const handleApplySubmit = (gigId, applicationMessage) => {
    applyMutation.mutate({ gigId, applicationMessage });
  };

  const clearFilters = () => {
    setSearchQuery('');
    setMinBudget(budgetRange.min);
    setMaxBudget(budgetRange.max);
    setSelectedSkills([]);
    setSelectedLocation('all');
    setSortBy('recent');
  };

  const toggleSkill = (skill) => {
    setSelectedSkills(prev => 
      prev.includes(skill) 
        ? prev.filter(s => s !== skill)
        : [...prev, skill]
    );
  };

  const availableLocations = useMemo(() => {
    if (!gigs) return [];
    const locations = new Set(gigs.map(g => g.location));
    return Array.from(locations).sort();
  }, [gigs]);

  const availableSkills = useMemo(() => {
    if (!gigs || user?.role !== 'student') return [];
    const skills = new Set();
    gigs.forEach(gig => {
      const gigText = `${gig.title} ${gig.description}`.toLowerCase();
      user.skills?.forEach(skill => {
        if (gigText.includes(skill.toLowerCase())) {
          skills.add(skill);
        }
      });
    });
    return Array.from(skills).sort();
  }, [gigs, user]);

  const filteredAndSortedGigs = useMemo(() => {
    if (!gigs) return [];
    
    let filtered = gigs.filter((gig) => {
      if (user?.role === 'student' && gig.postedBy === user.id) return false;
      
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matches = 
          gig.title.toLowerCase().includes(query) ||
          gig.description.toLowerCase().includes(query) ||
          gig.location.toLowerCase().includes(query);
        if (!matches) return false;
      }
      
      if (gig.budget < minBudget || gig.budget > maxBudget) return false;
      
      if (selectedLocation !== 'all' && gig.location !== selectedLocation) return false;
      
      if (selectedSkills.length > 0) {
        const gigText = `${gig.title} ${gig.description}`.toLowerCase();
        const hasSkill = selectedSkills.some(skill => 
          gigText.includes(skill.toLowerCase())
        );
        if (!hasSkill) return false;
      }
      
      return true;
    });
    
    if (sortBy === 'budget-high') {
      filtered.sort((a, b) => b.budget - a.budget);
    } else if (sortBy === 'budget-low') {
      filtered.sort((a, b) => a.budget - b.budget);
    } else if (sortBy === 'recent') {
      filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }
    
    return filtered;
  }, [gigs, searchQuery, minBudget, maxBudget, selectedSkills, selectedLocation, sortBy, user]);

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (searchQuery) count++;
    if (minBudget > budgetRange.min || maxBudget < budgetRange.max) count++;
    if (selectedSkills.length > 0) count++;
    if (selectedLocation !== 'all') count++;
    return count;
  }, [searchQuery, minBudget, maxBudget, selectedSkills, selectedLocation, budgetRange]);

  const displayGigs = filteredAndSortedGigs;

  if (!user) return null;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
            <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-primary">
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

          <div className="flex gap-2">
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
            <Button
              variant="outline"
              onClick={() => setLocation('/dashboard')}
              size="lg"
              className="gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Dashboard
            </Button>
          </div>
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

        {/* Search and Filters (Student Only) */}
        {user.role === 'student' && (
          <div className="mb-8 space-y-4">
            {/* Search Bar */}
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

            {/* Desktop Filters */}
            <div className="hidden md:block">
              <Card className="overflow-visible">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4 flex-wrap">
                    {/* Budget Range */}
                    <div className="flex-1 min-w-64 space-y-2">
                      <Label className="text-sm font-medium">Budget Range</Label>
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2 flex-1">
                          <DollarSign className="w-4 h-4 text-muted-foreground" />
                          <Input
                            type="number"
                            value={minBudget === Infinity ? budgetRange.min : minBudget}
                            onChange={(e) => setMinBudget(parseInt(e.target.value) || budgetRange.min)}
                            className="h-9"
                            min={budgetRange.min}
                            max={budgetRange.max}
                            data-testid="input-min-budget"
                          />
                        </div>
                        <span className="text-muted-foreground">to</span>
                        <div className="flex items-center gap-2 flex-1">
                          <DollarSign className="w-4 h-4 text-muted-foreground" />
                          <Input
                            type="number"
                            value={maxBudget === Infinity ? budgetRange.max : maxBudget}
                            onChange={(e) => setMaxBudget(parseInt(e.target.value) || budgetRange.max)}
                            className="h-9"
                            min={budgetRange.min}
                            max={budgetRange.max}
                            data-testid="input-max-budget"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Location Filter */}
                    <div className="min-w-48 space-y-2">
                      <Label className="text-sm font-medium">Location</Label>
                      <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                        <SelectTrigger className="h-9" data-testid="select-location">
                          <SelectValue placeholder="All Locations" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Locations</SelectItem>
                          {availableLocations.map(loc => (
                            <SelectItem key={loc} value={loc}>{loc}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Sort By */}
                    <div className="min-w-48 space-y-2">
                      <Label className="text-sm font-medium">Sort By</Label>
                      <Select value={sortBy} onValueChange={setSortBy}>
                        <SelectTrigger className="h-9" data-testid="select-sort">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="recent">Most Recent</SelectItem>
                          <SelectItem value="budget-high">Highest Budget</SelectItem>
                          <SelectItem value="budget-low">Lowest Budget</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Skills Filter */}
                  {availableSkills.length > 0 && (
                    <div className="mt-4 pt-4 border-t space-y-2">
                      <Label className="text-sm font-medium">Filter by Your Skills</Label>
                      <div className="flex flex-wrap gap-2">
                        {availableSkills.map(skill => (
                          <Badge
                            key={skill}
                            variant={selectedSkills.includes(skill) ? 'default' : 'outline'}
                            className="cursor-pointer hover-elevate active-elevate-2"
                            onClick={() => toggleSkill(skill)}
                            data-testid={`badge-skill-${skill.toLowerCase().replace(/\s+/g, '-')}`}
                          >
                            {skill}
                            {selectedSkills.includes(skill) && (
                              <X className="w-3 h-3 ml-1" />
                            )}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Active Filters and Clear */}
                  {activeFilterCount > 0 && (
                    <div className="mt-4 pt-4 border-t flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">
                        {activeFilterCount} filter{activeFilterCount > 1 ? 's' : ''} active
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={clearFilters}
                        className="gap-2"
                        data-testid="button-clear-filters"
                      >
                        <X className="w-4 h-4" />
                        Clear Filters
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Mobile Filters Sheet */}
            <div className="md:hidden">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" className="w-full gap-2" data-testid="button-open-filters">
                    <SlidersHorizontal className="w-5 h-5" />
                    Filters
                    {activeFilterCount > 0 && (
                      <Badge variant="secondary" className="ml-auto">
                        {activeFilterCount}
                      </Badge>
                    )}
                  </Button>
                </SheetTrigger>
                <SheetContent side="bottom" className="h-[80vh] overflow-y-auto">
                  <SheetHeader>
                    <SheetTitle>Filter Gigs</SheetTitle>
                  </SheetHeader>
                  <div className="mt-6 space-y-6">
                    {/* Budget Range */}
                    <div className="space-y-3">
                      <Label className="text-sm font-medium">Budget Range</Label>
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <DollarSign className="w-4 h-4 text-muted-foreground" />
                          <Input
                            type="number"
                            placeholder="Min"
                            value={minBudget === Infinity ? budgetRange.min : minBudget}
                            onChange={(e) => setMinBudget(parseInt(e.target.value) || budgetRange.min)}
                            min={budgetRange.min}
                            max={budgetRange.max}
                          />
                        </div>
                        <div className="flex items-center gap-2">
                          <DollarSign className="w-4 h-4 text-muted-foreground" />
                          <Input
                            type="number"
                            placeholder="Max"
                            value={maxBudget === Infinity ? budgetRange.max : maxBudget}
                            onChange={(e) => setMaxBudget(parseInt(e.target.value) || budgetRange.max)}
                            min={budgetRange.min}
                            max={budgetRange.max}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Location */}
                    <div className="space-y-3">
                      <Label className="text-sm font-medium">Location</Label>
                      <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                        <SelectTrigger>
                          <SelectValue placeholder="All Locations" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Locations</SelectItem>
                          {availableLocations.map(loc => (
                            <SelectItem key={loc} value={loc}>{loc}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Sort By */}
                    <div className="space-y-3">
                      <Label className="text-sm font-medium">Sort By</Label>
                      <Select value={sortBy} onValueChange={setSortBy}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="recent">Most Recent</SelectItem>
                          <SelectItem value="budget-high">Highest Budget</SelectItem>
                          <SelectItem value="budget-low">Lowest Budget</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Skills */}
                    {availableSkills.length > 0 && (
                      <div className="space-y-3">
                        <Label className="text-sm font-medium">Filter by Your Skills</Label>
                        <div className="flex flex-wrap gap-2">
                          {availableSkills.map(skill => (
                            <Badge
                              key={skill}
                              variant={selectedSkills.includes(skill) ? 'default' : 'outline'}
                              className="cursor-pointer hover-elevate active-elevate-2"
                              onClick={() => toggleSkill(skill)}
                            >
                              {skill}
                              {selectedSkills.includes(skill) && (
                                <X className="w-3 h-3 ml-1" />
                              )}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Clear Filters */}
                    {activeFilterCount > 0 && (
                      <Button
                        variant="outline"
                        onClick={clearFilters}
                        className="w-full gap-2"
                      >
                        <X className="w-4 h-4" />
                        Clear All Filters
                      </Button>
                    )}
                  </div>
                </SheetContent>
              </Sheet>
            </div>

            {/* Results Count */}
            <div className="text-sm text-muted-foreground">
              Showing {displayGigs.length} gig{displayGigs.length !== 1 ? 's' : ''}
              {activeFilterCount > 0 && ' (filtered)'}
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
                const application = user.role === 'student' ? applicationsByGig[gig.id] : undefined;
                return (
                  <GigCard
                    key={gig.id}
                    gig={gig}
                    onApply={user.role === 'student' ? handleApply : undefined}
                    applicationStatus={application?.status}
                    applicationId={application?.id}
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

      {/* Apply to Gig Dialog */}
      {selectedGig && (
        <ApplyToGigDialog
          gig={selectedGig}
          open={applyDialogOpen}
          onOpenChange={setApplyDialogOpen}
          onSubmit={handleApplySubmit}
          isSubmitting={applyMutation.isPending}
        />
      )}
    </div>
  );
}
