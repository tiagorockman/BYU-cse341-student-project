# Library Management API

A comprehensive RESTful API for managing a library system with full CRUD operations for books and authors. Built with Node.js, Express.js, and MongoDB.

## 📋 Table of Contents

- [Features](#features)
- [Technologies Used](#technologies-used)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Running the Application](#running-the-application)
- [API Documentation](#api-documentation)
- [API Endpoints](#api-endpoints)
- [Data Models](#data-models)
- [Project Structure](#project-structure)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)

## ✨ Features

- **Complete CRUD Operations** for Books and Authors
- **RESTful API Design** following best practices
- **MongoDB Integration** with proper error handling
- **Swagger Documentation** for interactive API testing
- **Input Validation** and error handling
- **CORS Support** for cross-origin requests
- **Environment-based Configuration** for development and production
- **Modular Architecture** with separate controllers, models, and routes

## 🛠 Technologies Used

- **Node.js** - JavaScript runtime environment
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database
- **Swagger** - API documentation and testing
- **CORS** - Cross-Origin Resource Sharing
- **dotenv** - Environment variable management
- **Nodemon** - Development server with auto-restart

## 📋 Prerequisites

Before running this application, make sure you have the following installed:

- [Node.js](https://nodejs.org/) (v14 or higher)
- [npm](https://www.npmjs.com/) (comes with Node.js)
- [MongoDB](https://www.mongodb.com/) database (local or cloud instance)

## 🚀 Installation

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd BYU-cse341-student-project
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables** (see [Environment Variables](#environment-variables) section)

4. **Start the application:**
   ```bash
   # Development mode with auto-restart
   npm run dev
   
   # Production mode
   npm start
   ```

## 🔧 Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/my-database-name
# Or for MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database-name

MONGO_DB=library_management

# Server Configuration
PORT=3000
NODE_ENV=development

# For production deployment (optional)
# NODE_ENV=production
```

### Required Environment Variables:

- `MONGODB_URI` - My MongoDB connection string
- `MONGO_DB` - Database name to use
- `PORT` - Port number for the server (default: 3000)
- `NODE_ENV` - Environment mode (development/production)

## 🏃‍♂️ Running the Application

### Development Mode
```bash
npm run dev
```
This starts the server with nodemon for automatic restarts on file changes.

### Production Mode
```bash
npm start
```

### Accessing the Application
- **API Base URL:** `http://localhost:3000`
- **API Documentation:** `http://localhost:3000/api-docs`
- **Health Check:** `http://localhost:3000/`

## 📚 API Documentation

The API includes interactive Swagger documentation available at `/api-docs` when the server is running.

**Local Documentation:** [http://localhost:3000/api-docs](http://localhost:3000/api-docs)

## 🔗 API Endpoints

### Books Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/books` | Get all books |
| GET | `/api/books/:id` | Get a specific book by ID |
| POST | `/api/books` | Create a new book |
| PUT | `/api/books/:id` | Update a book by ID |
| DELETE | `/api/books/:id` | Delete a book by ID |

### Authors Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/authors` | Get all authors |
| GET | `/api/authors/:id` | Get a specific author by ID |
| POST | `/api/authors` | Create a new author |
| PUT | `/api/authors/:id` | Update an author by ID |
| DELETE | `/api/authors/:id` | Delete an author by ID |

### Example API Calls

#### Get All Books
```bash
curl -X GET http://localhost:3000/api/books
```

#### Create a New Book
```bash
curl -X POST http://localhost:3000/api/books \
  -H "Content-Type: application/json" \
  -d '{
    "title": "The Great Gatsby",
    "authorId": "60d5ecb74b24c72d88e4e123",
    "isbn": "978-0-7432-7356-5",
    "publishedDate": "1925-04-10",
    "genre": "Fiction",
    "publisher": "Charles Scribner'\''s Sons",
    "description": "A classic American novel",
    "pages": 180,
    "language": "English"
  }'
```

#### Create a New Author
```bash
curl -X POST http://localhost:3000/api/authors \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "F. Scott",
    "lastName": "Fitzgerald",
    "email": "fscott@example.com",
    "birthDate": "1896-09-24",
    "nationality": "American",
    "biography": "American novelist and short story writer",
    "website": "https://example.com"
  }'
```

## 📊 Data Models

### Book Model
```javascript
{
  "_id": "ObjectId",
  "title": "String (required)",
  "authorId": "String (required) - MongoDB ObjectId",
  "isbn": "String (required)",
  "publishedDate": "Date (required)",
  "genre": "String (required)",
  "publisher": "String (required)",
  "description": "String (optional)",
  "pages": "Number (optional)",
  "language": "String (optional)",
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

### Author Model
```javascript
{
  "_id": "ObjectId",
  "firstName": "String (required)",
  "lastName": "String (required)",
  "email": "String (required, unique)",
  "birthDate": "Date (required)",
  "nationality": "String (required)",
  "biography": "String (optional)",
  "website": "String (optional)",
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

## 📁 Project Structure

```
BYU-cse341-student-project/
├── config/
│   └── database.js          # MongoDB connection configuration
├── controllers/
│   ├── authorsController.js # Author-related business logic
│   └── booksController.js   # Book-related business logic
├── data/
│   ├── authors.json         # Sample author data
│   └── books.json          # Sample book data
├── models/
│   ├── Author.js           # Author data model
│   └── Book.js             # Book data model
├── routes/
│   ├── authors.js          # Author API routes with Swagger docs
│   └── books.js            # Book API routes with Swagger docs
├── .env                    # Environment variables (create this)
├── .gitignore             # Git ignore rules
├── package.json           # Project dependencies and scripts
├── server.js              # Main application entry point
└── README.md              # Project documentation
```

## 🚀 Deployment

### Local Development
1. Ensure MongoDB is running locally
2. Set up my `.env` file with local MongoDB URI
3. Run `npm run dev`

### Production Deployment (Render/Heroku)
1. Set up environment variables in my hosting platform
2. Update the Swagger server URL in `server.js` for production
3. Ensure `NODE_ENV=production` is set
4. Deploy using my platform's deployment process

### Environment-Specific Configuration
The application automatically adjusts based on the `NODE_ENV` variable:
- **Development:** Uses localhost URLs and detailed error messages
- **Production:** Uses production server URLs and generic error messages

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit my changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the ISC License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**CSE 341 Student** - BYU-Idaho Web Services Course Project

## 📞 Support

If you have any questions or issues, please:
1. Check the [API Documentation](http://localhost:3000/api-docs)
2. Review the error messages in the console
3. Ensure all environment variables are properly set
4. Verify MongoDB connection is working

---

**Happy Coding! 🚀**