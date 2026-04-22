import './env';
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth';
import publicRoutes from './routes/public';
import { authMiddleware } from './middlewares/auth';
import { errorHandler, notFoundHandler } from './middlewares/validation';
import { connectDB } from './db/mongodb';

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
    credentials: true,
  })
);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'Server is running' });
});

// Public routes
app.use('/api', publicRoutes);

// Auth routes
app.use('/api/auth', authRoutes);

import clientRoutes from './routes/client';
import moderatorRoutes from './routes/moderator';
import adminRoutes from './routes/admin';

// Protected routes
app.use('/api/client', authMiddleware, clientRoutes);
app.use('/api/moderator', authMiddleware, moderatorRoutes);
app.use('/api/admin', authMiddleware, adminRoutes);

// 404 handler
app.use(notFoundHandler);

// Error handler
app.use(errorHandler);

// Start server
app.listen(PORT, async () => {
  await connectDB();
  console.log(`🚀 AdFlow Server running on http://localhost:${PORT}`);
  console.log(`📚 Environment: ${process.env.NODE_ENV || 'development'}`);
});
