const Joi = require('joi');
const ApiError = require('../utils/ApiError');
const validateRequest = (schema, property) => {
    return (req, res, next) => {
        const { error } = schema.validate(req[property]);
        const valid = error == null;

        if (valid) {
            next();
        } else {
            const { details } = error;
            const message = details.map((i) => i.message).join(',');

            return next(new ApiError(message, 422));
        }
    };
};
module.exports = validateRequest;