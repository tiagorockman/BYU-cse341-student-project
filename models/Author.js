const { ObjectId } = require('mongodb');

class Author {
  constructor(data) {
    this.firstName = data.firstName;
    this.lastName = data.lastName;
    this.email = data.email;
    this.birthDate = data.birthDate;
    this.nationality = data.nationality;
    this.biography = data.biography;
    this.website = data.website;
    this.createdAt = data.createdAt || new Date();
    this.updatedAt = data.updatedAt || new Date();
  }

  static validateAuthor(authorData) {
    const errors = [];

    if (!authorData.firstName || authorData.firstName.trim().length === 0) {
      errors.push('First name is required');
    }

    if (!authorData.email || authorData.email.trim().length === 0) {
      errors.push('Email is required');
    }

    if (!authorData.birthDate) {
      errors.push('Birth date is required');
    }

    if (!authorData.nationality || authorData.nationality.trim().length === 0) {
      errors.push('Nationality is required');
    }

    if (authorData.email && !Author.isValidEmail(authorData.email)) {
      errors.push('Invalid email format');
    }

    if (authorData.birthDate && isNaN(Date.parse(authorData.birthDate))) {
      errors.push('Invalid birth date format');
    }

    if (authorData.website && authorData.website.trim().length > 0 && !Author.isValidURL(authorData.website)) {
      errors.push('Invalid website URL format');
    }

    if (authorData.firstName && authorData.firstName.length > 50) {
      errors.push('First name must be less than 50 characters');
    }

    if (authorData.lastName && authorData.lastName.length > 50) {
      errors.push('Last name must be less than 50 characters');
    }

    if (authorData.biography && authorData.biography.length > 1000) {
      errors.push('Biography must be less than 1000 characters');
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

  static isValidURL(url) {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
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

  validate() {
    return Author.validateAuthor(this);
  }

  getFullName() {
    return `${this.firstName} ${this.lastName}`;
  }

  toDatabase() {
    const authorData = { ...this };
    authorData.updatedAt = new Date();
    return authorData;
  }

  static fromDatabase(data) {
    return new Author(data);
  }
}

module.exports = Author;