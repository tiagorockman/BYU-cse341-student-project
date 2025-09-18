const { MongoClient } = require('mongodb');

let db;

const connectDB = async () => {
  try {
    const uri = process.env.MONGODB_URI;
    const dbName = process.env.MONGO_DB;
    
    if (!uri) {
      throw new Error('MONGODB_URI environment variable is not defined');
    }
    
    if (!dbName) {
      throw new Error('MONGO_DB environment variable is not defined');
    }

    const client = new MongoClient(uri);
    await client.connect();
    
    db = client.db(dbName);
    
    console.log('Connected to MongoDB successfully');
    console.log('Database:', db.databaseName);
    
    return db;
  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw error;
  }
};

const getDB = () => {
  if (!db) {
    throw new Error('Database not initialized. Call connectDB first.');
  }
  return db;
};

module.exports = {
  connectDB,
  getDB
};