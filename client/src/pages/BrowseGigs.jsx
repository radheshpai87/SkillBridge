import { useState, useMemo, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Navbar } from '@/components/Navbar';
import { GigCard } from '@/components/GigCard';
import { ApplyToGigDialog } from '@/components/ApplyToGigDialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { queryClient, apiRequest } from '@/lib/queryClient';
import { calculateDistance, getUserLocation } from '@/lib/location';
import MapView from '@/components/MapView';
import { Briefcase, Plus, Search, MapPin, X, SlidersHorizontal, ArrowLeft, Map, List, Award, Filter } from 'lucide-react';

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
  const [userLocation, setUserLocation] = useState(null);
  const [locationPermission, setLocationPermission] = useState('unknown');
  const [maxDistance, setMaxDistance] = useState(50);
  const [useLocationFilter, setUseLocationFilter] = useState(false);
  const [viewMode, setViewMode] = useState('list'); // 'list' or 'map'
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    budget: '',
    location: '',
  });

  const { data: gigs, isLoading } = useQuery({
    queryKey: ['/api/gigs/all'],
  });

  // Get user location on component mount (only for students)
  useEffect(() => {
    if (user?.role === 'student') {
      const getLocation = async () => {
        try {
          const location = await getUserLocation();
          setUserLocation(location);
          setLocationPermission('granted');
          setUseLocationFilter(true); // Enable location filtering by default when location is available
          toast({
            title: 'Location detected',
            description: 'Showing gigs near your location.',
          });
        } catch (error) {
          console.log('Location access denied or unavailable:', error);
          setLocationPermission('denied');
          setUseLocationFilter(false);
          toast({
            title: 'Location access denied',
            description: 'Showing all gigs. Enable location for better recommendations.',
            variant: 'default',
          });
        }
      };
      getLocation();
    }
  }, [user, toast]);

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
    setUseLocationFilter(false);
    setMaxDistance(50);
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

      // Location-based filtering for students (only when enabled)
      if (user?.role === 'student' && useLocationFilter && userLocation && gig.coordinates) {
        const distance = calculateDistance(
          userLocation.latitude,
          userLocation.longitude,
          gig.coordinates.latitude,
          gig.coordinates.longitude
        );
        if (distance > maxDistance) return false;
      }

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
    } else if (sortBy === 'distance' && userLocation) {
      filtered.sort((a, b) => {
        if (!a.coordinates || !b.coordinates) return 0;
        const distA = calculateDistance(userLocation.latitude, userLocation.longitude, a.coordinates.latitude, a.coordinates.longitude);
        const distB = calculateDistance(userLocation.latitude, userLocation.longitude, b.coordinates.latitude, b.coordinates.longitude);
        return distA - distB;
      });
    }

    return filtered;
  }, [gigs, searchQuery, minBudget, maxBudget, selectedSkills, selectedLocation, sortBy, user, userLocation, maxDistance, useLocationFilter]);

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (searchQuery) count++;
    if (minBudget > budgetRange.min || maxBudget < budgetRange.max) count++;
    if (selectedSkills.length > 0) count++;
    if (selectedLocation !== 'all') count++;
    if (user?.role === 'student' && useLocationFilter && userLocation && maxDistance < 500) count++;
    return count;
  }, [searchQuery, minBudget, maxBudget, selectedSkills, selectedLocation, budgetRange, user, userLocation, maxDistance, useLocationFilter]);

  const displayGigs = filteredAndSortedGigs;

  if (!user) return null;

  // Filter Sidebar Component
  const FilterSidebar = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Filter className="w-5 h-5" />
          Filters
          {activeFilterCount > 0 && (
            <Badge variant="secondary" className="ml-auto">
              {activeFilterCount}
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Sort By */}
        <div className="space-y-3">
          <Label className="text-sm font-medium">Sort by</Label>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="recent">Most Recent</SelectItem>
              <SelectItem value="budget-high">Highest Pay</SelectItem>
              <SelectItem value="budget-low">Lowest Pay</SelectItem>
              {userLocation && <SelectItem value="distance">Nearest</SelectItem>}
            </SelectContent>
          </Select>
        </div>

        <Separator />

        {/* Budget Range */}
        <div className="space-y-3">
          <Label className="text-sm font-medium">Budget Range (₹)</Label>
          <div className="px-2">
            <Slider
              value={[minBudget, maxBudget]}
              onValueChange={([min, max]) => {
                setMinBudget(min);
                setMaxBudget(max);
              }}
              max={budgetRange.max}
              min={budgetRange.min}
              step={100}
              className="w-full"
            />
            <div className="flex justify-between text-sm text-muted-foreground mt-2">
              <span>₹{minBudget.toLocaleString()}</span>
              <span>₹{maxBudget.toLocaleString()}</span>
            </div>
          </div>
        </div>

        <Separator />

        {/* Location Filter */}
        <div className="space-y-3">
          <Label className="text-sm font-medium">Location</Label>
          <Select value={selectedLocation} onValueChange={setSelectedLocation}>
            <SelectTrigger data-testid="select-location">
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

        {/* Distance Filter (Students Only) */}
        {user?.role === 'student' && userLocation && (
          <>
            <Separator />
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-medium">Use Location</Label>
                <Switch
                  checked={useLocationFilter}
                  onCheckedChange={setUseLocationFilter}
                />
              </div>
              {useLocationFilter && (
                <div className="space-y-3">
                  <Label className="text-sm font-medium">Max Distance (km)</Label>
                  <div className="px-2">
                    <Slider
                      value={[maxDistance]}
                      onValueChange={([value]) => setMaxDistance(value)}
                      max={500}
                      min={5}
                      step={5}
                      className="w-full"
                    />
                    <div className="text-center text-sm text-muted-foreground mt-2">
                      {maxDistance} km
                    </div>
                  </div>
                </div>
              )}
            </div>
          </>
        )}

        {/* Skills Filter (Students Only) */}
        {availableSkills.length > 0 && (
          <>
            <Separator />
            <div className="space-y-3">
              <Label className="text-sm font-medium">Your Skills</Label>
              <div className="flex flex-wrap gap-2">
                {availableSkills.map(skill => (
                  <Badge
                    key={skill}
                    variant={selectedSkills.includes(skill) ? 'default' : 'outline'}
                    className="cursor-pointer text-xs"
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
          </>
        )}

        {/* Clear Filters */}
        {activeFilterCount > 0 && (
          <>
            <Separator />
            <Button variant="outline" onClick={clearFilters} className="w-full">
              Clear All Filters
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  );

  // List View Component
  const ListView = () => (
    <div className="space-y-6">
      {/* Results Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-foreground">
          {isLoading ? 'Loading...' : `${displayGigs.length} gig${displayGigs.length !== 1 ? 's' : ''} found`}
        </h2>
        {locationPermission === 'granted' && (
          <div className="text-sm text-green-600 dark:text-green-400 flex items-center gap-1">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            Location enabled
          </div>
        )}
      </div>

      {/* Results Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i}>
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
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
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
        <Card>
          <CardContent className="py-16 text-center">
            <Briefcase className="w-20 h-20 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-2xl font-semibold text-foreground mb-2">
              {searchQuery ? 'No gigs found' : 'No gigs available'}
            </h3>
            <p className="text-muted-foreground">
              {searchQuery
                ? 'Try adjusting your search terms or filters'
                : user.role === 'business'
                  ? 'Post your first gig to get started'
                  : 'Check back soon for new opportunities'}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );

  // Map View Component
  const MapViewContainer = () => (
    <div className="space-y-6">
      {/* Map Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-foreground">
          Gig Map - {displayGigs.length} gig{displayGigs.length !== 1 ? 's' : ''} found
        </h2>
        {locationPermission === 'granted' && (
          <div className="text-sm text-green-600 dark:text-green-400 flex items-center gap-1">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            Your location shown
          </div>
        )}
      </div>

      {/* Map Component */}
      <Card>
        <CardContent className="p-0">
          <MapView gigs={displayGigs} userLocation={userLocation} />
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="w-full px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="max-w-4xl mx-auto text-center mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            {user.role === 'business' ? 'Manage Gigs' : 'Browse Gigs'}
          </h1>
          <p className="text-xl text-muted-foreground">
            {user.role === 'business'
              ? 'Post new opportunities and manage your gigs'
              : 'Find opportunities that match your skills'}
          </p>
        </div>

        {/* Post Gig Form (Business Only) */}
        {user.role === 'business' && showPostForm && (
          <div className="max-w-2xl mx-auto mb-12">
            <Card>
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
                        Budget (₹)
                      </label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground font-semibold">₹</span>
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
          </div>
        )}

        {/* Main Content */}
        <div className="max-w-7xl mx-auto">
          {/* Search Bar and Controls */}
          <div className="mb-6 space-y-4">
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  placeholder="Search gigs..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 h-12"
                  data-testid="input-search"
                />
              </div>

              <div className="flex gap-2">
                {/* View Toggle */}
                <div className="flex rounded-lg border p-1">
                  <Button
                    variant={viewMode === 'list' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('list')}
                    className="px-3"
                  >
                    <List className="w-4 h-4 mr-2" />
                    List
                  </Button>
                  <Button
                    variant={viewMode === 'map' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('map')}
                    className="px-3"
                  >
                    <Map className="w-4 h-4 mr-2" />
                    Map
                  </Button>
                </div>

                {/* Mobile Filter Button */}
                <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
                  <SheetTrigger asChild>
                    <Button variant="outline" size="sm" className="lg:hidden">
                      <Filter className="w-4 h-4 mr-2" />
                      Filters
                      {activeFilterCount > 0 && (
                        <Badge variant="secondary" className="ml-2 h-5 w-5 p-0 text-xs">
                          {activeFilterCount}
                        </Badge>
                      )}
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="left" className="w-80">
                    <SheetHeader>
                      <SheetTitle>Filters</SheetTitle>
                    </SheetHeader>
                    <div className="mt-6">
                      <FilterSidebar />
                    </div>
                  </SheetContent>
                </Sheet>

                {user.role === 'business' && !showPostForm && (
                  <Button
                    onClick={() => setShowPostForm(true)}
                    size="sm"
                    data-testid="button-show-post-form"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Post Gig
                  </Button>
                )}

                <Button
                  variant="outline"
                  onClick={() => window.history.back()}
                  size="sm"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back
                </Button>
              </div>
            </div>
          </div>

          {/* Main Layout */}
          <div className="flex gap-6">
            {/* Sidebar - Desktop */}
            <div className="hidden lg:block w-80 flex-shrink-0">
              <div className="sticky top-6">
                <FilterSidebar />
              </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 min-w-0">
              {viewMode === 'list' ? (
                <ListView />
              ) : (
                <MapViewContainer />
              )}
            </div>
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
    </div>
  );
}
