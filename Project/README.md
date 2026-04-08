# AdFlow Pro

A sponsored listing marketplace built with Node.js, Express, React, and Supabase.

## Features

- **Multi-role Authentication**: Client, Moderator, Admin, Super Admin
- **Ad Lifecycle Management**: Draft → Submitted → Under Review → Payment Pending → Published → Expired
- **External Media Handling**: Support for images and videos from external URLs
- **Package System**: Basic, Standard, Premium packages with different features
- **Ranking Algorithm**: Combines package strength, freshness, and admin boosts
- **Scheduled Jobs**: Automatic publishing, expiry, and notifications
- **Analytics Dashboard**: Track views, revenue, and system metrics

## Setup

1. **Backend Setup**:
   - Navigate to `server/` directory
   - Run `npm install`
   - Set up Supabase project and update `.env` with your credentials
   - Run the SQL schema from `shared/schemas/database.sql`
   - Run `npm start`

2. **Frontend Setup**:
   - Navigate to `client/` directory
   - Run `npm install`
   - Run `npm start`

3. **Environment Variables**:
   - Update `server/.env` with Supabase URL and keys
   - Update `client/src/utils/config.js` with API base URL

## API Endpoints

- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/ads` - Browse ads
- `POST /api/ads` - Create ad (client)
- `POST /api/ads/:id/submit` - Submit ad for review
- `POST /api/ads/:id/review` - Review ad (moderator)
- `POST /api/ads/:id/verify-payment` - Verify payment (admin)
- `POST /api/ads/:id/publish` - Publish ad (admin)

## Deployment

- Deploy backend to Vercel or similar
- Deploy frontend to Vercel
- Set up Supabase database

## Project Structure

```
adflow-pro/
├── client/          # React frontend
├── server/          # Node.js backend
├── shared/          # Shared schemas and types
└── README.md
```