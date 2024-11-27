const Joi = require('joi');

exports.roots_validation = (data) => {
    const schema = Joi.object({
            name: Joi.string()
            .max(30).required().messages({
                'string.base': 'Поле "Название" должно быть строкой.',
                'string.max': 'Поле "Название" не может превышать 30 символов.',
                'any.required': 'Поле "Название" обязательно для заполнения.',
                'string.empty': 'Поле "Название" не может быть пустым.',
            }),
    
    });

    // Валидация данных и возврат результата
    return schema.validate(data);
};
