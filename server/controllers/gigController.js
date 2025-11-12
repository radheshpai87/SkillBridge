import { storage } from '../services/storageService.js';
import { ValidationError, NotFoundError, ForbiddenError } from '../utils/errors.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import { getCityCoordinates, calculateDistance } from '../utils/location.js';

export const createGig = asyncHandler(async (req, res) => {
  const { title, description, budget, location } = req.body;

  // Validate required fields
  if (!title || !description || !budget || !location) {
    throw new ValidationError('Missing required fields: title, description, budget, location');
  }

  const coordinates = getCityCoordinates(location) || { latitude: 0, longitude: 0 }; // Default fallback

  const gig = await storage.createGig({
    title,
    description,
    budget: parseInt(budget),
    location,
    coordinates,
    postedBy: req.user.id,
  });

  res.status(201).json({
    success: true,
    gig,
  });
});

export const getAllGigs = asyncHandler(async (req, res) => {
  const gigs = await storage.getAllGigs();
  
  res.json({
    success: true,
    count: gigs.length,
    gigs,
  });
});

export const getGig = asyncHandler(async (req, res) => {
  const { gigId } = req.params;
  const gig = await storage.getGig(gigId);

  if (!gig) {
    throw new NotFoundError('Gig not found');
  }

  res.json({
    success: true,
    gig,
  });
});

export const getMatchedGigs = asyncHandler(async (req, res) => {
  const user = req.user;
  const allGigs = await storage.getAllGigs();
  const userSkills = user.skills || [];
  const userCoordinates = user.coordinates;

  // Log for debugging
  console.log(`[MATCH] User: ${user.name}, Skills: [${userSkills.join(', ')}], Coordinates: ${userCoordinates ? `(${userCoordinates.latitude}, ${userCoordinates.longitude})` : 'Not set'}`);

  if (userSkills.length === 0 && !userCoordinates) {
    console.log('[MATCH] No skills or coordinates found, returning 0 gigs');
    return res.json({
      success: true,
      count: 0,
      gigs: [],
      message: 'Add skills and enable location to see matched opportunities',
    });
  }

  let matchedGigs = [];

  // First, filter by skills if user has skills
  if (userSkills.length > 0) {
    const skillMatchedGigs = allGigs.filter((gig) => {
      const searchText = `${gig.title} ${gig.description}`.toLowerCase();
      const matches = userSkills.some((skill) => searchText.includes(skill.toLowerCase()));
      return matches;
    });
    matchedGigs = skillMatchedGigs;
    console.log(`[MATCH] Found ${skillMatchedGigs.length} gigs matching skills`);
  }

  // Then, filter by location if user has coordinates
  if (userCoordinates && userCoordinates.latitude && userCoordinates.longitude) {
    const locationMatchedGigs = allGigs.filter((gig) => {
      if (!gig.coordinates) return false;
      
      const distance = calculateDistance(
        userCoordinates.latitude,
        userCoordinates.longitude,
        gig.coordinates.latitude,
        gig.coordinates.longitude
      );
      
      // Consider gigs within 50km as location matches
      return distance <= 50;
    });
    
    console.log(`[MATCH] Found ${locationMatchedGigs.length} gigs within 50km`);
    
    // If user has both skills and coordinates, combine the matches
    if (userSkills.length > 0) {
      // Find gigs that match either skills OR location
      const combinedMatches = [...new Set([...matchedGigs, ...locationMatchedGigs])];
      matchedGigs = combinedMatches;
      console.log(`[MATCH] Combined matches: ${combinedMatches.length} gigs`);
    } else {
      // If no skills but has coordinates, use location matches
      matchedGigs = locationMatchedGigs;
    }
  }

  // Remove duplicates and sort by relevance (prioritize skill matches)
  const uniqueGigs = matchedGigs.filter((gig, index, self) => 
    self.findIndex(g => g.id === gig.id) === index
  );

  console.log(`[MATCH] Final result: ${uniqueGigs.length} unique matched gigs out of ${allGigs.length} total`);

  res.json({
    success: true,
    count: uniqueGigs.length,
    gigs: uniqueGigs,
  });
});

export const getMyGigs = asyncHandler(async (req, res) => {
  const gigs = await storage.getGigsByBusiness(req.user.id);
  
  res.json({
    success: true,
    count: gigs.length,
    gigs,
  });
});

export const updateGig = asyncHandler(async (req, res) => {
  const { gigId } = req.params;
  const { title, description, budget, location } = req.body;

  const gig = await storage.getGig(gigId);
  
  if (!gig) {
    throw new NotFoundError('Gig not found');
  }

  if (gig.postedBy !== req.user.id) {
    throw new ForbiddenError('Not authorized to update this gig');
  }

  const updates = {};
  if (title) updates.title = title;
  if (description) updates.description = description;
  if (budget) updates.budget = parseInt(budget);
  if (location) {
    updates.location = location;
    // Update coordinates when location changes
    updates.coordinates = getCityCoordinates(location) || { latitude: 0, longitude: 0 };
  }

  const updatedGig = await storage.updateGig(gigId, updates);

  res.json({
    success: true,
    gig: updatedGig,
  });
});

export const deleteGig = asyncHandler(async (req, res) => {
  const { gigId } = req.params;

  const gig = await storage.getGig(gigId);
  
  if (!gig) {
    throw new NotFoundError('Gig not found');
  }

  if (gig.postedBy !== req.user.id) {
    throw new ForbiddenError('Not authorized to delete this gig');
  }

  await storage.deleteGig(gigId);
  
  res.json({
    success: true,
    message: 'Gig deleted successfully',
  });
});
