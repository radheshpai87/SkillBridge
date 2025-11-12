# SkillBridge Youth

A modern MERN stack platform connecting young professionals and students with local businesses for skill-based gigs and opportunities.

## 🚀 Features

- **Student Portal**: Browse opportunities, apply to gigs, track applications
- **Business Portal**: Post gigs, manage applications, find talent
- **Smart Matching**: Skill-based gig recommendations for students
- **Authentication**: Secure JWT-based authentication
- **Real-time Updates**: Track application status in real-time
- **Responsive Design**: Mobile-first UI with Tailwind CSS

## 🛠️ Tech Stack

### Frontend
- **React 18** - Modern UI library
- **Vite** - Lightning-fast build tool
- **React Router (Wouter)** - Lightweight routing
- **TanStack Query** - Data fetching and caching
- **Tailwind CSS** - Utility-first CSS framework
- **Radix UI** - Accessible component primitives
- **Shadcn/UI** - Beautiful component library

### Backend
- **Node.js & Express** - Server framework
- **MongoDB & Mongoose** - Database and ODM
- **JWT** - Authentication
- **Bcrypt** - Password hashing
- **Zod** - Schema validation

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v18 or higher)
- **npm** or **yarn**
- **MongoDB** (v5 or higher) - Running locally or MongoDB Atlas account

## 🏗️ Project Structure

```
SkillBridgeYouth/
├── client/                 # React frontend
│   ├── public/            # Static assets
│   └── src/
│       ├── components/    # Reusable components
│       ├── contexts/      # React contexts
│       ├── hooks/         # Custom hooks
│       ├── lib/           # Utilities
│       ├── pages/         # Page components
│       ├── services/      # API service layer
│       └── App.jsx        # Root component
├── server/                # Express backend
│   ├── config/           # Configuration files
│   │   ├── database.js   # Database connection
│   │   └── env.js        # Environment config
│   ├── controllers/      # Route controllers
│   ├── middleware/       # Express middleware
│   ├── routes/           # API routes
│   ├── utils/            # Utility functions
│   ├── app.js            # Express app setup
│   ├── server.js         # Server entry point
│   ├── types.js          # Type definitions (JSDoc)
│   └── validators.js     # Zod validation schemas
├── .env.example          # Environment template
├── package.json          # Dependencies
└── README.md            # This file
```

## 🚀 Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Environment Variables

Create a `.env` file in the root directory:

```bash
cp .env.example .env
```

Edit `.env` with your configuration:

```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/skillbridge
JWT_SECRET=your-super-secret-jwt-key-change-this
JWT_EXPIRES_IN=7d
```

**Important**: Change `JWT_SECRET` to a secure random string in production!

### 3. Start MongoDB

Make sure MongoDB is running on your system:

```bash
# If using local MongoDB
mongod

# Or if using MongoDB as a service
sudo systemctl start mongodb
```

### 4. Seed the Database (Optional)

Populate the database with sample data:

```bash
npm run seed
```

This creates:
- 6 student accounts
- 5 business accounts
- 10 gigs
- Sample applications

**Test Credentials:**
- Student: `alex.chen@student.edu` / `password123`
- Business: `sarah@localcafe.com` / `password123`

### 5. Run the Application

#### Option A: Full Stack (Recommended)
```bash
npm run dev
```
Access the app at: `http://localhost:5000`

#### Option B: Split Mode (Separate Frontend & Backend)

Terminal 1 (Backend):
```bash
npm run dev:server
```

Terminal 2 (Frontend):
```bash
npm run dev:client
```

- Backend: `http://localhost:5000`
- Frontend: `http://localhost:5173`

## 🏭 Production Build

```bash
# Build for production
npm run build

# Run production server
NODE_ENV=production npm start
```

## ☁️ Deployment to Vercel

This project is configured for **serverless deployment on Vercel**. See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed instructions.

**Quick Deploy:**

1. Push to GitHub
2. Import to Vercel
3. Add environment variables (MongoDB Atlas, JWT_SECRET)
4. Deploy!

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/skillbridgeyouth)

**Key Files:**
- `vercel.json` - Vercel configuration
- `api/index.js` - Serverless function entry point
- `.vercelignore` - Files to exclude from deployment

## 📡 API Documentation

### Authentication Endpoints

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "student",
  "skills": ["JavaScript", "React"]
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

#### Get Current User
```http
GET /api/auth/me
Authorization: Bearer <token>
```

#### Update Profile
```http
PATCH /api/auth/profile/update
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Updated Name",
  "skills": ["New", "Skills"]
}
```

### Gig Endpoints

#### Get All Gigs
```http
GET /api/gigs/all
```

#### Get Matched Gigs (Students Only)
```http
GET /api/gigs/matched
Authorization: Bearer <token>
```

#### Create Gig (Business Only)
```http
POST /api/gigs/create
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Web Developer Needed",
  "description": "Build a website...",
  "budget": 500,
  "location": "Remote"
}
```

#### Get My Gigs (Business Only)
```http
GET /api/gigs/my
Authorization: Bearer <token>
```

#### Delete Gig (Business Only)
```http
DELETE /api/gigs/:gigId
Authorization: Bearer <token>
```

### Application Endpoints

#### Apply to Gig (Students Only)
```http
POST /api/applications/gig/:gigId
Authorization: Bearer <token>
```

#### Get My Applications (Students Only)
```http
GET /api/applications/my
Authorization: Bearer <token>
```

#### Get Applications for Gig (Business Only)
```http
GET /api/applications/gig/:gigId
Authorization: Bearer <token>
```

#### Update Application Status (Business Only)
```http
PATCH /api/applications/:id/status
Authorization: Bearer <token>
Content-Type: application/json

{
  "status": "accepted"
}
```

## 🧪 Development Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Run full stack with Vite HMR |
| `npm run dev:server` | Run backend only (API mode) |
| `npm run dev:client` | Run frontend only (Vite dev server) |
| `npm run dev:split` | Run both servers concurrently |
| `npm run build` | Build for production |
| `npm run build:client` | Build frontend only |
| `npm run build:server` | Build backend only |
| `npm start` | Run production build |
| `npm run seed` | Seed database with sample data |

## 🏛️ Architecture

### Backend (MVC Pattern)
- **Models** - Mongoose schemas and models
- **Controllers** - Business logic and request handlers
- **Routes** - API endpoint definitions
- **Middleware** - Authentication, validation, error handling
- **Services** - Data access layer (storage.js)

### Frontend (Component-Based)
- **Services** - API communication layer
- **Contexts** - Global state management
- **Components** - Reusable UI components
- **Pages** - Route-level components
- **Hooks** - Custom React hooks

## 🔒 Security Features

- Passwords hashed with bcrypt (10 rounds)
- JWT tokens for stateless authentication
- Input validation with Zod schemas
- CORS protection
- MongoDB injection protection via Mongoose
- Environment variable validation
- Role-based access control

## 🐛 Troubleshooting

### MongoDB Connection Issues

**Error**: `MongooseError: Connection failed`

**Solution**: Ensure MongoDB is running and `MONGODB_URI` is set correctly in `.env`

### Port Already in Use

**Error**: `EADDRINUSE: address already in use`

**Solution**: Change `PORT` in `.env` or kill the existing process:

```bash
lsof -i :5000
kill -9 <PID>
```

### Vite Build Issues

**Error**: Module not found errors

**Solution**: Clear and reinstall dependencies:

```bash
rm -rf node_modules package-lock.json
npm install
```

## 📝 Environment Variables

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `NODE_ENV` | Environment mode | `development` | No |
| `PORT` | Server port | `5000` | No |
| `MONGODB_URI` | MongoDB connection string | Local MongoDB | Yes (prod) |
| `JWT_SECRET` | JWT signing secret | - | Yes (prod) |
| `JWT_EXPIRES_IN` | Token expiration | `7d` | No |
| `CLIENT_ORIGIN` | CORS origin | `*` (dev) | No |
| `USE_VITE` | Use Vite middleware | `true` (dev) | No |

## 🎯 Key Improvements Made

✅ **MVC Architecture** - Separated concerns with controllers, routes, and middleware  
✅ **Modular Structure** - Organized code into logical folders  
✅ **Error Handling** - Centralized error handling with custom error classes  
✅ **Input Validation** - Zod schemas for all API endpoints  
✅ **API Service Layer** - Clean frontend API abstraction  
✅ **Logger Utility** - Structured logging for better debugging  
✅ **Environment Config** - Centralized configuration management  
✅ **Role-Based Access** - Proper authorization middleware  
✅ **Code Reusability** - Shared validators and utilities  
✅ **Production Ready** - Optimized build and deployment scripts  

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

---

**Happy Coding! 🚀**

For questions or issues, please open an issue on GitHub.
