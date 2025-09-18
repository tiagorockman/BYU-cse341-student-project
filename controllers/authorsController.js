const { getDB } = require('../config/database');
const { ObjectId } = require('mongodb');
const Author = require('../models/Author');

const authorsController = {
  getAllAuthors: async (req, res) => {
    try {
      const db = getDB();
      const authors = await db.collection(process.env.MONGO_COLLECTION_AUTHORS).find({}).toArray();
      
      res.status(200).json({
        success: true,
        count: authors.length,
        data: authors
      });
    } catch (error) {
      console.error('Error fetching authors:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch authors',
        details: error.message
      });
    }
  },

  getAuthorById: async (req, res) => {
    try {
      const { id } = req.params;
      
      if (!ObjectId.isValid(id)) {
        return res.status(400).json({
          success: false,
          error: 'Invalid author ID format'
        });
      }

      const db = getDB();
      const author = await db.collection(process.env.MONGO_COLLECTION_AUTHORS).findOne({ _id: new ObjectId(id) });
      
      if (!author) {
        return res.status(404).json({
          success: false,
          error: 'Author not found'
        });
      }

      res.status(200).json({
        success: true,
        data: author
      });
    } catch (error) {
      console.error('Error fetching author:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch author',
        details: error.message
      });
    }
  },

  createAuthor: async (req, res) => {
    try {
      const authorData = req.body;
      
      const author = new Author(authorData);
      const validation = author.validate();
      
      if (!validation.isValid) {
        return res.status(400).json({
          success: false,
          error: 'Validation failed',
          details: validation.errors
        });
      }

      const db = getDB();
      
      const existingAuthor = await db.collection(process.env.MONGO_COLLECTION_AUTHORS).findOne({ email: req.body.email });
      if (existingAuthor) {
        return res.status(409).json({
          success: false,
          error: 'Author with this email already exists'
        });
      }

      const result = await db.collection(process.env.MONGO_COLLECTION_AUTHORS).insertOne(author.toDatabase());
      
      if (result.insertedId) {
        const createdAuthor = await db.collection(process.env.MONGO_COLLECTION_AUTHORS).findOne({ _id: result.insertedId });
        res.status(201).json({
          success: true,
          message: 'Author created successfully',
          data: createdAuthor
        });
      } else {
        throw new Error('Failed to create author');
      }
    } catch (error) {
      console.error('Error creating author:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to create author',
        details: error.message
      });
    }
  },

  updateAuthor: async (req, res) => {
    try {
      const { id } = req.params;
      const updateData = req.body;
      
      if (!ObjectId.isValid(id)) {
        return res.status(400).json({
          success: false,
          error: 'Invalid author ID format'
        });
      }

      const author = new Author(updateData);
      const validation = author.validate();
      
      if (!validation.isValid) {
        return res.status(400).json({
          success: false,
          error: 'Validation failed',
          details: validation.errors
        });
      }

      const db = getDB();
      
      const existingAuthor = await db.collection(process.env.MONGO_COLLECTION_AUTHORS).findOne({ _id: new ObjectId(id) });
      if (!existingAuthor) {
        return res.status(404).json({
          success: false,
          error: 'Author not found'
        });
      }

      const emailConflict = await db.collection(process.env.MONGO_COLLECTION_AUTHORS).findOne({
        email: updateData.email,
        _id: { $ne: new ObjectId(id) }
      });
      
      if (emailConflict) {
        return res.status(409).json({
          success: false,
          error: 'Email already exists for another author'
        });
      }

      const result = await db.collection(process.env.MONGO_COLLECTION_AUTHORS).updateOne(
        { _id: new ObjectId(id) },
        { 
          $set: {
            ...author.toDatabase(),
            updatedAt: new Date()
          }
        }
      );

      if (result.modifiedCount === 1) {
        const updatedAuthor = await db.collection(process.env.MONGO_COLLECTION_AUTHORS).findOne({ _id: new ObjectId(id) });
        res.status(200).json({
          success: true,
          message: 'Author updated successfully',
          data: updatedAuthor
        });
      } else {
        res.status(400).json({
          success: false,
          error: 'No changes were made to the author'
        });
      }
    } catch (error) {
      console.error('Error updating author:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to update author',
        details: error.message
      });
    }
  },

  deleteAuthor: async (req, res) => {
    try {
      const { id } = req.params;
      
      if (!ObjectId.isValid(id)) {
        return res.status(400).json({
          success: false,
          error: 'Invalid author ID format'
        });
      }

      const db = getDB();
      
      const existingAuthor = await db.collection(process.env.MONGO_COLLECTION_AUTHORS).findOne({ _id: new ObjectId(id) });
      if (!existingAuthor) {
        return res.status(404).json({
          success: false,
          error: 'Author not found'
        });
      }

      const authorBooks = await db.collection(process.env.MONGO_COLLECTION_BOOKS).findOne({
        $or: [
          { author: existingAuthor.firstName + ' ' + existingAuthor.lastName },
          { author: existingAuthor.email }
        ]
      });

      if (authorBooks) {
        return res.status(409).json({
          success: false,
          error: 'Cannot delete author. Author has associated books.'
        });
      }

      const result = await db.collection(process.env.MONGO_COLLECTION_AUTHORS).deleteOne({ _id: new ObjectId(id) });
      
      if (result.deletedCount === 1) {
        res.status(200).json({
          success: true,
          message: 'Author deleted successfully',
          data: existingAuthor
        });
      } else {
        throw new Error('Failed to delete author');
      }
    } catch (error) {
      console.error('Error deleting author:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to delete author',
        details: error.message
      });
    }
  }
};

module.exports = authorsController;