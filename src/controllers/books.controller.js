const { literal } = require('sequelize');
const _ = require('lodash');

const { sequelize, Book, Loan } = require('../models');
const ApiError = require('../utils/ApiError');
const logger = require('../utils/logger');

module.exports.getAllBooks = async (req, res) => {
    // retrieve all books from the database
    const books = await Book.findAll();

    logger.info('Books have been retrieved successfully');

    res.status(200).send(books);
};

module.exports.getBook = async (req, res, next) => {
    // destructure book id from request parameters
    const { id } = req.params;

    // check if the book exists
    const book = await Book.findOne({ where: { id } });
    if (!book) {
        return next(new ApiError(`Book with id ${id} not found`, 404));
    }

    // find average score of the book
    const bookScore = await Loan.findOne({
        attributes: ['userScore'],
        attributes: [
            [sequelize.fn('AVG', sequelize.col('Loan.user_score')), 'score'],
        ],
        where: { bookId: id },
        group: ['book_id'],
        raw: true,
    });

    // prepare response data
    const bookData = {
        id: book.id,
        name: book.name,
        score: bookScore ? _.round(bookScore.score, 2) : -1,
    };

    logger.info(`User with id ${id} has been retrieved successfully`);

    res.status(200).send(bookData);
};

module.exports.registerBook = async (req, res) => {
    // destructure book name from request body
    const { name } = req.body;

    // create new book with the given name
    await Book.create({ name });

    logger.info(`Book with name ${name} has been created successfully`);

    res.status(201).send();
};
