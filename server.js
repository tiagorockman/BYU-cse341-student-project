// Load environment variables first
const dotenv = require('dotenv');
dotenv.config();

const express = require('express');
const cors = require('cors');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');
const { connectDB } = require('./config/database');
const passport = require('./config/passport');
const { authErrorHandler } = require('./middleware/auth');

const app = express();
const PORT = process.env.PORT || 3000;
const host = process.env.SERVER || ''

// CORS configuration for authentication
const corsOptions = {
  origin: process.env.NODE_ENV === 'production' 
    ? [host, process.env.CLIENT_URL] 
    : ['http://localhost:3000', 'http://localhost:3001', 'http://localhost:5173'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session configuration
app.use(session({
  secret: process.env.SESSION_SECRET || 'your-secret-key-change-in-production',
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: process.env.MONGODB_URI,
    dbName: process.env.MONGO_DB,
    collectionName: 'sessions',
    ttl: 24 * 60 * 60 // 24 hours
  }),
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Swagger configuration
// if Production uses render link
// else use localhost
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Library Management API with OAuth Authentication',
      version: '2.0.0',
      description: 'A comprehensive Library Management API with CRUD operations for books and authors, featuring Google OAuth authentication. POST, PUT, and DELETE operations require authentication.',
    },
    servers: [
      {
        url: process.env.NODE_ENV === 'production' 
          ? host
          : `http://localhost:${PORT}`,
        description: process.env.NODE_ENV === 'production' ? 'Production server' : 'Development server',
      },
    ],
    components: {
      securitySchemes: {
        sessionAuth: {
          type: 'apiKey',
          in: 'cookie',
          name: 'connect.sid',
          description: 'Session-based authentication using Google OAuth. Login at /auth/google to authenticate.'
        }
      }
    },
    security: [
      {
        sessionAuth: []
      }
    ]
  },
  apis: ['./routes/*.js'],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

// Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Authentication routes
app.use('/auth', require('./routes/auth'));

// API routes
app.use('/api/books', require('./routes/books'));
app.use('/api/authors', require('./routes/authors'));

app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to Library Management API with OAuth Authentication',
    documentation: '/api-docs',
    authentication: {
      login: '/auth/google',
      logout: '/auth/logout',
      status: '/auth/status',
      dashboard: '/auth/dashboard'
    },
    endpoints: {
      books: '/api/books',
      authors: '/api/authors'
    },
    note: 'POST, PUT, and DELETE operations require authentication'
  });
});

// Authentication error handler
app.use(authErrorHandler);

// General error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: 'Something went wrong!',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
});

// 404 handler - must be last
app.use((req, res) => {
  res.status(404).json({
    error: 'Route not found',
    message: `The route ${req.originalUrl} does not exist`
  });
});

// Start server
const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
      console.log(`API Documentation available at http://localhost:${PORT}/api-docs`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();