const express = require('express');
const router = express.Router();
const usersController = require('../controllers/users.controller');
const catchAsync = require('../utils/catchAsync');
const schemas = require('../utils/schemas');
const validateRequest = require('../middlewares/requestValidator');


router
    .route('/')
    .get(catchAsync(usersController.getAllUsers))
    .post(validateRequest(schemas.user, 'body'), catchAsync(usersController.registerUser));

router.route('/:id').get(catchAsync(usersController.getUser));

router
    .route('/:userId/borrow/:bookId')
    .post(catchAsync(usersController.borrowBook));

router
    .route('/:userId/return/:bookId')
    .post(validateRequest(schemas.userScore, 'body'), catchAsync(usersController.returnBook));

module.exports = router;
