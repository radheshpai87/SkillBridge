import { storage } from '../services/storageService.js';
import { ValidationError, NotFoundError, ForbiddenError, ConflictError } from '../utils/errors.js';
import { asyncHandler } from '../middleware/errorHandler.js';

export const applyToGig = asyncHandler(async (req, res) => {
  const { gigId } = req.params;
  const { applicationMessage } = req.body;
  const userId = req.user.id;

  // Validate application message
  if (!applicationMessage || applicationMessage.trim().length < 50) {
    throw new ValidationError('Application message must be at least 50 characters');
  }

  if (applicationMessage.length > 1000) {
    throw new ValidationError('Application message must not exceed 1000 characters');
  }

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
    applicationMessage: applicationMessage.trim(),
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
  const { status, rejectionReason } = req.body;

  const validStatuses = ['pending', 'accepted', 'rejected', 'completed'];
  
  if (!status || !validStatuses.includes(status)) {
    throw new ValidationError(`Invalid status. Must be one of: ${validStatuses.join(', ')}`);
  }

  // Validate rejection reason if status is rejected
  if (status === 'rejected' && rejectionReason && rejectionReason.length > 500) {
    throw new ValidationError('Rejection reason must be less than 500 characters');
  }

  const application = await storage.getApplication(id);
  
  if (!application) {
    throw new NotFoundError('Application not found');
  }

  const gig = await storage.getGig(application.gigId);
  
  if (!gig || gig.postedBy !== req.user.id) {
    throw new ForbiddenError('Not authorized to update this application');
  }

  const updatedApplication = await storage.updateApplicationStatus(id, status, rejectionReason);

  res.json({
    success: true,
    application: updatedApplication,
  });
});
