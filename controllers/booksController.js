const { getDB } = require('../config/database');
const { ObjectId } = require('mongodb');
const Book = require('../models/Book');

const booksController = {
  getAllBooks: async (req, res) => {
    try {
      const db = getDB();
      const books = await db.collection(process.env.MONGO_COLLECTION_BOOKS).find({}).toArray();
      
      res.status(200).json({
        success: true,
        count: books.length,
        data: books
      });
    } catch (error) {
      console.error('Error fetching books:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch books',
        details: error.message
      });
    }
  },

  getBookById: async (req, res) => {
    try {
      const { id } = req.params;
      
      if (!ObjectId.isValid(id)) {
        return res.status(400).json({
          success: false,
          error: 'Invalid book ID format'
        });
      }

      const db = getDB();
      const book = await db.collection(process.env.MONGO_COLLECTION_BOOKS).findOne({ _id: new ObjectId(id) });
      
      if (!book) {
        return res.status(404).json({
          success: false,
          error: 'Book not found'
        });
      }

      res.status(200).json({
        success: true,
        data: book
      });
    } catch (error) {
      console.error('Error fetching book:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch book',
        details: error.message
      });
    }
  },

  createBook: async (req, res) => {
    try {
      const bookData = req.body;
      
      const book = new Book(bookData);
      const validation = book.validate();
      
      if (!validation.isValid) {
        return res.status(400).json({
          success: false,
          error: 'Validation failed',
          details: validation.errors
        });
      }

      const db = getDB();
      
      const existingBook = await db.collection(process.env.MONGO_COLLECTION_BOOKS).findOne({ isbn: req.body.isbn });
      if (existingBook) {
        return res.status(409).json({
          success: false,
          error: 'Book with this ISBN already exists'
        });
      }

      const result = await db.collection(process.env.MONGO_COLLECTION_BOOKS).insertOne(book.toDatabase());
      
      if (result.insertedId) {
        const createdBook = await db.collection(process.env.MONGO_COLLECTION_BOOKS).findOne({ _id: result.insertedId });
        res.status(201).json({
          success: true,
          message: 'Book created successfully',
          data: createdBook
        });
      } else {
        throw new Error('Failed to create book');
      }
    } catch (error) {
      console.error('Error creating book:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to create book',
        details: error.message
      });
    }
  },

  updateBook: async (req, res) => {
    try {
      const { id } = req.params;
      const updateData = req.body;
      
      if (!ObjectId.isValid(id)) {
        return res.status(400).json({
          success: false,
          error: 'Invalid book ID format'
        });
      }

      const book = new Book(updateData);
      const validation = book.validate();
      
      if (!validation.isValid) {
        return res.status(400).json({
          success: false,
          error: 'Validation failed',
          details: validation.errors
        });
      }

      const db = getDB();
      
      const existingBook = await db.collection(process.env.MONGO_COLLECTION_BOOKS).findOne({ _id: new ObjectId(id) });
      if (!existingBook) {
        return res.status(404).json({
          success: false,
          error: 'Book not found'
        });
      }

      const isbnConflict = await db.collection(process.env.MONGO_COLLECTION_BOOKS).findOne({
        isbn: updateData.isbn,
        _id: { $ne: new ObjectId(id) }
      });
      
      if (isbnConflict) {
        return res.status(409).json({
          success: false,
          error: 'ISBN already exists for another book'
        });
      }

      const result = await db.collection(process.env.MONGO_COLLECTION_BOOKS).updateOne(
        { _id: new ObjectId(id) },
        { 
          $set: {
            ...book.toDatabase(),
            updatedAt: new Date()
          }
        }
      );

      if (result.modifiedCount === 1) {
        const updatedBook = await db.collection(process.env.MONGO_COLLECTION_BOOKS).findOne({ _id: new ObjectId(id) });
        res.status(200).json({
          success: true,
          message: 'Book updated successfully',
          data: updatedBook
        });
      } else {
        res.status(400).json({
          success: false,
          error: 'No changes were made to the book'
        });
      }
    } catch (error) {
      console.error('Error updating book:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to update book',
        details: error.message
      });
    }
  },

  deleteBook: async (req, res) => {
    try {
      const { id } = req.params;
      
      if (!ObjectId.isValid(id)) {
        return res.status(400).json({
          success: false,
          error: 'Invalid book ID format'
        });
      }

      const db = getDB();
      
      const existingBook = await db.collection(process.env.MONGO_COLLECTION_BOOKS).findOne({ _id: new ObjectId(id) });
      if (!existingBook) {
        return res.status(404).json({
          success: false,
          error: 'Book not found'
        });
      }

      const result = await db.collection(process.env.MONGO_COLLECTION_BOOKS).deleteOne({ _id: new ObjectId(id) });
      
      if (result.deletedCount === 1) {
        res.status(200).json({
          success: true,
          message: 'Book deleted successfully',
          data: existingBook
        });
      } else {
        throw new Error('Failed to delete book');
      }
    } catch (error) {
      console.error('Error deleting book:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to delete book',
        details: error.message
      });
    }
  }
};

module.exports = booksController;