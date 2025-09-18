const express = require('express');
const router = express.Router();
const booksController = require('../controllers/booksController');

/**
 * @swagger
 * components:
 *   schemas:
 *     Book:
 *       type: object
 *       required:
 *         - title
 *         - authorId
 *         - isbn
 *         - publishedDate
 *         - genre
 *         - publisher
 *       properties:
 *         _id:
 *           type: string
 *           description: The auto-generated id of the book
 *         title:
 *           type: string
 *           description: The title of the book
 *         authorId:
 *           type: string
 *           description: The MongoDB ObjectId of the author
 *         isbn:
 *           type: string
 *           description: The ISBN number of the book
 *         publishedDate:
 *           type: string
 *           format: date
 *           description: The publication date of the book
 *         genre:
 *           type: string
 *           description: The genre of the book
 *         publisher:
 *           type: string
 *           description: The publisher of the book
 *         description:
 *           type: string
 *           description: A brief description of the book
 *         pages:
 *           type: integer
 *           minimum: 1
 *           description: The number of pages in the book
 *         language:
 *           type: string
 *           description: The language the book is written in
 *         price:
 *           type: number
 *           minimum: 0
 *           description: The price of the book
 *         availability:
 *           type: boolean
 *           description: Whether the book is available for checkout
 *         tags:
 *           type: array
 *           items:
 *             type: string
 *           description: Tags associated with the book
 *         rating:
 *           type: number
 *           minimum: 0
 *           maximum: 5
 *           description: Average rating of the book (0-5)
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: The date the book was added to the system
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: The date the book was last updated
 *       example:
 *         title: "The Great Adventure"
 *         authorId: "507f1f77bcf86cd799439011"
 *         isbn: "978-3-16-148410-0"
 *         publishedDate: "2023-01-15"
 *         genre: "Fiction"
 *         publisher: "Adventure Books Publishing"
 *         description: "An exciting tale of adventure and discovery in uncharted territories."
 *         pages: 320
 *         language: "English"
 *         price: 19.99
 *         availability: true
 *         tags: ["adventure", "fiction", "bestseller"]
 *         rating: 4.5
 *     BookInput:
 *       type: object
 *       required:
 *         - title
 *         - authorId
 *         - isbn
 *         - publishedDate
 *         - genre
 *         - publisher
 *       properties:
 *         title:
 *           type: string
 *           description: The title of the book
 *         authorId:
 *           type: string
 *           description: The MongoDB ObjectId of the author
 *         isbn:
 *           type: string
 *           description: The ISBN number of the book
 *         publishedDate:
 *           type: string
 *           format: date
 *           description: The publication date of the book
 *         genre:
 *           type: string
 *           description: The genre of the book
 *         publisher:
 *           type: string
 *           description: The publisher of the book
 *         description:
 *           type: string
 *           description: A brief description of the book
 *         pages:
 *           type: integer
 *           minimum: 1
 *           description: The number of pages in the book
 *         language:
 *           type: string
 *           description: The language the book is written in
 *         price:
 *           type: number
 *           minimum: 0
 *           description: The price of the book
 *         availability:
 *           type: boolean
 *           description: Whether the book is available for checkout
 *         tags:
 *           type: array
 *           items:
 *             type: string
 *           description: Tags associated with the book
 *         rating:
 *           type: number
 *           minimum: 0
 *           maximum: 5
 *           description: Average rating of the book (0-5)
 *     Error:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: false
 *         error:
 *           type: string
 *           description: Error message
 *         details:
 *           type: string
 *           description: Detailed error information
 */

/**
 * @swagger
 * tags:
 *   name: Books
 *   description: The books managing API
 */

/**
 * @swagger
 * /api/books:
 *   get:
 *     summary: Returns the list of all books
 *     tags: [Books]
 *     responses:
 *       200:
 *         description: The list of books
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 count:
 *                   type: integer
 *                   description: Number of books returned
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Book'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/', booksController.getAllBooks);

/**
 * @swagger
 * /api/books/{id}:
 *   get:
 *     summary: Get a book by id
 *     tags: [Books]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The book id (MongoDB ObjectId)
 *     responses:
 *       200:
 *         description: The book description by id
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Book'
 *       400:
 *         description: Invalid book ID format
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: The book was not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/:id', booksController.getBookById);

/**
 * @swagger
 * /api/books:
 *   post:
 *     summary: Create a new book
 *     tags: [Books]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/BookInput'
 *     responses:
 *       201:
 *         description: The book was created successfully
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
 *                   example: "Book created successfully"
 *                 data:
 *                   $ref: '#/components/schemas/Book'
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: string
 *                   example: "Validation failed"
 *                 details:
 *                   type: array
 *                   items:
 *                     type: string
 *                   example: ["Title is required", "ISBN must be valid", "Author ID is required"]
 *       404:
 *         description: Author not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       409:
 *         description: Book with this ISBN already exists
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post('/', booksController.createBook);

/**
 * @swagger
 * /api/books/{id}:
 *   put:
 *     summary: Update a book by id
 *     tags: [Books]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The book id (MongoDB ObjectId)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/BookInput'
 *     responses:
 *       200:
 *         description: The book was updated successfully
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
 *                   example: "Book updated successfully"
 *                 data:
 *                   $ref: '#/components/schemas/Book'
 *       400:
 *         description: Invalid book ID format or validation error or no changes made
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: The book or author was not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       409:
 *         description: ISBN conflict with another book
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.put('/:id', booksController.updateBook);

/**
 * @swagger
 * /api/books/{id}:
 *   delete:
 *     summary: Delete a book by id
 *     tags: [Books]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The book id (MongoDB ObjectId)
 *     responses:
 *       200:
 *         description: The book was deleted successfully
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
 *                   example: "Book deleted successfully"
 *                 data:
 *                   $ref: '#/components/schemas/Book'
 *       400:
 *         description: Invalid book ID format
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: The book was not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.delete('/:id', booksController.deleteBook);

module.exports = router;