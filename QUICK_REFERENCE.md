# 🔧 AdFlow Pro - Quick Reference & Patterns

## 1. Project Architecture Overview

```
┌─────────────────────────────────────────────────────────┐
│  Browser (React Frontend)                               │
│  - Pages, Components, Hooks, Context                    │
│  - Tailwind CSS styling                                 │
└──────────────────┬──────────────────────────────────────┘
                   │ HTTPS/JSON
                   │
┌──────────────────▼──────────────────────────────────────┐
│  API Server (Express)                                   │
│  - Routes → Controllers → Services → Database           │
│  - JWT Authentication & RBAC                            │
│  - Validation, Error Handling, Logging                  │
└──────────────────┬──────────────────────────────────────┘
                   │ Postgres Protocol
                   │
┌──────────────────▼──────────────────────────────────────┐
│  Supabase (Postgres + Auth)                             │
│  - All data stored here                                 │
│  - Real-time capabilities                               │
│  - Built-in backups                                     │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│  Background Jobs (node-cron)                            │
│  - Publishing scheduler                                 │
│  - Expiry automation                                    │
│  - Notifications                                        │
│  - Database heartbeat                                   │
└─────────────────────────────────────────────────────────┘
```

---

## 2. Database Design Patterns

### Entity Relationships
```
users
  ├─ seller_profiles (1:1)
  ├─ ads (1:many)
  ├─ payments (1:many)
  ├─ notifications (1:many)
  └─ audit_logs (1:many)

packages
  └─ ads (1:many)

categories
  └─ ads (1:many)

cities
  └─ ads (1:many)

ads
  ├─ ad_media (1:many)
  ├─ payments (1:1)
  ├─ ad_status_history (1:many)
  └─ audit_logs (1:many)
```

### Key Design Principles
1. **Normalization**: No redundant data
2. **Referential Integrity**: Foreign keys prevent orphaned records
3. **Soft Deletes**: Archive instead of delete (status column)
4. **Audit Trail**: Every change logged
5. **Indexes**: On frequently queried columns

---

## 3. API Response Format

### Success Response
```json
{
  "success": true,
  "message": "Operation completed",
  "data": {
    "id": "uuid",
    "name": "Example",
    ...
  }
}
```

### Paginated Success
```json
{
  "success": true,
  "data": [
    { "id": "1", "name": "Item 1" },
    { "id": "2", "name": "Item 2" }
  ],
  "meta": {
    "total": 100,
    "page": 1,
    "limit": 20,
    "pages": 5
  }
}
```

### Error Response
```json
{
  "success": false,
  "message": "User-friendly error message",
  "errors": {
    "email": ["Email must be unique"],
    "password": ["Password must be at least 8 characters"]
  }
}
```

### HTTP Status Codes
- `200` - Success
- `201` - Created
- `400` - Bad Request (validation error)
- `401` - Unauthorized (no token or invalid)
- `403` - Forbidden (not enough permissions)
- `404` - Not Found
- `409` - Conflict (duplicate entry)
- `500` - Server Error

---

## 4. Authentication Flow

### Step-by-Step
```
1. User fills registration form
2. Frontend POST /api/auth/register
3. Backend validates with Zod schema
4. Supabase Auth creates user account
5. User profile created in users table
6. JWT token generated (includes user ID, email, role)
7. Token returned to frontend
8. Frontend stores in localStorage
9. Frontend redirects to dashboard

Subsequent requests:
10. Frontend adds header: Authorization: Bearer <token>
11. Backend middleware verifies token
12. Decoded token includes User ID & Role
13. Request proceeds with req.userId set
14. If token expired, frontend gets 401 → auto-refresh
```

### Code Pattern
```typescript
// Backend: Protecting a route
router.post('/ads', authMiddleware, requireRole('client'), 
  validateRequest(CreateAdSchema), createAd);

// Middleware executes in order:
// 1. authMiddleware - checks token, sets req.userId
// 2. requireRole - checks if user has role
// 3. validateRequest - validates input with Zod
// 4. createAd - handler function

// Frontend: Making authenticated request
const response = await apiClient.post('/api/client/ads', {
  title: 'Ad Title',
  description: 'Ad description',
  category_id: 'uuid',
  city_id: 'uuid',
  media_urls: [{ source_type: 'image', original_url: 'https://...' }]
});

// apiClient automatically adds Authorization header
```

---

## 5. Ad Lifecycle State Machine

```
┌──────────┐
│  DRAFT   │ ← User creates ad form
└────┬─────┘
     │ User submits for review
     ▼
┌──────────────┐
│  SUBMITTED   │ ← Awaiting moderator review
└────┬─────────┘
     │ Moderator approves
     │ OR rejects
     ├─────→ REJECTED ✗
     │
     ▼
┌──────────────────┐
│ PAYMENT_PENDING  │ ← Awaiting client payment
└────┬─────────────┘
     │ Client submits payment proof
     ▼
┌──────────────────┐
│ PAYMENT_SUBMITTED│ ← Awaiting admin verification
└────┬─────────────┘
     │ Admin verifies
     │ OR rejects
     ├─────→ (back to PAYMENT_PENDING)
     │
     ▼
┌──────────────────┐
│ PAYMENT_VERIFIED │ ← Ready to publish
└────┬─────────────┘
     │ Admin publishes now
     │ OR schedules
     ├─────→ SCHEDULED (if future date)
     │       └─→ [cron job] → PUBLISHED
     │
     ├─────→ PUBLISHED ✓ (visible to public)
     │
     └─────→ expires (auto by cron)
             └─→ EXPIRED
                 └─→ ARCHIVED

Key Points:
- Each transition validated
- Previous state stored in ad_status_history
- User and timestamp recorded
- Notifications sent on state changes
```

---

## 6. Common Code Patterns

### Backend Route Pattern
```typescript
// routes/admin.ts
import { Router } from 'express';
import { authMiddleware, requireRole } from '@middlewares/auth';
import { validateRequest } from '@middlewares/validation';
import { VerifyPaymentSchema } from '@shared/schemas';
import { verifyPayment } from '@controllers/paymentController';

const router = Router();

// Route definition:
// METHOD | ENDPOINT | MIDDLEWARE | MIDDLEWARE | MIDDLEWARE | HANDLER
router.patch(
  '/payments/:id/verify',
  authMiddleware,          // Step 1: Verify JWT
  requireRole('admin'),    // Step 2: Check role
  validateRequest(VerifyPaymentSchema), // Step 3: Validate input
  verifyPayment            // Step 4: Business logic
);

export default router;
```

### Frontend Hook Pattern
```typescript
// hooks/useAds.ts
import { useState, useEffect } from 'react';
import { useAuth } from '@context/AuthContext';
import { Ad } from '@shared/types';

export function useAds() {
  const { apiClient } = useAuth();
  const [ads, setAds] = useState<Ad[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch ads on mount
  useEffect(() => {
    fetchAds();
  }, []);

  const fetchAds = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiClient.get('/client/ads');
      setAds(response.data.data);
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to fetch ads');
    } finally {
      setLoading(false);
    }
  };

  const createAd = async (adData: CreateAdInput) => {
    try {
      const response = await apiClient.post('/client/ads', adData);
      setAds([...ads, response.data.data]);
      return response.data.data;
    } catch (err) {
      throw new Error(err?.response?.data?.message || 'Failed to create ad');
    }
  };

  return { ads, loading, error, fetchAds, createAd };
}
```

### Frontend Component Pattern
```typescript
// pages/BrowseAdsPage.tsx
import React, { useState } from 'react';
import { useAds } from '@hooks/useAds';
import { AdCard } from '@components/AdCard';
import { AdFilters } from '@components/AdFilters';

export const BrowseAdsPage: React.FC = () => {
  const { ads, loading, error, fetchAds } = useAds();
  const [filters, setFilters] = useState<AdFilterInput>({
    page: 1,
    limit: 20,
    sort_by: 'rank'
  });

  const handleFilterChange = (newFilters: AdFilterInput) => {
    setFilters(newFilters);
    fetchAds(); // Refetch with new filters
  };

  if (error) {
    return <div className="text-red-600">Error: {error}</div>;
  }

  return (
    <div className="flex gap-4">
      <aside className="w-64">
        <AdFilters onFilter={handleFilterChange} />
      </aside>

      <main className="flex-1">
        {loading ? (
          <div>Loading...</div>
        ) : (
          <div className="grid grid-cols-3 gap-4">
            {ads.map(ad => (
              <AdCard key={ad.id} ad={ad} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
};
```

---

## 7. Validation Patterns

### Zod Schema Pattern
```typescript
// Define schema
const CreateUserSchema = z.object({
  name: z.string().min(2).max(255),
  email: z.string().email(),
  password: z.string().min(8),
});

type CreateUserInput = z.infer<typeof CreateUserSchema>;

// Backend: Use in middleware
router.post('/users', validateRequest(CreateUserSchema), createUser);

// Frontend: Use before sending
try {
  const validated = await CreateUserSchema.parseAsync(formData);
  await api.post('/users', validated);
} catch (error) {
  if (error instanceof ZodError) {
    // Show validation errors to user
  }
}
```

### Database Validation Pattern
```typescript
// In controller: Primary validation
const ad = await getAdById(req.body.ad_id);
if (!ad) {
  return res.status(404).json({ success: false, message: 'Ad not found' });
}

if (ad.status !== 'payment_pending') {
  return res.status(409).json({ 
    success: false, 
    message: 'Ad must be in payment_pending status' 
  });
}

// Check for duplicates
const { data: existing } = await supabase
  .from('payments')
  .select('id')
  .eq('transaction_ref', req.body.transaction_ref)
  .single();

if (existing) {
  return res.status(409).json({ 
    success: false, 
    message: 'This transaction reference already exists' 
  });
}
```

---

## 8. Error Handling Patterns

### Backend: Try-Catch Pattern
```typescript
export async function createAd(req: Request, res: Response) {
  try {
    // 1. Database call
    const { data: ad, error: dbError } = await supabase
      .from('ads')
      .insert([adData])
      .select()
      .single();

    // 2. Check for errors
    if (dbError || !ad) {
      return res.status(500).json({ 
        success: false, 
        message: 'Failed to create ad' 
      });
    }

    // 3. Return success
    return res.status(201).json({
      success: true,
      data: ad
    });
  } catch (error) {
    console.error('Create ad error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
}
```

### Frontend: Error Display Pattern
```typescript
const [error, setError] = useState<string | null>(null);

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setError(null);

  try {
    // API call
    await apiClient.post('/api/ads', formData);
    // Success - redirect
  } catch (err: any) {
    // Extract error message
    const message = err.response?.data?.message || err.message || 'An error occurred';
    setError(message);
  }
};

return (
  <>
    {error && (
      <div className="bg-red-100 border border-red-400 text-red-700 p-4 rounded">
        {error}
      </div>
    )}
    {/* Form content */}
  </>
);
```

---

## 9. Common Mistakes & Prevention

| Mistake | Prevention |
|---------|-----------|
| SQL Injection | Always use parameterized queries (supabase does this) |
| XSS Attacks | Sanitize user input, use React's default escaping |
| CSRF Attacks | Use CORS properly, validate origins |
| Race Conditions | Use database constraints (unique, foreign keys) |
| Unhandled Promises | Always use try-catch or .catch() |
| Stale State | Use proper dependency arrays in useEffect |
| Missing Error Handling | Every async operation needs error handling |
| Hardcoded Secrets | Use .env files, never commit secrets |
| Token Exposure | Store in httpOnly cookies or localStorage (with care) |
| Incomplete Validation | Validate on both frontend AND backend |

---

## 10. Testing Checklist

### Unit Tests (Backend)
- [ ] Validation schemas reject invalid input
- [ ] Auth middleware rejects invalid tokens
- [ ] Role checks prevent unauthorized access
- [ ] Database errors handled gracefully

### Integration Tests
- [ ] Register + Login flow works end-to-end
- [ ] Ad creation through publishing works
- [ ] Payment verification updates ad status
- [ ] Cron jobs update database correctly

### Manual Testing
- [ ] All forms validate client-side
- [ ] All error messages are user-friendly
- [ ] All links navigate correctly
- [ ] Images load without breaking layout
- [ ] Responsive design works on mobile/tablet/desktop

### Security Testing
- [ ] No passwords in logs
- [ ] No sensitive data in error messages
- [ ] CORS restricts to allowed origins
- [ ] Database backups exist
- [ ] Rate limiting considered

---

## 11. Performance Optimization Tips

### Database
```sql
-- Add indexes on frequently queried columns
CREATE INDEX idx_ads_status ON ads(status);
CREATE INDEX idx_ads_user_id ON ads(user_id);
CREATE INDEX idx_payments_status ON payments(status);

-- Use EXPLAIN ANALYZE to check query efficiency
EXPLAIN ANALYZE SELECT * FROM ads WHERE status = 'published';

-- Limit results in queries
SELECT * FROM ads WHERE status = 'published' LIMIT 20;
```

### Backend
```typescript
// Cache frequently accessed data
const packageCache = new Map();

export async function getPackages() {
  if (packageCache.has('all')) {
    return packageCache.get('all');
  }
  const packages = await supabase.from('packages').select();
  packageCache.set('all', packages);
  return packages;
}

// Use pagination
const limit = 20;
const offset = (page - 1) * limit;
const { data } = await supabase
  .from('ads')
  .select()
  .range(offset, offset + limit - 1);
```

### Frontend
```typescript
// Lazy load images
<img loading="lazy" src="url" />

// Code splitting
const Dashboard = lazy(() => import('./pages/Dashboard'));

// Memoize expensive components
const AdCard = memo(({ ad }: AdCardProps) => (...));

// Debounce search input
const debouncedSearch = useCallback(
  debounce((query: string) => {
    fetchAds(query);
  }, 300),
  []
);
```

---

## 12. Useful Commands

```bash
# Backend
npm run dev          # Start development server
npm run build        # Build for production
npm run lint         # Check code quality
npm run format       # Format code

# Frontend
npm start            # Start dev server
npm run build        # Create production build
npm run test         # Run tests
npm run eject        # Expose CRA configuration

# Database
# In Supabase SQL Editor:
# - Copy 001_init_schema.sql and execute
# - Can run custom queries
# - View real-time charts

# Git
git add .            # Stage changes
git commit -m "msg"  # Commit with message
git push             # Push to remote
git log              # View commit history
```

---

## 13. Files Quick Reference

| File | Purpose |
|------|---------|
| `shared/types/` | TypeScript interfaces |
| `shared/schemas/` | Zod validation |
| `shared/constants/` | App-wide constants |
| `server/src/db/client.ts` | Database queries |
| `server/src/middlewares/` | Auth, validation |
| `server/src/controllers/` | Business logic |
| `server/src/routes/` | API endpoints |
| `client/src/context/` | Global state (Auth) |
| `client/src/hooks/` | Custom React hooks |
| `client/src/pages/` | Full page components |
| `client/src/components/` | Reusable UI components |
| `database/001_init_schema.sql` | Database setup |

---

**Remember:** Good code is code that can be understood by someone reading it for the first time. Comment where logic is complex, use clear variable names, and follow patterns consistently!

Good luck! 🎉
