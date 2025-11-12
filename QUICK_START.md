# Quick Start Guide

## Initial Setup (First Time Only)

### 1. Install Dependencies
```bash
npm install
```

### 2. Create Environment File
```bash
cp .env.example .env
```

Edit `.env` and set your MongoDB URI and JWT secret:
```env
MONGODB_URI=mongodb://127.0.0.1:27017/skillbridge
JWT_SECRET=your-secret-key-here
```

### 3. Start MongoDB
```bash>
# Start MongoDB service (Ubuntu/Debian)
sudo systemctl start mongodb

# Or start mongod directly
mongod

# Or if using Docker
docker run -d -p 27017:27017 --name mongodb mongo:latest
```

### 4. Seed the Database (Optional but Recommended)
```bash
npm run seed
```

This creates test users and sample data.

## Running the Application

### Development Mode (Full Stack)
```bash
npm run dev
```
Opens at: http://localhost:5000

### Development Mode (Split - Frontend & Backend Separate)

**Terminal 1 - Backend:**
```bash
npm run dev:server
```

**Terminal 2 - Frontend:**
```bash
npm run dev:client
```

- Backend: http://localhost:5000
- Frontend: http://localhost:5173

## Testing the Application

### Test Credentials
After seeding, you can login with:

**Student Account:**
- Email: `alex.chen@student.edu`
- Password: `password123`

**Business Account:**
- Email: `sarah@localcafe.com`
- Password: `password123`

### Manual Testing Endpoints

#### Health Check
```bash
curl http://localhost:5000/api/health
```

#### Register New User
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "password123",
    "role": "student",
    "skills": ["JavaScript", "React"]
  }'
```

#### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "alex.chen@student.edu",
    "password": "password123"
  }'
```

#### Get All Gigs
```bash
curl http://localhost:5000/api/gigs/all
```

## Production Build

### Build
```bash
npm run build
```

### Run
```bash
NODE_ENV=production npm start
```

## Troubleshooting

### Dependencies Not Installed
```bash
rm -rf node_modules package-lock.json
npm install
```

### MongoDB Not Running
```bash
# Check if MongoDB is running
ps aux | grep mongod

# Start MongoDB
sudo systemctl start mongodb

# Check MongoDB status
sudo systemctl status mongodb
```

### Port Already in Use
```bash
# Find process using port 5000
lsof -i :5000

# Kill the process
kill -9 <PID>
```

### Clear MongoDB Data
```bash
# Connect to MongoDB
mongosh

# Switch to skillbridge database
use skillbridge

# Drop all collections
db.dropDatabase()

# Exit
exit

# Re-seed
npm run seed
```

## File Structure Reference

```
server/
├── config/
│   ├── database.js    # DB connection
│   └── env.js         # Environment config
├── controllers/       # Business logic
├── middleware/        # Auth, validation, errors
├── routes/           # API endpoints
├── utils/            # Logger, errors
├── app.js            # Express setup
├── index.js          # Server entry
├── models.js         # Mongoose models
├── storage.js        # Data access
└── seed.js           # Database seeding

client/src/
├── services/         # API communication
├── contexts/         # React contexts
├── components/       # UI components
├── pages/           # Route components
└── App.jsx          # Root component
```

## Development Workflow

1. **Create a feature branch**
   ```bash
   git checkout -b feature/my-feature
   ```

2. **Make changes** to controllers, services, or components

3. **Test locally**
   ```bash
   npm run dev
   ```

4. **Commit changes**
   ```bash
   git add .
   git commit -m "Add my feature"
   ```

5. **Push to remote**
   ```bash
   git push origin feature/my-feature
   ```

## Common Commands

```bash
# Development
npm run dev              # Full stack
npm run dev:server       # Backend only
npm run dev:client       # Frontend only
npm run dev:split        # Both separate

# Production
npm run build           # Build everything
npm run build:client    # Build frontend
npm run build:server    # Build backend
npm start              # Run production

# Database
npm run seed           # Seed database
mongosh skillbridge    # Access DB

# Cleanup
rm -rf node_modules    # Remove dependencies
rm -rf dist            # Remove builds
```

## Next Steps

1. ✅ Read the main README.md for detailed documentation
2. ✅ Check RESTRUCTURING_SUMMARY.md for architecture details
3. ✅ Explore the API endpoints at http://localhost:5000/api
4. ✅ Start building new features!

## Getting Help

- Check `README.md` for comprehensive documentation
- Review `RESTRUCTURING_SUMMARY.md` for architecture
- Check API responses for detailed error messages
- Look at server logs for debugging information

---

**Happy Coding! 🚀**
