import { storage } from '../services/storageService.js';
import { ValidationError, NotFoundError, ForbiddenError } from '../utils/errors.js';
import { asyncHandler } from '../middleware/errorHandler.js';

export const createGig = asyncHandler(async (req, res) => {
  const { title, description, budget, location } = req.body;

  // Validate required fields
  if (!title || !description || !budget || !location) {
    throw new ValidationError('Missing required fields: title, description, budget, location');
  }

  const gig = await storage.createGig({
    title,
    description,
    budget: parseInt(budget),
    location,
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

  // Log for debugging
  console.log(`[MATCH] User: ${user.name}, Skills: [${userSkills.join(', ')}]`);

  if (userSkills.length === 0) {
    console.log('[MATCH] No skills found, returning 0 gigs');
    return res.json({
      success: true,
      count: 0,
      gigs: [],
      message: 'Add skills to your profile to see matched opportunities',
    });
  }

  const matchedGigs = allGigs.filter((gig) => {
    const searchText = `${gig.title} ${gig.description}`.toLowerCase();
    const matches = userSkills.some((skill) => searchText.includes(skill.toLowerCase()));
    
    if (matches) {
      console.log(`[MATCH] ✓ "${gig.title}" matches skills`);
    }
    
    return matches;
  });

  console.log(`[MATCH] Found ${matchedGigs.length} matching gigs out of ${allGigs.length} total`);

  res.json({
    success: true,
    count: matchedGigs.length,
    gigs: matchedGigs,
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
  if (location) updates.location = location;

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
