const { literal } = require('sequelize');
const _ = require('lodash');

const { User, Book, Loan } = require('../models');
const ApiError = require('../utils/ApiError');
const logger = require('../utils/logger');

module.exports.getAllUsers = async (req, res) => {
    // retrieve all users from the database
    const users = await User.findAll();

    logger.info('Users have been retrieved successfully');

    res.status(200).send(users);
};

module.exports.getUser = async (req, res, next) => {
    // destructure user id from request parameters
    const { id } = req.params;

    // check if the user exists
    const user = await User.findOne({ where: { id } });
    if (!user) {
        return next(new ApiError(`User with id ${id} not found`, 404));
    }

    // find the books loaned to the user
    let userBooks = await Loan.findAll({
        include: [
            {
                model: Book,
                attributes: [],
            },
        ],
        attributes: [
            'isReturned',
            'userScore',
            [literal('"Book"."name"'), 'name'],
        ],
        where: { userId: id },
        raw: true,
    });

    // group books according to whether the loan is past or present
    userBooks = _.mapValues(_.groupBy(userBooks, 'isReturned'), (blist) =>
        blist.map((book) => {
            if (!book.isReturned) {
                book = _.omit(book, 'userScore');
            }
            book = _.omit(book, 'isReturned');
            return book;
        })
    );

    // prepare response data
    const userBookData = {
        id: user.id,
        name: user.name,
        books: {
            past: [...(userBooks[true] || [])],
            present: [...(userBooks[false] || [])],
        },
    };

    logger.info(`User with id ${id} has been retrieved successfully`);

    res.status(200).send(userBookData);
};

module.exports.registerUser = async (req, res) => {
    // destructure user name from request body
    const { name } = req.body;

    // create new user with the given name
    await User.create({ name });

    logger.info(`User with name ${name} has been created successfully`);

    res.status(201).send();
};

module.exports.borrowBook = async (req, res, next) => {
    // destructure userId and bookId from request parameters
    const { userId, bookId } = req.params;

    // check if user exists
    const user = await User.findOne({ where: { id: userId } });
    if (!user) {
        return next(new ApiError(`User with id ${userId} not found`, 404));
    }

    // check if book exists
    const book = await Book.findOne({ where: { id: bookId } });
    if (!book) {
        return next(new ApiError(`Book with id ${bookId} not found`, 404));
    }

    // check if book is loaned to a user currently
    const isBookNotAvailable = await Loan.count({
        where: { bookId, isReturned: false },
    });
    // check if book is ever loaned
    const isBookTakenOnce = await Loan.count({ where: { bookId } });
    console.log(isBookNotAvailable ,isBookTakenOnce)
    // if book is loaned at least once and book is loaned to a user currently, it cannot be loaned
    if (isBookTakenOnce && isBookNotAvailable) {
        return next(
            new ApiError(`Book with id ${bookId} is not available`, 403)
        );
    }

    // create new loan with the given userId and bookId
    await Loan.create({ userId, bookId, isReturned: false });

    logger.info(
        `User with id ${userId} has borrowed book with id ${bookId} successfully`
    );

    res.status(204).send();
};

module.exports.returnBook = async (req, res, next) => {
    // destructure userId and bookId from request parameters
    const { userId, bookId } = req.params;

    // destructure score as userScore from request body
    const { score: userScore } = req.body;

    // check if user exists
    const user = await User.findOne({ where: { id: userId } });
    if (!user) {
        return next(new ApiError(`User with id ${userId} not found`, 404));
    }

    // check if book exists
    const book = await Book.findOne({ where: { id: bookId } });
    if (!book) {
        return next(new ApiError(`Book with id ${bookId} not found`, 404));
    }

    // check if the user holds the book currently
    const loan = await Loan.findOne({
        where: { userId, bookId, isReturned: false },
    });

    if (!loan) {
        return next(
            new ApiError(
                `User ${userId} does not hold the book with id ${bookId}`,
                403
            )
        );
    }

    // return book to the library
    await Loan.update(
        { userScore, isReturned: true },
        { where: { userId, bookId } }
    );

    logger.info(
        `User with id ${userId} has returned book with id ${bookId} successfully`
    );

    res.status(204).send();
};
