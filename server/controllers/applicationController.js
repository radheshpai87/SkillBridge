import { storage } from '../services/storageService.js';
import { ValidationError, NotFoundError, ForbiddenError, ConflictError } from '../utils/errors.js';
import { asyncHandler } from '../middleware/errorHandler.js';

export const applyToGig = asyncHandler(async (req, res) => {
  const { gigId } = req.params;
  const userId = req.user.id;

  const gig = await storage.getGig(gigId);
  
  if (!gig) {
    throw new NotFoundError('Gig not found');
  }

  // Check if already applied
  const existingApplication = await storage.getApplicationByGigAndStudent(gigId, userId);
  
  if (existingApplication) {
    throw new ConflictError('Already applied to this gig');
  }

  // Create application
  const application = await storage.createApplication({
    gigId,
    studentId: userId,
  });

  // Update gig applicants
  const updatedApplicants = [...gig.applicants, userId];
  await storage.updateGig(gigId, {
    applicants: updatedApplicants,
  });

  res.status(201).json({
    success: true,
    application,
  });
});

export const getApplicationsByGig = asyncHandler(async (req, res) => {
  const { gigId } = req.params;

  const gig = await storage.getGig(gigId);
  
  if (!gig) {
    throw new NotFoundError('Gig not found');
  }

  if (gig.postedBy !== req.user.id) {
    throw new ForbiddenError('Not authorized to view applications for this gig');
  }

  const applications = await storage.getApplicationsByGig(gigId);

  res.json({
    success: true,
    count: applications.length,
    applications,
  });
});

export const getMyApplications = asyncHandler(async (req, res) => {
  const applications = await storage.getApplicationsByStudent(req.user.id);

  res.json({
    success: true,
    count: applications.length,
    applications,
  });
});

export const updateApplicationStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const validStatuses = ['pending', 'accepted', 'rejected', 'completed'];
  
  if (!status || !validStatuses.includes(status)) {
    throw new ValidationError(`Invalid status. Must be one of: ${validStatuses.join(', ')}`);
  }

  const application = await storage.getApplication(id);
  
  if (!application) {
    throw new NotFoundError('Application not found');
  }

  const gig = await storage.getGig(application.gigId);
  
  if (!gig || gig.postedBy !== req.user.id) {
    throw new ForbiddenError('Not authorized to update this application');
  }

  const updatedApplication = await storage.updateApplicationStatus(id, status);

  res.json({
    success: true,
    application: updatedApplication,
  });
});
