const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
require('express-async-errors');
require('dotenv').config();

const logger = require('./config/logger');
const { errorHandler, notFound } = require('./middleware/errorMiddleware');

// Route imports
const authRoutes = require('./routes/authRoutes');
const attendanceRoutes = require('./routes/attendanceRoutes');
const overtimeRoutes = require('./routes/overtimeRoutes');
const userRoutes = require('./routes/userRoutes');
const reportRoutes = require('./routes/reportRoutes');

const app = express();

// Security middleware
app.use(helmet());

// CORS configuration
app.use(
  cors({
    origin: [
      process.env.FRONTEND_URL || 'http://localhost:5173',
      'http://localhost:3000',
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// Body parsers
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// HTTP request logging with Morgan
app.use(
  morgan('combined', {
    stream: {
      write: (message) => logger.http(message.trim()),
    },
  })
);

// Ignore favicon requests
app.get('/favicon.ico', (req, res) => res.status(204).end());

// Health check route
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Attendance Management System API is running',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
  });
});

app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'API is healthy',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/overtime', overtimeRoutes);
app.use('/api/users', userRoutes);
app.use('/api/reports', reportRoutes);

// 404 handler
app.use(notFound);

// Global error handler
app.use(errorHandler);

module.exports = app;