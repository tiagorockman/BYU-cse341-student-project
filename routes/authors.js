const express = require('express');
const router = express.Router();
const authorsController = require('../controllers/authorsController');
const { requireAuth } = require('../middleware/auth');

/**
 * @swagger
 * components:
 *   schemas:
 *     Author:
 *       type: object
 *       required:
 *         - firstName
 *         - lastName
 *         - email
 *         - birthDate
 *         - nationality
 *       properties:
 *         _id:
 *           type: string
 *           description: The auto-generated id of the author
 *         firstName:
 *           type: string
 *           description: The first name of the author
 *         lastName:
 *           type: string
 *           description: The last name of the author
 *         email:
 *           type: string
 *           format: email
 *           description: The email address of the author
 *         birthDate:
 *           type: string
 *           format: date
 *           description: The birth date of the author
 *         nationality:
 *           type: string
 *           description: The nationality of the author
 *         biography:
 *           type: string
 *           description: A brief biography of the author
 *         website:
 *           type: string
 *           format: uri
 *           description: The author's website URL
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: The date the author was added to the system
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: The date the author was last updated
 *       example:
 *         firstName: "Jane"
 *         lastName: "Doe"
 *         email: "jane.doe@example.com"
 *         birthDate: "1980-05-15"
 *         nationality: "American"
 *         biography: "Jane Doe is a bestselling author known for her compelling fiction novels."
 *         website: "https://janedoe.com"
 *     AuthorInput:
 *       type: object
 *       required:
 *         - firstName
 *         - lastName
 *         - email
 *         - birthDate
 *         - nationality
 *       properties:
 *         firstName:
 *           type: string
 *           description: The first name of the author
 *         lastName:
 *           type: string
 *           description: The last name of the author
 *         email:
 *           type: string
 *           format: email
 *           description: The email address of the author
 *         birthDate:
 *           type: string
 *           format: date
 *           description: The birth date of the author
 *         nationality:
 *           type: string
 *           description: The nationality of the author
 *         biography:
 *           type: string
 *           description: A brief biography of the author
 *         website:
 *           type: string
 *           format: uri
 *           description: The author's website URL
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
 *   name: Authors
 *   description: The authors managing API
 */

/**
 * @swagger
 * /api/authors:
 *   get:
 *     summary: Returns the list of all authors
 *     tags: [Authors]
 *     responses:
 *       200:
 *         description: The list of authors
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
 *                   description: Number of authors returned
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Author'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/', authorsController.getAllAuthors);

/**
 * @swagger
 * /api/authors/{id}:
 *   get:
 *     summary: Get an author by id
 *     tags: [Authors]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The author id (MongoDB ObjectId)
 *     responses:
 *       200:
 *         description: The author description by id
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Author'
 *       400:
 *         description: Invalid author ID format
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: The author was not found
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
router.get('/:id', authorsController.getAuthorById);

/**
 * @swagger
 * /api/authors:
 *   post:
 *     summary: Create a new author
 *     tags: [Authors]
 *     security:
 *       - sessionAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AuthorInput'
 *           example:
 *             firstName: "John"
 *             lastName: "Doe"
 *             email: "john.doe@example.com"
 *             birthDate: "1980-05-15"
 *             nationality: "American"
 *             biography: "John Doe is a bestselling author known for his compelling fiction novels."
 *             website: "https://johndoe.com"
 *     responses:
 *       201:
 *         description: The author was created successfully
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
 *                   example: "Author created successfully"
 *                 data:
 *                   $ref: '#/components/schemas/Author'
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
 *                   example: ["First name is required", "Email must be valid"]
 *       401:
 *         description: Authentication required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       409:
 *         description: Author with this email already exists
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
router.post('/', requireAuth, authorsController.createAuthor);

/**
 * @swagger
 * /api/authors/{id}:
 *   put:
 *     summary: Update an author by id
 *     tags: [Authors]
 *     security:
 *       - sessionAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The author id (MongoDB ObjectId)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AuthorInput'
 *           example:
 *             firstName: "Jane"
 *             lastName: "Smith"
 *             email: "jane.smith@example.com"
 *             birthDate: "1985-03-20"
 *             nationality: "Canadian"
 *             biography: "Jane Smith is an award-winning author specializing in mystery novels."
 *             website: "https://janesmith.com"
 *     responses:
 *       200:
 *         description: The author was updated successfully
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
 *                   example: "Author updated successfully"
 *                 data:
 *                   $ref: '#/components/schemas/Author'
 *       400:
 *         description: Invalid author ID format or validation error or no changes made
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Authentication required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: The author was not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       409:
 *         description: Email conflict with another author
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
router.put('/:id', requireAuth, authorsController.updateAuthor);

/**
 * @swagger
 * /api/authors/{id}:
 *   delete:
 *     summary: Delete an author by id
 *     tags: [Authors]
 *     security:
 *       - sessionAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The author id (MongoDB ObjectId)
 *     responses:
 *       200:
 *         description: The author was deleted successfully
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
 *                   example: "Author deleted successfully"
 *                 data:
 *                   $ref: '#/components/schemas/Author'
 *       400:
 *         description: Invalid author ID format
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Authentication required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: The author was not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       409:
 *         description: Cannot delete author. Author has associated books.
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
router.delete('/:id', requireAuth, authorsController.deleteAuthor);

module.exports = router;