/**
 * Authentication Middleware
 * Protects routes by ensuring user is authenticated via session
 */

/**
 * Middleware to check if user is authenticated
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
const requireAuth = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  
  return res.status(401).json({
    success: false,
    error: 'Authentication required',
    message: 'You must be logged in to access this resource. Please authenticate with Google OAuth.',
    loginUrl: '/auth/google'
  });
};

/**
 * Middleware to check if user is authenticated (optional)
 * Continues regardless of authentication status but adds user info if available
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
const optionalAuth = (req, res, next) => {
  // User info will be available in req.user if authenticated
  // Route can check req.isAuthenticated() to determine if user is logged in
  next();
};

/**
 * Middleware to check if user is authenticated and active
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
const requireActiveAuth = (req, res, next) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({
      success: false,
      error: 'Authentication required',
      message: 'You must be logged in to access this resource. Please authenticate with Google OAuth.',
      loginUrl: '/auth/google'
    });
  }

  if (!req.user.isActive) {
    return res.status(403).json({
      success: false,
      error: 'Account inactive',
      message: 'Your account has been deactivated. Please contact support.'
    });
  }

  return next();
};

/**
 * Middleware to add authentication info to Swagger responses
 * This is used for documentation purposes
 */
const addAuthToSwagger = (req, res, next) => {
  // Add authentication context for Swagger documentation
  req.authContext = {
    isAuthenticated: req.isAuthenticated(),
    user: req.user || null
  };
  next();
};

/**
 * Middleware to log authentication attempts
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
const logAuthAttempt = (req, res, next) => {
  const timestamp = new Date().toISOString();
  const ip = req.ip || req.connection.remoteAddress;
  const userAgent = req.get('User-Agent');
  
  if (req.isAuthenticated()) {
    console.log(`[${timestamp}] Authenticated request from user ${req.user.email} (${req.user._id}) - IP: ${ip} - ${req.method} ${req.originalUrl}`);
  } else {
    console.log(`[${timestamp}] Unauthenticated request - IP: ${ip} - ${req.method} ${req.originalUrl} - User-Agent: ${userAgent}`);
  }
  
  next();
};

/**
 * Error handler for authentication errors
 * @param {Error} err - Error object
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
const authErrorHandler = (err, req, res, next) => {
  if (err.name === 'AuthenticationError') {
    return res.status(401).json({
      success: false,
      error: 'Authentication failed',
      message: err.message || 'Invalid credentials or session expired',
      loginUrl: '/auth/google'
    });
  }
  
  if (err.name === 'AuthorizationError') {
    return res.status(403).json({
      success: false,
      error: 'Authorization failed',
      message: err.message || 'Insufficient permissions to access this resource'
    });
  }
  
  // Pass other errors to the default error handler
  next(err);
};

module.exports = {
  requireAuth,
  optionalAuth,
  requireActiveAuth,
  addAuthToSwagger,
  logAuthAttempt,
  authErrorHandler
};