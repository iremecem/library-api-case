const express = require('express');
const router = express.Router();
const booksController = require('../controllers/books.controller');
const catchAsync = require('../utils/catchAsync');
const schemas = require('../utils/schemas');
const validateRequest = require('../middlewares/requestValidator');

router
    .route('/')
    .get(catchAsync(booksController.getAllBooks))
    .post(validateRequest(schemas.book, 'body'), catchAsync(booksController.registerBook));

router.route('/:id').get(catchAsync(booksController.getBook));

module.exports = router;
