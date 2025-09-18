const { ObjectId } = require('mongodb');

class Book {
  constructor(data) {
    this.title = data.title;
    this.author = data.author;
    this.isbn = data.isbn;
    this.publishedDate = data.publishedDate;
    this.genre = data.genre;
    this.pages = data.pages;
    this.publisher = data.publisher;
    this.language = data.language;
    this.description = data.description;
    this.availableCopies = data.availableCopies || 1;
    this.totalCopies = data.totalCopies || 1;
    this.createdAt = data.createdAt || new Date();
    this.updatedAt = data.updatedAt || new Date();
  }

  static validateBook(bookData) {
    const errors = [];

    if (!bookData.title || bookData.title.trim().length === 0) {
      errors.push('Title is required');
    }

    if (!bookData.author || bookData.author.trim().length === 0) {
      errors.push('Author is required');
    }

    if (!bookData.isbn || bookData.isbn.trim().length === 0) {
      errors.push('ISBN is required');
    }

    if (!bookData.publishedDate) {
      errors.push('Published date is required');
    }

    if (!bookData.genre || bookData.genre.trim().length === 0) {
      errors.push('Genre is required');
    }

    if (!bookData.pages || isNaN(bookData.pages) || bookData.pages <= 0) {
      errors.push('Pages must be a positive number');
    }

    if (!bookData.publisher || bookData.publisher.trim().length === 0) {
      errors.push('Publisher is required');
    }

    if (bookData.language && bookData.language.trim().length === 0) {
      errors.push('Language cannot be empty if provided');
    }

    if (bookData.availableCopies !== undefined && (isNaN(bookData.availableCopies) || bookData.availableCopies < 0)) {
      errors.push('Available copies must be a non-negative number');
    }

    if (bookData.totalCopies !== undefined && (isNaN(bookData.totalCopies) || bookData.totalCopies <= 0)) {
      errors.push('Total copies must be a positive number');
    }

    if (bookData.isbn && !Book.isValidISBN(bookData.isbn)) {
      errors.push('Invalid ISBN format');
    }

    if (bookData.publishedDate && isNaN(Date.parse(bookData.publishedDate))) {
      errors.push('Invalid published date format');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  static isValidISBN(isbn) {
    const cleanISBN = isbn.replace(/[-\s]/g, '');
    
    if (!/^(\d{10}|\d{13})$/.test(cleanISBN)) {
      return false;
    }

    return true;
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
    return Book.validateBook(this);
  }

  toDatabase() {
    const bookData = { ...this };
    bookData.updatedAt = new Date();
    return bookData;
  }

  static fromDatabase(data) {
    return new Book(data);
  }
}

module.exports = Book;