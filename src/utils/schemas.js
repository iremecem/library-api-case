const Joi = require('joi');

const schemas = {
    user: Joi.object().keys({
        name: Joi.string().trim().max(255).required(),
    }),
    book: Joi.object().keys({
        name: Joi.string().trim().max(255).required(),
    }),
    userScore: Joi.object().keys({
        score: Joi.number().min(1).max(10).required(),
    }),
};
module.exports = schemas;
