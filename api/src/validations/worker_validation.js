const Joi = require('joi');

exports.workerValidation = (data) => {
    const schema = Joi.object({
        lastname: Joi.string()
            .max(30)
            .required()
            .messages({
                'string.base': 'Поле "Фамилия" должно быть строкой.',
                'string.max': 'Поле "Фамилия" не может превышать 30 символов.',
                'any.required': 'Поле "Фамилия" обязательно для заполнения.',
                'string.empty': 'Поле "Фамилия" не может быть пустым.',
            }),

        name: Joi.string()
            .max(30)
            .required()
            .messages({
                'string.base': 'Поле "Имя" должно быть строкой.',
                'string.max': 'Поле "Имя" не может превышать 30 символов.',
                'any.required': 'Поле "Имя" обязательно для заполнения.',
                'string.empty': 'Поле "Имя" не может быть пустым.',
            }),

        patronumic: Joi.string()
            .max(30)
            .required()
            .messages({
                'string.base': 'Поле "Отчество" должно быть строкой.',
                'string.max': 'Поле "Отчество" не может превышать 30 символов.',
                'any.required': 'Поле "Отчество" обязательно для заполнения.',
                'string.empty': 'Поле "Отчество" не может быть пустым.',
            }),

        phone: Joi.string()
            .pattern(/^(?:\+7|8)[\s\(]?\d{3}[\s\)-]?\d{3}[\s\-]?\d{2}[\s\-]?\d{2}$/)
            .required()
            .messages({
                'string.empty': 'Телефон обязателен.',
                'string.pattern.base': 'Телефон должен быть в формате: +7 999 999-99-99 или 8 999 999 99 99.',
            }),
    });

    return schema.validate(data); // возвращаем результат валидации
};
