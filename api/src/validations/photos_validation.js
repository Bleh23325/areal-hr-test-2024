const Joi = require('joi');

exports.workerValidation = (data) => {
    const schema = Joi.object({
        lastname: Joi.string()
            .max(30).required().messages({
                'string.base': 'Поле "Фамилия" должно быть строкой.',
                'string.max': 'Поле "Фамилия" не может превышать 30 символов.',
                'any.required': 'Поле "Фамилия" обязательно для заполнения.',
                'string.empty': 'Поле "Фамилия" не может быть пустым.',
            }),

        path: Joi.string()
        .required().messages({
            'string.base': 'Поле "Путь" должно быть строкой.',
            'any.required': 'Поле "Путь" обязательно для заполнения.',
            'string.empty': 'Поле "Путь" не может быть пустым.',
        }), 
    });

    return schema.validate(data); // возвращаем результат валидации
};
