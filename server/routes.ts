import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import type { Request, Response, NextFunction } from "express";
import type { User } from "@shared/types";

const JWT_SECRET = process.env.SESSION_SECRET || "your-secret-key-change-in-production";

interface AuthRequest extends Request {
  user?: User;
}

// Middleware to verify JWT token
const authenticateToken = async (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
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

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth Routes
  
  // Register
  app.post('/api/auth/register', async (req: Request, res: Response) => {
    try {
      const { name, email, password, role, skills, bio, companyName, description } = req.body;

      // Validate required fields
      if (!name || !email || !password || !role) {
        return res.status(400).json({ message: 'Missing required fields' });
      }

      if (!['student', 'business'].includes(role)) {
        return res.status(400).json({ message: 'Invalid role' });
      }

      // Check if user already exists
      const existingUser = await storage.getUserByEmail(email);
      if (existingUser) {
        return res.status(400).json({ message: 'Email already registered' });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create user
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

      // Generate JWT token
      const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '7d' });

      // Don't send password back
      const { password: _, ...userWithoutPassword } = user;

      return res.status(201).json({ token, user: userWithoutPassword });
    } catch (error) {
      console.error('Registration error:', error);
      return res.status(500).json({ message: 'Registration failed' });
    }
  });

  // Login
  app.post('/api/auth/login', async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({ message: 'Email and password required' });
      }

      // Find user
      const user = await storage.getUserByEmail(email);
      if (!user) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      // Verify password
      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      // Generate JWT token
      const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '7d' });

      // Don't send password back
      const { password: _, ...userWithoutPassword } = user;

      return res.status(200).json({ token, user: userWithoutPassword });
    } catch (error) {
      console.error('Login error:', error);
      return res.status(500).json({ message: 'Login failed' });
    }
  });

  // Get current user
  app.get('/api/auth/me', authenticateToken, async (req: AuthRequest, res: Response) => {
    const { password: _, ...userWithoutPassword } = req.user!;
    return res.json(userWithoutPassword);
  });

  // Update profile
  app.patch('/api/profile/update', authenticateToken, async (req: AuthRequest, res: Response) => {
    try {
      const { name, bio, skills, companyName, description } = req.body;
      const userId = req.user!.id;

      const updates: Partial<User> = {};
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

  // Gig Routes

  // Create gig (business only)
  app.post('/api/gigs/create', authenticateToken, async (req: AuthRequest, res: Response) => {
    try {
      const user = req.user!;

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

  // Get all gigs
  app.get('/api/gigs/all', async (req: Request, res: Response) => {
    try {
      const gigs = await storage.getAllGigs();
      return res.json(gigs);
    } catch (error) {
      console.error('Get gigs error:', error);
      return res.status(500).json({ message: 'Failed to fetch gigs' });
    }
  });

  // Get matched gigs (student only - keyword matching based on skills)
  app.get('/api/gigs/matched', authenticateToken, async (req: AuthRequest, res: Response) => {
    try {
      const user = req.user!;

      if (user.role !== 'student') {
        return res.status(403).json({ message: 'Only students can view matched gigs' });
      }

      const allGigs = await storage.getAllGigs();
      const userSkills = user.skills || [];

      if (userSkills.length === 0) {
        return res.json([]);
      }

      // Simple keyword matching: check if any skill appears in gig title or description
      const matchedGigs = allGigs.filter(gig => {
        const searchText = `${gig.title} ${gig.description}`.toLowerCase();
        return userSkills.some((skill: string) => 
          searchText.includes(skill.toLowerCase())
        );
      });

      return res.json(matchedGigs);
    } catch (error) {
      console.error('Get matched gigs error:', error);
      return res.status(500).json({ message: 'Failed to fetch matched gigs' });
    }
  });

  // Apply to gig (student only)
  app.post('/api/gigs/apply/:gigId', authenticateToken, async (req: AuthRequest, res: Response) => {
    try {
      const user = req.user!;
      const { gigId } = req.params;

      if (user.role !== 'student') {
        return res.status(403).json({ message: 'Only students can apply to gigs' });
      }

      const gig = await storage.getGig(gigId);
      if (!gig) {
        return res.status(404).json({ message: 'Gig not found' });
      }

      // Check if already applied
      if (gig.applicants.includes(user.id)) {
        return res.status(400).json({ message: 'Already applied to this gig' });
      }

      // Add applicant
      const updatedApplicants = [...gig.applicants, user.id];

      // Update gig
      const updatedGig = await storage.updateGig(gigId, {
        applicants: updatedApplicants,
      });

      return res.json(updatedGig);
    } catch (error) {
      console.error('Apply to gig error:', error);
      return res.status(500).json({ message: 'Failed to apply to gig' });
    }
  });

  // Get gig by ID
  app.get('/api/gigs/:gigId', async (req: Request, res: Response) => {
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

  // Delete gig (business owner only)
  app.delete('/api/gigs/:gigId', authenticateToken, async (req: AuthRequest, res: Response) => {
    try {
      const user = req.user!;
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

  const httpServer = createServer(app);
  return httpServer;
}
