# SkillBridge - Local Youth Micro-Opportunities Platform

## Overview

SkillBridge is a full-stack web application that connects college students and local youth with small businesses seeking short-term help through affordable gigs. The platform serves as a marketplace for micro-opportunities, enabling skill-based matching between students offering services (content creation, tutoring, design, etc.) and businesses posting gigs.

The application is built as a modern single-page application with a React frontend, Express backend, and MongoDB database, following a clean architectural pattern with clear separation between client and server concerns.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework & Routing**
- React 18 with JavaScript (JSX) for component development
- JSDoc typedefs in shared/types.js for editor type hints (pure JavaScript runtime)
- Wouter for lightweight client-side routing
- Single-page application (SPA) architecture with protected and public route components

**State Management**
- React Context API for authentication state management (AuthContext)
- TanStack React Query (v5) for server state management, caching, and data synchronization
- Local component state for form inputs and UI interactions

**UI Component System**
- Shadcn UI component library (New York style variant) with Radix UI primitives
- Tailwind CSS for utility-first styling with custom design tokens
- Design system based on Poppins typography and vibrant, youth-focused color palette
- Responsive design with mobile-first breakpoints

**Key Design Decisions**
- Chose Context API over Redux for simpler authentication state (fewer dependencies, easier to understand)
- TanStack Query handles all API calls and caching, eliminating need for additional state management
- Shadcn UI provides accessible, customizable components without bloating bundle size

### Backend Architecture

**Server Framework**
- Express.js with JavaScript for the HTTP server
- RESTful API design pattern for all endpoints
- JWT-based stateless authentication with bcryptjs password hashing

**Development Environment**
- Vite for development server with HMR (Hot Module Replacement)
- Custom middleware mode setup for seamless frontend-backend integration
- Development-only features like error overlays and banners for Replit environment

**API Structure**
- `/api/auth/*` - Authentication endpoints (register, login, get current user)
- `/api/gigs/*` - Gig management endpoints (CRUD operations, apply, match)
- Middleware-based authentication using JWT token verification
- Request/response logging for debugging with JSON response capture

**Storage Layer**
- MongoDB Atlas for production database with Mongoose ODM
- MongoStorage implementation providing IStorage interface
- Connection management in server/db.js with automatic retry and error handling
- Native array storage (no JSON serialization) for skills and applicants
- ObjectId to string conversion for frontend compatibility

**Authentication Flow**
- JWT tokens stored in localStorage on client
- Authorization header (`Bearer <token>`) for authenticated requests
- Middleware validates tokens and attaches user to request object
- Session secret configurable via environment variable

### Data Schema

**User Model (Mongoose Schema)**
- Dual-role system: "student" and "business" users in single collection
- Student-specific fields: skills (array of strings), bio
- Business-specific fields: companyName, description
- Email-based unique identification with hashed passwords
- Timestamps (createdAt, updatedAt) automatically managed by Mongoose

**Gig Model (Mongoose Schema)**
- Posted by businesses with title, description, budget, location
- postedBy: ObjectId reference to User
- applicants: Array of ObjectId references to User documents
- Simple skill-based matching using keyword search in title/description
- Timestamps for tracking creation and updates

**Validation**
- Zod schemas (shared/validators.js) for runtime request validation
- JSDoc typedefs (shared/types.js) for editor hints and documentation
- Client-side validation with React Hook Form and @hookform/resolvers
- Server-side validation using Zod schemas for all endpoints

### Build & Deployment

**Build Process**
- Vite builds frontend assets to `dist/public`
- esbuild bundles server code to `dist` with ESM format
- Separate development and production modes with environment-based configuration

**Development vs Production**
- Development: Vite middleware mode with Express, HMR enabled
- Production: Static file serving from dist/public, compiled server bundle
- Conditional loading of Replit-specific plugins in development

## External Dependencies

### Database
- **Mongoose ODM** for MongoDB operations with schema validation
- **MongoDB Atlas** cloud database for production deployment
- Connection string configured via `MONGODB_URI` environment variable
- Automatic connection management with retry logic and error handling
- Native support for arrays and embedded documents

### Authentication & Security
- **jsonwebtoken** for JWT token generation and verification
- **bcryptjs** for password hashing with salt rounds
- Session secret configurable for production security

### UI Component Libraries
- **Radix UI** primitives for accessible, unstyled components (accordion, dialog, dropdown, etc.)
- **Tailwind CSS** for utility-first styling with custom configuration
- **class-variance-authority** and **clsx** for dynamic className composition
- **lucide-react** for icon system

### Form Management
- **react-hook-form** for performant form handling
- **@hookform/resolvers** for Zod schema integration
- **zod** for schema validation

### Development Tools
- **Vite** for development server and build tooling
- **@replit/vite-plugin-runtime-error-modal** for error overlays
- **@replit/vite-plugin-cartographer** and **@replit/vite-plugin-dev-banner** for Replit-specific features
- **Node.js** for JavaScript execution in development (no TypeScript)

### Data Fetching
- **@tanstack/react-query** for server state management, caching, and automatic refetching
- Custom `apiRequest` wrapper for authenticated HTTP calls with error handling

### Routing
- **wouter** as lightweight alternative to React Router
- Hash-based routing for simpler deployment without server configuration

### Additional Libraries
- **date-fns** for date manipulation and formatting
- **cmdk** for command palette functionality
- **nanoid** for unique ID generation