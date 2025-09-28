const { ObjectId } = require('mongodb');
const bcrypt = require('bcrypt');

class User {
  constructor(data) {
    // Store _id if it exists (from database)
    if (data._id) {
      this._id = data._id;
    }
    this.googleId = data.googleId;
    this.email = data.email;
    this.firstName = data.firstName;
    this.lastName = data.lastName;
    this.displayName = data.displayName;
    this.profilePicture = data.profilePicture;
    // Only store hashed password (from database), never plain text
    if (data.password && data.fromDatabase) {
      this.password = data.password; // This is already hashed from database
    }
    this.provider = data.provider || 'google'; // 'google' or 'local'
    this.isActive = data.isActive !== undefined ? data.isActive : true;
    this.lastLogin = data.lastLogin;
    this.createdAt = data.createdAt || new Date();
    this.updatedAt = data.updatedAt || new Date();
  }

  static validateUser(userData) {
    const errors = [];

    // Email validation
    if (!userData.email || userData.email.trim().length === 0) {
      errors.push('Email is required');
    } else if (!User.isValidEmail(userData.email)) {
      errors.push('Invalid email format');
    }

    // Name validation
    if (!userData.firstName || userData.firstName.trim().length === 0) {
      errors.push('First name is required');
    }

    if (!userData.lastName || userData.lastName.trim().length === 0) {
      errors.push('Last name is required');
    }

    // Provider-specific validation
    if (userData.provider === 'local') {
      if (!userData.password || userData.password.length < 6) {
        errors.push('Password must be at least 6 characters long');
      }
    } else if (userData.provider === 'google') {
      if (!userData.googleId) {
        errors.push('Google ID is required for Google authentication');
      }
    }

    // Length validations
    if (userData.firstName && userData.firstName.length > 50) {
      errors.push('First name must be less than 50 characters');
    }

    if (userData.lastName && userData.lastName.length > 50) {
      errors.push('Last name must be less than 50 characters');
    }

    if (userData.displayName && userData.displayName.length > 100) {
      errors.push('Display name must be less than 100 characters');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  static isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  static validateObjectId(id) {
    if (!id) {
      return { isValid: false, error: 'ID is required' };
    }

    if (!ObjectId.isValid(id)) {
      return { isValid: false, error: 'Invalid ID format' };
    }

    return { isValid: true };
  }

  // Hash password before saving (for local authentication)
  static async hashPassword(password) {
    try {
      const saltRounds = 12;
      return await bcrypt.hash(password, saltRounds);
    } catch (error) {
      throw new Error('Error hashing password: ' + error.message);
    }
  }

  // Compare password for login (for local authentication)
  static async comparePassword(plainPassword, hashedPassword) {
    try {
      return await bcrypt.compare(plainPassword, hashedPassword);
    } catch (error) {
      throw new Error('Error comparing password: ' + error.message);
    }
  }

  validate() {
    return User.validateUser(this);
  }

  getFullName() {
    return `${this.firstName} ${this.lastName}`.trim();
  }

  // Prepare user data for database storage
  async toDatabase(plainTextPassword = null) {
    const userData = { ...this };
    
    // Hash password if it's a local user and plain text password is provided
    if (this.provider === 'local' && plainTextPassword) {
      userData.password = await User.hashPassword(plainTextPassword);
    }

    // Remove password field for Google users or if no password provided
    if (this.provider === 'google' || !userData.password) {
      delete userData.password;
    }

    return userData;
  }

  // Create user object from database data
  static fromDatabase(data) {
    return new User({ ...data, fromDatabase: true });
  }

  // Get safe user data (without sensitive information)
  toSafeObject() {
    return {
      _id: this._id,
      email: this.email,
      firstName: this.firstName,
      lastName: this.lastName,
      displayName: this.displayName,
      profilePicture: this.profilePicture,
      provider: this.provider,
      isActive: this.isActive,
      lastLogin: this.lastLogin,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }

  // Update last login timestamp
  updateLastLogin() {
    this.lastLogin = new Date();
    this.updatedAt = new Date();
  }
}

module.exports = User;