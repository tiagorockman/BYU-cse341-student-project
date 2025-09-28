# Library Management API with OAuth Authentication

A comprehensive RESTful API for managing a library system with full CRUD operations for books and authors. Features Google OAuth authentication for secure access to protected endpoints. Built with Node.js, Express.js, MongoDB, and Passport.js.

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
- **Google OAuth Authentication** with session management
- **Protected Routes** - POST, PUT, and DELETE operations require authentication
- **User Account Management** with secure password hashing (bcrypt)
- **RESTful API Design** following best practices
- **MongoDB Integration** with proper error handling
- **Swagger Documentation** for interactive API testing with authentication support
- **Input Validation** and error handling
- **CORS Support** for cross-origin requests with authentication
- **Environment-based Configuration** for development and production
- **Modular Architecture** with separate controllers, models, and routes

## 🛠 Technologies Used

- **Node.js** - JavaScript runtime environment
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database
- **Passport.js** - Authentication middleware
- **Google OAuth 2.0** - Authentication provider
- **Express Session** - Session management
- **bcrypt** - Password hashing
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

# OAuth Configuration
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
SESSION_SECRET=your-session-secret-key
CLIENT_URL=http://localhost:3000

# For production deployment (optional)
# NODE_ENV=production
```

### Required Environment Variables:

- `MONGODB_URI` - MongoDB connection string
- `MONGO_DB` - Database name to use
- `PORT` - Port number for the server (default: 3000)
- `NODE_ENV` - Environment mode (development/production)
- `GOOGLE_CLIENT_ID` - Google OAuth 2.0 Client ID
- `GOOGLE_CLIENT_SECRET` - Google OAuth 2.0 Client Secret
- `SESSION_SECRET` - Secret key for session encryption
- `CLIENT_URL` - Frontend application URL for OAuth redirects

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

### Authentication Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/auth/google` | Initiate Google OAuth login |
| GET | `/auth/google/callback` | Google OAuth callback |
| GET | `/auth/login/success` | Check successful login status |
| GET | `/auth/login/failed` | Check failed login status |
| GET | `/auth/status` | Get current authentication status |
| POST | `/auth/logout` | Logout current user |
| GET | `/auth/dashboard` | Protected dashboard example |

### Books Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/books` | Get all books | No |
| GET | `/api/books/:id` | Get a specific book by ID | No |
| POST | `/api/books` | Create a new book | **Yes** |
| PUT | `/api/books/:id` | Update a book by ID | **Yes** |
| DELETE | `/api/books/:id` | Delete a book by ID | **Yes** |

### Authors Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/authors` | Get all authors | No |
| GET | `/api/authors/:id` | Get a specific author by ID | No |
| POST | `/api/authors` | Create a new author | **Yes** |
| PUT | `/api/authors/:id` | Update an author by ID | **Yes** |
| DELETE | `/api/authors/:id` | Delete an author by ID | **Yes** |

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

## 🔐 Google OAuth Setup

To enable Google OAuth authentication, you need to set up a Google Cloud Project and obtain OAuth credentials:

### 1. Create a Google Cloud Project
1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google+ API for your project

### 2. Configure OAuth Consent Screen
1. Navigate to **APIs & Services** > **OAuth consent screen**
2. Choose **External** user type
3. Fill in the required information:
   - App name: `Library Management API`
   - User support email: Your email
   - Developer contact information: Your email
4. Add scopes: `email`, `profile`, `openid`
5. Add test users (for development)

### 3. Create OAuth Credentials
1. Go to **APIs & Services** > **Credentials**
2. Click **Create Credentials** > **OAuth 2.0 Client IDs**
3. Choose **Web application**
4. Add authorized redirect URIs:
   - `http://localhost:3000/auth/google/callback` (for development)
   - `https://yourdomain.com/auth/google/callback` (for production)
5. Copy the **Client ID** and **Client Secret**

### 4. Update Environment Variables
Add the credentials to your `.env` file:
```env
GOOGLE_CLIENT_ID=your-actual-google-client-id
GOOGLE_CLIENT_SECRET=your-actual-google-client-secret
SESSION_SECRET=a-random-secret-key-for-sessions
```

## 🚀 Deployment

### Local Development
1. Ensure MongoDB is running locally
2. Set up your `.env` file with local MongoDB URI and OAuth credentials
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

**Authentication Tips! 🚀**

Authentication Overview
[Website Authentication: The Complete Guide with FAQs](https://swoopnow.com/website-authentication/)
[RESTful API Authentication Basics](https://blog.restcase.com/restful-api-authentication-basics/)

OAuth Introduction
[What is OAuth? Definition and How it Works](https://www.varonis.com/blog/what-is-oauth)
[What the Heck is OAuth?](https://developer.okta.com/blog/2017/06/21/what-the-heck-is-oauth)

OAuth2 vs OAuth1
[What’s the difference? OAuth 1.0 vs OAuth 2.0](https://www.synopsys.com/blogs/software-security/oauth-2-0-vs-oauth-1-0/)
[Differences Between OAuth 1 and 2](https://www.oauth.com/oauth2-servers/differences-between-oauth-1-2/)
[StackOverflow: OAuth 2.0: Benefits and use cases — why?](https://stackoverflow.com/questions/7561631/oauth-2-0-benefits-and-use-cases-why)

Getting started with OAuth
Google OAuth Docs - Node.js quickstart https://developers.google.com/people/quickstart/nodejs
(OPTIONAL) Youtube: Simplified OAuth 2.0 Tutorial - Example with Node.js https://www.youtube.com/watch?v=PdFdd4N6LtI

Getting started with OAuth
Google OAuth Docs - Node.js quickstart https://www.youtube.com/watch?v=SBvmnHTQIPY
(OPTIONAL) Youtube: Simplified OAuth 2.0 Tutorial - Example with Node.js https://www.youtube.com/watch?v=PdFdd4N6LtI

Node.js API + OAuth + MongoDB
(OPTIONAL) Youtube: Node.js App From Scratch | Express, MongoDB & Google https://www.youtube.com/watch?v=SBvmnHTQIPY
(OPTIONAL) Youtube: OAuth (Passport.js) Tutorial #12 - Saving User to https://www.youtube.com/watch?v=KRCh6mSSsb8

OAuth and Swagger
Swagger docs: OAuth 2.0 https://swagger.io/docs/specification/authentication/oauth2/
Swagger OAuth 2.0 configuration https://swagger.io/docs/open-source-tools/swagger-ui/usage/oauth2/


JSON Web Tokens (JWT)
Introduction to JSON Web Tokens https://jwt.io/introduction
What is JWT and how does it work? https://www.akana.com/blog/what-is-jwt
(OPTIONAL) YouTube: What Is JWT and Why Should You Use JWT https://www.youtube.com/watch?v=7Q17ubqLfaM
JWT meets OAuth
For the sake of authentication purposes, your API does not need to use both OAuth and JWTs. For your project, you will include both just to understand how both work. With that said, there are some use cases for using both in the real world.

OAuth vs JWT (JSON Web Tokens): An In-Depth Comparison https://supertokens.com/blog/oauth-vs-jwt
API Keys vs OAuth Tokens vs JSON Web Tokens https://zapier.com/engineering/apikey-oauth-jwt/
