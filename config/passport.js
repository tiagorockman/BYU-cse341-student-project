const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const { getDB } = require('./database');
const User = require('../models/User');
const { ObjectId } = require('mongodb');

// Serialize user for session
passport.serializeUser((user, done) => {
  console.log('Serializing user:', user);
  if (!user || !user._id) {
    return done(new Error('User object missing _id property'), null);
  }
  // Convert ObjectId to string for session storage
  const userId = user._id.toString();
  console.log('✅ Serializing user ID:', userId);
  done(null, userId);
});

// Deserialize user from session
passport.deserializeUser(async (id, done) => {
  try {
    console.log('🔍 Deserializing user with ID:', id);
    const db = getDB();
    const user = await db.collection('users').findOne({ _id: new ObjectId(id) });
    console.log('📄 User found in database:', user ? 'Yes' : 'No');
    if (user) {
      const userObj = User.fromDatabase(user);
      console.log('✅ User deserialized successfully:', userObj.email);
      done(null, userObj.toSafeObject());
    } else {
      console.log('❌ User not found in database');
      done(null, false);
    }
  } catch (error) {
    console.log('💥 Error deserializing user:', error.message);
    done(error, null);
  }
});

// Google OAuth Strategy
passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: process.env.GOOGLE_CALLBACK_URL || '/auth/google/callback'
}, async (accessToken, refreshToken, profile, done) => {
  try {
    const db = getDB();
    
    // Check if user already exists
    let existingUser = await db.collection('users').findOne({ 
      $or: [
        { googleId: profile.id },
        { email: profile.emails[0].value }
      ]
    });

    if (existingUser) {
      // Update existing user with Google info if needed
      const updateData = {
        googleId: profile.id,
        firstName: profile.name.givenName,
        lastName: profile.name.familyName,
        displayName: profile.displayName,
        profilePicture: profile.photos[0]?.value,
        provider: 'google',
        lastLogin: new Date(),
        updatedAt: new Date()
      };

      await db.collection('users').updateOne(
        { _id: existingUser._id },
        { $set: updateData }
      );

      const updatedUser = await db.collection('users').findOne({ _id: existingUser._id });
      const userObj = User.fromDatabase(updatedUser);
      return done(null, userObj.toSafeObject());
    }

    // Create new user
    const newUserData = {
      googleId: profile.id,
      email: profile.emails[0].value,
      firstName: profile.name.givenName,
      lastName: profile.name.familyName,
      displayName: profile.displayName,
      profilePicture: profile.photos[0]?.value,
      provider: 'google',
      isActive: true,
      lastLogin: new Date(),
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const newUser = new User(newUserData);
    const validation = newUser.validate();

    if (!validation.isValid) {
      return done(new Error('User validation failed: ' + validation.errors.join(', ')), null);
    }

    const userToSave = await newUser.toDatabase();
    const result = await db.collection('users').insertOne(userToSave);

    if (result.insertedId) {
      const createdUser = await db.collection('users').findOne({ _id: result.insertedId });
      const userObj = User.fromDatabase(createdUser);
      return done(null, userObj.toSafeObject());
    } else {
      return done(new Error('Failed to create user'), null);
    }

  } catch (error) {
    console.error('Error in Google OAuth strategy:', error);
    return done(error, null);
  }
}));

module.exports = passport;