require('dotenv').config();

const express = require('express');

const ApiError = require('./src/utils/ApiError');
const logger = require('./src/utils/logger');

const userRoutes = require('./src/routes/users.route');
const bookRoutes = require('./src/routes/books.route');

const app = express();

const db = require('./src/models');
db.sequelize.authenticate();

app.use(express.json());

app.use('/users', userRoutes);
app.use('/books', bookRoutes);

app.all('*', (req, res, next) => {
    next(new ApiError('Requested URL Is Not Found', 404));
});

app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message | (statusCode === 500))
        err.message = 'Internal Server Error';
    logger.error(err.message);
    res.status(statusCode).send(new ApiError(err.message, statusCode));
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
    logger.info(`Serving on port ${port}`);
});

module.exports = { app };
