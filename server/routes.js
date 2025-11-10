import { createServer } from "http";
import { storage } from "./storage.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.SESSION_SECRET || "your-secret-key-change-in-production";

const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await storage.getUser(decoded.userId);
    
    if (!user) {
      return res.status(401).json({ message: 'Invalid token' });
    }
    
    req.user = user;
    next();
  } catch (error) {
    return res.status(403).json({ message: 'Invalid or expired token' });
  }
};

export async function registerRoutes(app) {
  app.post('/api/auth/register', async (req, res) => {
    try {
      const { name, email, password, role, skills, bio, companyName, description } = req.body;

      if (!name || !email || !password || !role) {
        return res.status(400).json({ message: 'Missing required fields' });
      }

      if (!['student', 'business'].includes(role)) {
        return res.status(400).json({ message: 'Invalid role' });
      }

      const existingUser = await storage.getUserByEmail(email);
      if (existingUser) {
        return res.status(400).json({ message: 'Email already registered' });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const user = await storage.createUser({
        name,
        email,
        password: hashedPassword,
        role,
        skills: skills || [],
        bio,
        companyName,
        description,
      });

      const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '7d' });

      const { password: _, ...userWithoutPassword } = user;

      return res.status(201).json({ token, user: userWithoutPassword });
    } catch (error) {
      console.error('Registration error:', error);
      return res.status(500).json({ message: 'Registration failed' });
    }
  });

  app.post('/api/auth/login', async (req, res) => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({ message: 'Email and password required' });
      }

      const user = await storage.getUserByEmail(email);
      if (!user) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '7d' });

      const { password: _, ...userWithoutPassword } = user;

      return res.status(200).json({ token, user: userWithoutPassword });
    } catch (error) {
      console.error('Login error:', error);
      return res.status(500).json({ message: 'Login failed' });
    }
  });

  app.get('/api/auth/me', authenticateToken, async (req, res) => {
    const { password: _, ...userWithoutPassword } = req.user;
    return res.json(userWithoutPassword);
  });

  app.patch('/api/profile/update', authenticateToken, async (req, res) => {
    try {
      const { name, bio, skills, companyName, description } = req.body;
      const userId = req.user.id;

      const updates = {};
      if (name) updates.name = name;
      if (bio !== undefined) updates.bio = bio;
      if (skills) updates.skills = skills;
      if (companyName !== undefined) updates.companyName = companyName;
      if (description !== undefined) updates.description = description;

      const updatedUser = await storage.updateUser(userId, updates);
      
      if (!updatedUser) {
        return res.status(404).json({ message: 'User not found' });
      }

      const { password: _, ...userWithoutPassword } = updatedUser;
      return res.json(userWithoutPassword);
    } catch (error) {
      console.error('Profile update error:', error);
      return res.status(500).json({ message: 'Profile update failed' });
    }
  });

  app.post('/api/gigs/create', authenticateToken, async (req, res) => {
    try {
      const user = req.user;

      if (user.role !== 'business') {
        return res.status(403).json({ message: 'Only businesses can post gigs' });
      }

      const { title, description, budget, location } = req.body;

      if (!title || !description || !budget || !location) {
        return res.status(400).json({ message: 'Missing required fields' });
      }

      const gig = await storage.createGig({
        title,
        description,
        budget: parseInt(budget),
        location,
        postedBy: user.id,
      });

      return res.status(201).json(gig);
    } catch (error) {
      console.error('Create gig error:', error);
      return res.status(500).json({ message: 'Failed to create gig' });
    }
  });

  app.get('/api/gigs/all', async (req, res) => {
    try {
      const gigs = await storage.getAllGigs();
      return res.json(gigs);
    } catch (error) {
      console.error('Get gigs error:', error);
      return res.status(500).json({ message: 'Failed to fetch gigs' });
    }
  });

  app.get('/api/gigs/matched', authenticateToken, async (req, res) => {
    try {
      const user = req.user;

      if (user.role !== 'student') {
        return res.status(403).json({ message: 'Only students can view matched gigs' });
      }

      const allGigs = await storage.getAllGigs();
      const userSkills = user.skills || [];

      if (userSkills.length === 0) {
        return res.json([]);
      }

      const matchedGigs = allGigs.filter(gig => {
        const searchText = `${gig.title} ${gig.description}`.toLowerCase();
        return userSkills.some((skill) => 
          searchText.includes(skill.toLowerCase())
        );
      });

      return res.json(matchedGigs);
    } catch (error) {
      console.error('Get matched gigs error:', error);
      return res.status(500).json({ message: 'Failed to fetch matched gigs' });
    }
  });

  app.post('/api/gigs/apply/:gigId', authenticateToken, async (req, res) => {
    try {
      const user = req.user;
      const { gigId } = req.params;

      if (user.role !== 'student') {
        return res.status(403).json({ message: 'Only students can apply to gigs' });
      }

      const gig = await storage.getGig(gigId);
      if (!gig) {
        return res.status(404).json({ message: 'Gig not found' });
      }

      const existingApplication = await storage.getApplicationByGigAndStudent(gigId, user.id);
      if (existingApplication) {
        return res.status(400).json({ message: 'Already applied to this gig' });
      }

      const application = await storage.createApplication({
        gigId,
        studentId: user.id,
      });

      const updatedApplicants = [...gig.applicants, user.id];
      await storage.updateGig(gigId, {
        applicants: updatedApplicants,
      });

      return res.json(application);
    } catch (error) {
      console.error('Apply to gig error:', error);
      return res.status(500).json({ message: 'Failed to apply to gig' });
    }
  });

  app.get('/api/gigs/:gigId', async (req, res) => {
    try {
      const { gigId } = req.params;
      const gig = await storage.getGig(gigId);

      if (!gig) {
        return res.status(404).json({ message: 'Gig not found' });
      }

      return res.json(gig);
    } catch (error) {
      console.error('Get gig error:', error);
      return res.status(500).json({ message: 'Failed to fetch gig' });
    }
  });

  app.delete('/api/gigs/:gigId', authenticateToken, async (req, res) => {
    try {
      const user = req.user;
      const { gigId } = req.params;

      const gig = await storage.getGig(gigId);
      if (!gig) {
        return res.status(404).json({ message: 'Gig not found' });
      }

      if (gig.postedBy !== user.id) {
        return res.status(403).json({ message: 'Not authorized to delete this gig' });
      }

      await storage.deleteGig(gigId);
      return res.json({ message: 'Gig deleted successfully' });
    } catch (error) {
      console.error('Delete gig error:', error);
      return res.status(500).json({ message: 'Failed to delete gig' });
    }
  });

  app.get('/api/applications/gig/:gigId', authenticateToken, async (req, res) => {
    try {
      const user = req.user;
      const { gigId } = req.params;

      const gig = await storage.getGig(gigId);
      if (!gig) {
        return res.status(404).json({ message: 'Gig not found' });
      }

      if (gig.postedBy !== user.id) {
        return res.status(403).json({ message: 'Not authorized to view applications' });
      }

      const applications = await storage.getApplicationsByGig(gigId);
      return res.json(applications);
    } catch (error) {
      console.error('Get applications error:', error);
      return res.status(500).json({ message: 'Failed to fetch applications' });
    }
  });

  app.get('/api/applications/my', authenticateToken, async (req, res) => {
    try {
      const user = req.user;

      if (user.role !== 'student') {
        return res.status(403).json({ message: 'Only students can view their applications' });
      }

      const applications = await storage.getApplicationsByStudent(user.id);
      return res.json(applications);
    } catch (error) {
      console.error('Get my applications error:', error);
      return res.status(500).json({ message: 'Failed to fetch applications' });
    }
  });

  app.patch('/api/applications/:id/status', authenticateToken, async (req, res) => {
    try {
      const user = req.user;
      const { id } = req.params;
      const { status } = req.body;

      if (!['pending', 'accepted', 'rejected', 'completed'].includes(status)) {
        return res.status(400).json({ message: 'Invalid status' });
      }

      const application = await storage.getApplication(id);
      if (!application) {
        return res.status(404).json({ message: 'Application not found' });
      }

      const gig = await storage.getGig(application.gigId);
      if (!gig || gig.postedBy !== user.id) {
        return res.status(403).json({ message: 'Not authorized to update this application' });
      }

      const updatedApplication = await storage.updateApplicationStatus(id, status);
      return res.json(updatedApplication);
    } catch (error) {
      console.error('Update application status error:', error);
      return res.status(500).json({ message: 'Failed to update application status' });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
