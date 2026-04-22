# 🎯 AdFlow Pro - Getting Started Guide

## Step-by-Step Setup Instructions

### Phase 0: Prerequisites (10 minutes)

1. **Install Node.js**
   - Download from [nodejs.org](https://nodejs.org)
   - Choose LTS version (18.x or higher)
   - Verify installation: `node --version`

2. **Setup Supabase Account**
   - Go to [supabase.com](https://supabase.com)
   - Sign up with GitHub/Google
   - Create a new organization and project
   - Save your Project URL and API Keys

3. **Create GitHub Repository** (Optional but recommended)
   ```bash
   git init
   git add .
   git commit -m "Initial commit: AdFlow Pro setup"
   git branch -M main
   # git remote add origin https://github.com/your-username/adflow-pro.git
   # git push -u origin main
   ```

### Phase 1: Database Setup (15 minutes)

1. **Login to Supabase**
2. **Open SQL Editor**
3. **Copy and run** `database/001_init_schema.sql`
4. **Verify tables created** - Check Table Editor in Supabase dashboard
5. **Note down credentials:**
   - Project URL: `https://YOUR-PROJECT.supabase.co`
   - Anon Key: `eyJ...` (from Settings → API)
   - Service Role Key: `eyJ...` (for backend)

### Phase 2: Server Setup (15 minutes)

```bash
# Navigate to server
cd server

# Install dependencies
npm install

# Create .env file (copy from .env.example)
cp .env.example .env

# Edit .env with your Supabase credentials
# SUPABASE_URL=https://YOUR-PROJECT.supabase.co
# SUPABASE_KEY=your-anon-key
# JWT_SECRET=your-random-secret-key-minimum-32-chars
# DATABASE_URL=postgresql://postgres.YOUR-PROJECT:password@db.YOUR-PROJECT.supabase.co:5432/postgres

# Test the server
npm run dev
```

✅ Server should start on `http://localhost:5000`

### Phase 3: Client Setup (15 minutes)

```bash
# Navigate to client folder
cd ../client

# Install dependencies
npm install

# Create .env.local
echo "REACT_APP_API_URL=http://localhost:5000/api" > .env.local

# Start React app
npm start
```

✅ Frontend should open at `http://localhost:3000`

### Phase 4: Test Authentication (10 minutes)

1. **Register new account** at `/register`
   - Fill in name, email, password
   - Select role (default: client)

2. **Login** with credentials
   - Check if token is stored in localStorage
   - Verify user data displays

3. **Make API call** through browser devtools:
   ```javascript
   // In browser console
   fetch('http://localhost:5000/api/packages')
     .then(r => r.json())
     .then(d => console.log(d))
   ```

✅ Should return list of packages

### Phase 5: Verify Full Stack (10 minutes)

**Backend Tests:**
```bash
# Terminal 1: In server folder
npm run dev

# In another terminal or curl:
curl http://localhost:5000/api/health
# Should return: {"success":true,"message":"Server is running"}

curl http://localhost:5000/api/packages
# Should return array of packages

curl http://localhost:5000/api/health/db
# Should return: {"success":true,"message":"Database is healthy"}
```

**Frontend Tests:**
1. Navigate to `http://localhost:3000`
2. Page should load without console errors
3. Try login/register flow

---

## 📋 Implementation Checklist

### Week 1: Planning & Schema ✅

- [x] Database schema designed
- [x] Tables and relationships created
- [x] SQL migrations written
- [x] API routes planned
- [x] TypeScript types defined
- [x] Validation schemas created

### Week 2: Authentication & Dashboards

- [ ] **Backend**
  - [ ] JWT middleware working
  - [ ] Register endpoint implemented
  - [ ] Login endpoint implemented
  - [ ] Current user endpoint
  - [ ] Token refresh logic

- [ ] **Frontend**
  - [ ] Login page created
  - [ ] Register page created
  - [ ] Auth context setup
  - [ ] Protected routes implemented
  - [ ] Token storage in localStorage

- [ ] **Testing**
  - [ ] Register user and verify DB entry
  - [ ] Login and verify token generation
  - [ ] Test localStorage persistence
  - [ ] Test logout functionality

### Week 3: Ads Workflow & Packages

- [ ] **Backend - Ad Management**
  - [ ] Create ad endpoint (client)
  - [ ] Update ad endpoint
  - [ ] Get user's ads endpoint
  - [ ] Ad submission logic
  - [ ] Package selection flow

- [ ] **Backend - Testing**
  - [ ] Test draft ad creation
  - [ ] Test ad submission (status change)
  - [ ] Test package selection

- [ ] **Frontend - Ad Creation**
  - [ ] Ad creation form page
  - [ ] Form validation with Zod
  - [ ] Media URL input fields
  - [ ] Package selection UI
  - [ ] Client dashboard showing ads

### Week 4: Payments, Publishing & Expiry

- [ ] **Backend - Payments**
  - [ ] Submit payment endpoint
  - [ ] Get payment records
  - [ ] Payment verification endpoint (admin)
  - [ ] Duplicate transaction detection

- [ ] **Backend - Publishing**
  - [ ] Publish ad endpoint (admin)
  - [ ] Schedule publish logic
  - [ ] Expire ads cron job
  - [ ] Status transition validations

- [ ] **Frontend - Payment UI**
  - [ ] Payment submission form
  - [ ] Payment status tracking
  - [ ] Admin payment queue page

### Week 5: Search, Analytics & QA

- [ ] **Backend - Search**
  - [ ] Browse ads endpoint (public)
  - [ ] Category filtering
  - [ ] City filtering
  - [ ] Search by title/description
  - [ ] Pagination support
  - [ ] Ranking formula implementation

- [ ] **Backend - Analytics**
  - [ ] Dashboard metrics endpoint
  - [ ] Revenue calculations
  - [ ] Moderation stats

- [ ] **Frontend - Public Pages**
  - [ ] Landing page
  - [ ] Ads browse/explore page
  - [ ] Ad detail page
  - [ ] Category pages
  - [ ] Package information page

- [ ] **Frontend - Internal Pages**
  - [ ] Moderator review queue
  - [ ] Admin dashboard
  - [ ] Analytics page

### Week 6: Deployment & Polish

- [ ] **QA & Testing**
  - [ ] Test all auth flows
  - [ ] Test ad lifecycle (draft → published → expired)
  - [ ] Test role-based access
  - [ ] Test payment verification
  - [ ] Test search and filtering

- [ ] **Documentation**
  - [ ] API documentation (Postman collection)
  - [ ] Database schema documentation
  - [ ] Deployment guide
  - [ ] Setup instructions

- [ ] **Deployment**
  - [ ] Deploy to Vercel (frontend)
  - [ ] Deploy backend (Render/Railway)
  - [ ] Setup environment variables
  - [ ] SSL certificate setup
  - [ ] Test live deployment

- [ ] **Demo Preparation**
  - [ ] Record screen walkthrough
  - [ ] Create presentation slides
  - [ ] Prepare answers to viva questions

---

## 🎓 Step-by-Step Feature Implementation Guide

### Feature: Create & Submit Ad

#### Backend Implementation
```typescript
// server/src/controllers/adController.ts

// 1. Create draft ad
export async function createAdDraft(req: Request, res: Response) {
  // Validate input with schema
  // Create database entry with status='draft'
  // Return created ad
}

// 2. Submit ad for review
export async function submitAd(req: Request, res: Response) {
  // Validate ad exists and is in draft
  // Update status to 'submitted'
  // Log to audit_logs
  // Return updated ad
}
```

#### Frontend Implementation
```typescript
// client/src/pages/CreateAdPage.tsx

// 1. Form with title, description, category, city, media URLs
// 2. Validation using Zod schema
// 3. POST to /api/client/ads
// 4. Success → redirect to dashboard
```

---

## 🧪 API Testing with curl

### Register User
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Ahmed Khan",
    "email": "ahmed@example.com",
    "password": "securepassword123",
    "role": "client"
  }'
```

### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "ahmed@example.com",
    "password": "securepassword123"
  }'
```

### Get Packages (with token)
```bash
curl -X GET http://localhost:5000/api/packages \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

## ✨ Common Mistakes to Avoid

1. **JWT Secret too short** - Minimum 32 characters
2. **Forgetting .env files** - Server won't start without them
3. **CORS not configured** - Frontend can't reach backend
4. **Not handling errors** - Always wrap try-catch
5. **Forgetting to seed data** - Use sample data for testing
6. **Date NOT normalized** - Always convert to ISO strings
7. **Media URLs not validated** - Check domain whitelist
8. **Race conditions in payments** - Use unique constraints on transaction_ref

---

## 🚀 Next Steps After Setup

1. **Create sample data:** Run seed script with 15-25 test ads
2. **Test all flows:** Go through complete ad lifecycle manually
3. **Performance check:** Verify queries run in < 200ms
4. **Security audit:** Validate CORS, JWT, SQL injection protections
5. **Deploy:** Push to Vercel/Railway for production testing
6. **Optimize:** Add caching, compression, pagination

---

## 📞 Getting Help

### Stuck on Database?
- Check Supabase dashboard for table creation
- Review SQL syntax errors in dashboard
- Verify connections with simple SELECT query

### Backend Error?
- Check console output for error messages
- Verify .env variables are set correctly
- Test endpoints with curl before frontend

### Frontend Not Connecting?
- Check browser Network tab in DevTools
- Verify API_URL in .env.local
- Check CORS error messages in console

---

**Good luck! You've got this! 💪**
