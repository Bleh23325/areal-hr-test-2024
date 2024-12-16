const Joi = require("joi");

exports.workerValidation = (data) => {
    const schema = Joi.object({
        lastname: Joi.string()
            .max(30)
            .required(),
        name: Joi.string()
            .max(30)
            .required(),
        patronumic: Joi.string()
            .max(30)
            .required(),
        phone: Joi.string()
            .pattern(/^(?:\+7|7)(?:\(\d{3}\)|\d{3})\d{3}-\d{2}-\d{2}|\d{10}$/)  
            .required()
    });

    return schema.validate(data);
};
