const express = require('express');
const passport = require('passport');
const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: The auto-generated id of the user
 *         email:
 *           type: string
 *           format: email
 *           description: The email address of the user
 *         firstName:
 *           type: string
 *           description: The first name of the user
 *         lastName:
 *           type: string
 *           description: The last name of the user
 *         displayName:
 *           type: string
 *           description: The display name of the user
 *         profilePicture:
 *           type: string
 *           format: uri
 *           description: URL to the user's profile picture
 *         provider:
 *           type: string
 *           enum: [google, local]
 *           description: Authentication provider
 *         isActive:
 *           type: boolean
 *           description: Whether the user account is active
 *         lastLogin:
 *           type: string
 *           format: date-time
 *           description: The last login timestamp
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Account creation timestamp
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Last update timestamp
 *   securitySchemes:
 *     sessionAuth:
 *       type: apiKey
 *       in: cookie
 *       name: connect.sid
 *       description: Session-based authentication using Google OAuth
 */

/**
 * @swagger
 * tags:
 *   name: Authentication
 *   description: User authentication and session management
 */

/**
 * @swagger
 * /auth/google:
 *   get:
 *     summary: Initiate Google OAuth authentication
 *     tags: [Authentication]
 *     description: Redirects user to Google OAuth consent screen
 *     responses:
 *       302:
 *         description: Redirect to Google OAuth
 *       500:
 *         description: Server error
 */
router.get('/google', 
  passport.authenticate('google', { 
    scope: ['profile', 'email'] 
  })
);

/**
 * @swagger
 * /auth/google/callback:
 *   get:
 *     summary: Google OAuth callback
 *     tags: [Authentication]
 *     description: Handles the callback from Google OAuth
 *     parameters:
 *       - in: query
 *         name: code
 *         schema:
 *           type: string
 *         description: Authorization code from Google
 *       - in: query
 *         name: state
 *         schema:
 *           type: string
 *         description: State parameter for security
 *     responses:
 *       302:
 *         description: Redirect to dashboard on success or login on failure
 *       400:
 *         description: Authentication failed
 *       500:
 *         description: Server error
 */
router.get('/google/callback',
  passport.authenticate('google', { 
    failureRedirect: '/auth/login/failed' 
  }),
  (req, res) => {
    // Successful authentication
    console.log('🎯 OAuth callback - User authenticated:', req.user ? 'Yes' : 'No');
    console.log('🎯 OAuth callback - Session ID:', req.sessionID);
    console.log('🎯 OAuth callback - Cookies received:', req.headers.cookie);
    
    // Explicitly save the session before redirect
    req.session.save((err) => {
      if (err) {
        console.error('❌ Session save error:', err);
        return res.redirect('/auth/login/failed');
      }
      console.log('✅ Session saved successfully');
      console.log('🍪 Setting cookie for session:', req.sessionID);
      res.redirect('/auth/dashboard');
    });
  }
);

/**
 * @swagger
 * /auth/login/success:
 *   get:
 *     summary: Get current authenticated user
 *     tags: [Authentication]
 *     security:
 *       - sessionAuth: []
 *     description: Returns the current authenticated user's information
 *     responses:
 *       200:
 *         description: User information retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: User authenticated successfully
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *       401:
 *         description: User not authenticated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: User not authenticated
 */
router.get('/login/success', (req, res) => {
  if (req.user) {
    res.status(200).json({
      success: true,
      message: 'User authenticated successfully',
      user: req.user
    });
  } else {
    res.status(401).json({
      success: false,
      message: 'User not authenticated'
    });
  }
});

/**
 * @swagger
 * /auth/login/failed:
 *   get:
 *     summary: Authentication failure endpoint
 *     tags: [Authentication]
 *     description: Returns authentication failure message
 *     responses:
 *       401:
 *         description: Authentication failed
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Authentication failed
 */
router.get('/login/failed', (req, res) => {
  res.status(401).json({
    success: false,
    message: 'Authentication failed'
  });
});

/**
 * @swagger
 * /auth/logout:
 *   post:
 *     summary: Logout user
 *     tags: [Authentication]
 *     security:
 *       - sessionAuth: []
 *     description: Logs out the current user and destroys the session
 *     responses:
 *       200:
 *         description: Logout successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Logout successful
 *       500:
 *         description: Server error during logout
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Error during logout
 */
router.post('/logout', (req, res) => {
  req.logout((err) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: 'Error during logout',
        error: err.message
      });
    }
    
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({
          success: false,
          message: 'Error destroying session',
          error: err.message
        });
      }
      
      res.clearCookie('connect.sid');
      res.status(200).json({
        success: true,
        message: 'Logout successful'
      });
    });
  });
});

/**
 * @swagger
 * /auth/dashboard:
 *   get:
 *     summary: User dashboard (protected route example)
 *     tags: [Authentication]
 *     security:
 *       - sessionAuth: []
 *     description: Example of a protected route that requires authentication
 *     responses:
 *       200:
 *         description: Dashboard data retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Welcome to your dashboard
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *                 stats:
 *                   type: object
 *                   properties:
 *                     totalBooks:
 *                       type: integer
 *                     totalAuthors:
 *                       type: integer
 *       401:
 *         description: Authentication required
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Authentication required
 */
router.get('/dashboard', (req, res) => {
  console.log('🏠 Dashboard accessed');
  console.log('🔐 Is authenticated:', req.isAuthenticated());
  console.log('👤 Session user:', req.user ? 'Present' : 'Not present');
  console.log('📋 Session ID:', req.sessionID);
  console.log('🍪 Cookies received:', req.headers.cookie);
  console.log('🗂️ Session data:', req.session);
  
  if (req.isAuthenticated()) {
    res.status(200).json({
      success: true,
      message: 'Welcome to your dashboard',
      user: req.user,
      stats: {
        message: 'You can now access protected routes to manage books and authors'
      }
    });
  } else {
    res.status(401).json({
      success: false,
      message: 'Authentication required. Please log in with Google.'
    });
  }
});

/**
 * @swagger
 * /auth/status:
 *   get:
 *     summary: Check authentication status
 *     tags: [Authentication]
 *     description: Check if user is currently authenticated
 *     responses:
 *       200:
 *         description: Authentication status
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 authenticated:
 *                   type: boolean
 *                 user:
 *                   $ref: '#/components/schemas/User'
 */
router.get('/status', (req, res) => {
  res.status(200).json({
    authenticated: req.isAuthenticated(),
    user: req.user || null
  });
});

module.exports = router;