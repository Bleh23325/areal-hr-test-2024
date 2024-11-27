const Joi = require('joi');

exports.hiring_validation = (data) => {
    const schema = Joi.object({
        salary: Joi.number()
        .required().messages({
                'string.base': 'Поле "Зарплата" должно быть числом.',
                'any.required': 'Поле "Зарплата" обязательно для заполнения.',
                'string.empty': 'Поле "Зарплата" не может быть пустым.',
            }), 
    });

    // Валидация данных и возврат результата
    return schema.validate(data);
};
