# 🚀 AdFlow Pro - Sponsored Listing Marketplace

A production-style classified ads workflow platform with moderation, scheduling, payment verification, analytics, and external media normalization. Built with React, Express, Supabase, and Tailwind CSS.

## 📋 Project Structure

```
flow/
├── server/                 # Express backend
│   ├── src/
│   │   ├── index.ts       # Main server entry
│   │   ├── routes/        # API route handlers
│   │   ├── controllers/   # Business logic
│   │   ├── services/      # Reusable services
│   │   ├── middlewares/   # Auth, validation, error handling
│   │   ├── validators/    # Zod schemas
│   │   ├── db/            # Database client & queries
│   │   ├── cron/          # Scheduled jobs
│   │   └── utils/         # Helper functions
│   ├── package.json
│   ├── tsconfig.json
│   └── .env.example
│
├── client/                 # React frontend
│   ├── src/
│   │   ├── pages/         # Page components
│   │   ├── components/    # Reusable components
│   │   ├── features/      # Feature-specific modules
│   │   ├── context/       # React context (auth, etc)
│   │   ├── hooks/         # Custom hooks
│   │   ├── utils/         # Helper functions
│   │   └── App.tsx        # Main app component
│   ├── public/
│   ├── package.json
│   ├── tsconfig.json
│   └── .env.example
│
├── shared/                 # Shared types, schemas, constants
│   ├── types/             # TypeScript interfaces
│   ├── schemas/           # Zod validation schemas
│   └── constants/         # Application constants
│
└── database/              # Database migrations & SQL
    └── 001_init_schema.sql
```

## 🔑 Key Features

### 1. **Multi-Role Access Control**
- **Client**: Create ads, submit payment, track status
- **Moderator**: Review content, flag suspicious media, add notes
- **Admin**: Verify payments, publish, schedule ads, manage users
- **Super Admin**: System-wide access, manage packages and settings

### 2. **Ad Lifecycle Workflow**
- Draft → Submitted → Under Review → Payment Verified → Scheduled → Published → Expired/Archived
- Automatic status transitions based on business rules
- Complete audit trail of all changes

### 3. **Package Engine**
- **Basic** (7 days): Entry-level listing
- **Standard** (15 days): Category priority
- **Premium** (30 days): Homepage featured with auto-refresh

### 4. **External Media Handling**
- No local image uploads
- Support for GitHub URLs, Imgur, YouTube, Cloudinary
- Automatic thumbnail generation for videos
- URL validation and normalization

### 5. **Payment Verification**
- Transaction reference-based proof
- Optional screenshot upload
- Duplicate transaction detection
- Payment status tracking

### 6. **Automated Jobs**
- Publish scheduled ads hourly
- Expire outdated ads daily
- Send expiring-soon notifications
- Database heartbeat monitoring

### 7. **Search & Discovery**
- Category and city filtering
- Smart ranking formula (featured, package weight, freshness)
- Pagination support
- Public-only view of approved listings

## 🛠️ Tech Stack

### Backend
- **Node.js + Express**: REST API server
- **Supabase Postgres**: Database with auth
- **JWT**: Stateless authentication
- **Zod**: Data validation
- **node-cron**: Scheduled jobs
- **TypeScript**: Type safety

### Frontend
- **React 18**: UI library
- **React Router**: Client-side routing
- **Axios**: HTTP client
- **Tailwind CSS**: Styling
- **Zustand**: State management (optional)
- **TypeScript**: Type safety

### Infrastructure
- **Supabase** (Postgres + Auth)
- **Vercel** (Deployment)

## 📦 Installation & Setup

### Prerequisites
- Node.js 16+
- npm or yarn
- Supabase account
- Git

### 1. Clone Repository
```bash
cd d:\flow
git init
```

### 2. Setup Database (Supabase)
1. Create a new Supabase project
2. Go to SQL Editor
3. Copy content from `database/001_init_schema.sql`
4. Execute in SQL Editor
5. Get credentials from Settings → API Keys

### 3. Setup Backend

```bash
cd server
npm install
```

Create `.env`:
```bash
cp .env.example .env
# Edit .env with your Supabase credentials and JWT secret
```

Start development server:
```bash
npm run dev
```

Server runs on: `http://localhost:5000`

### 4. Setup Frontend

```bash
cd ../client
npm install
```

Create `.env.local`:
```bash
REACT_APP_API_URL=http://localhost:5000/api
```

Start React app:
```bash
npm start
```

App runs on: `http://localhost:3000`

## 📚 API Endpoints

### Public Endpoints
```
GET  /api/packages              # List all packages
GET  /api/categories            # List categories
GET  /api/cities                # List cities
GET  /api/questions/random      # Random learning question
GET  /api/health/db             # Database health check
```

### Authentication
```
POST /api/auth/register         # Register user
POST /api/auth/login            # Login user
GET  /api/auth/me               # Get current user
POST /api/auth/logout           # Logout
POST /api/auth/refresh          # Refresh token
```

### Client Routes (Protected)
```
POST   /api/client/ads          # Create ad draft
PATCH  /api/client/ads/:id      # Update ad
POST   /api/client/payments     # Submit payment
GET    /api/client/dashboard    # View own listings
```

### Moderator Routes (Protected)
```
GET    /api/moderator/reviewqueue   # Review queue
PATCH  /api/moderator/ads/:id/review # Approve/Reject ad
```

### Admin Routes (Protected)
```
GET    /api/admin/payment-queue     # Payment queue
PATCH  /api/admin/payments/:id/verify # Verify payment
PATCH  /api/admin/ads/:id/publish   # Publish ad
GET    /api/admin/analytics/summary # Analytics dashboard
```

## 🔐 Authentication Flow

1. User registers/logs in
2. Backend validates credentials with Supabase Auth
3. JWT token generated and returned
4. Client stores token in localStorage
5. All subsequent requests include `Authorization: Bearer <token>`
6. Middleware verifies token on protected routes

## 📊 Database Schema

### Core Tables
- `users` - User accounts and roles
- `ads` - Main listing records
- `packages` - Listing packages (Basic, Standard, Premium)
- `categories` - Ad categories
- `cities` - Location taxonomy
- `payments` - Payment verification records
- `ad_media` - External media URLs and metadata
- `notifications` - In-app alerts
- `ad_status_history` - Workflow tracking
- `audit_logs` - Complete action audit trail
- `system_health_logs` - Monitoring data

## 🎯 Business Rules

1. **Only approved and non-expired ads are public**
2. **Clients can edit drafts**, but published ads need admin review for changes
3. **Payment required** before ad can be published
4. **Scheduled ads** become visible only when publish_at is reached
5. **Auto-expiry** when expire_at passes
6. **Media URLs validated** before storage
7. **All changes logged** in audit_logs and ad_status_history

## 🚀 Deployment

### Vercel (Recommended)

#### Frontend
1. Push code to GitHub
2. Connect repo to Vercel
3. Set environment variables
4. Deploy ✅

#### Backend (as Serverless Functions)
1. Convert Express routes to Vercel functions
2. Deploy `/api` folder
3. Set environment variables in Vercel dashboard

### Alternative: Traditional Hosting
- Deploy server on Railway, Render, or Heroku
- Deploy frontend on Netlify or Vercel
- Set `REACT_APP_API_URL` to backend domain

## 📝 Development Workflow

### 1. Database Changes
```bash
# Edit database/001_init_schema.sql
# Execute in Supabase SQL Editor
# Or create migration: database/002_add_feature.sql
```

### 2. Add API Endpoint
```yaml
1. Add controller in server/src/controllers/
2. Add route in server/src/routes/
3. Add type in shared/types/
4. Add schema in shared/schemas/
5. Add constants if needed
6. Test with Postman/Curl
```

### 3. Add Frontend Page
```yaml
1. Create component in client/src/pages/
2. Add route in client/src/App.tsx
3. Create hooks if needed in client/src/hooks/
4. Use context for state management
5. Test in browser
```

## 🧪 Testing

### Backend
```bash
# Add unit tests
npm run test

# Run linter
npm run lint

# Format code
npm run format
```

### Frontend
```bash
npm run test
npm run build
```

## 📖 Learning Outcomes

By completing this project, students will master:
- ✅ Multi-role RBAC systems
- ✅ Complex workflow state machines
- ✅ RESTful API design
- ✅ PostgreSQL relational modeling
- ✅ JWT authentication
- ✅ External API integration
- ✅ Scheduled jobs/cron
- ✅ Full-stack deployment
- ✅ Production best practices

## 🤝 Contributing

1. Create feature branch: `git checkout -b feature/name`
2. Make changes and commit: `git commit -m "feat: description"`
3. Push to branch: `git push origin feature/name`
4. Create Pull Request

## 📋 Checklist for Submission

- [ ] GitHub repository created and linked
- [ ] Database schema executed in Supabase
- [ ] Server running without errors
- [ ] Client frontend running
- [ ] Authentication working (login/register)
- [ ] At least one API endpoint tested
- [ ] Sample data inserted
- [ ] Postman collection created
- [ ] Deployment link working
- [ ] README documentation complete
- [ ] Code formatted and linted
- [ ] Demo video recorded

## 🆘 Troubleshooting

### Supabase Connection Issues
```bash
# Check credentials in .env
# Verify Supabase project is active
# Check network connectivity
```

### CORS Issues
```bash
# Add CLIENT_URL to server .env
# Frontend URL must match exactly
```

### Token Expired
```bash
# Token refresh automatic via interceptor
# Check JWT_EXPIRY in server .env
```

## 📞 Support

- Check existing issues on GitHub
- Review Supabase documentation
- Consult Express.js guides
- Check React documentation

## 📄 License

MIT License - feel free to use for educational purposes

---

**Happy coding! 🎉**
