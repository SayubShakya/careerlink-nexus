const express = require('express');
const cors = require('cors');
const path = require('path');
const session = require('express-session');
const healthRoutes = require('./routes/healthRoutes');
const roleRoutes = require('./routes/roleRoutes');
const authRoutes = require('./routes/authRoutes');
const errorHandler = require('./middleware/errorHandler');
const AppError = require('./utils/AppError');
const swaggerUi = require('swagger-ui-express');
const swaggerSpecs = require('./config/swagger');

const app = express();
const jobSeekerRoutes = require('./routes/jobSeekerRoutes');
const employerRoutes = require('./routes/employerRoutes');
const jobRoutes = require('./routes/jobRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const adminRoutes = require('./routes/adminRoutes');
const profileRoutes = require('./routes/profileRoutes');
const resumeRoutes = require('./routes/resumeRoutes');
const cvRoutes = require('./routes/cvRoutes');

// Global Middleware
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
}));

app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

app.use(session({
    secret: process.env.SESSION_SECRET || 'careerlink-secret-key',
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 1 * 60 * 60 * 1000 // 1 hour
    }
}));

// Swagger Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpecs));

// Routes
app.use('/api/health', healthRoutes);
app.use('/api/roles', roleRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/cvs', cvRoutes);
app.use('/api/job-seekers', jobSeekerRoutes);
app.use('/api/employers', employerRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/resumes', resumeRoutes);

// Handle Undefined Routes
app.all(/(.*)/, (req, res, next) => {
    console.log(`[404] Method: ${req.method}, URL: ${req.originalUrl}`);
    next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// Global Error Handler
app.use(errorHandler);

module.exports = app;
