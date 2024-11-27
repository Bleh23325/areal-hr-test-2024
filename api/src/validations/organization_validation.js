const Joi = require('joi');

exports.organization_validation = (data) => {
    const schema = Joi.object({
        name: Joi.string()
            .max(30).required().messages({
                'string.base': 'Поле "Имя" должно быть строкой.',
                'string.max': 'Поле "Имя" не может превышать 30 символов.',
                'any.required': 'Поле "Имя" обязательно для заполнения.',
                'string.empty': 'Поле "Имя" не может быть пустым.',
            }),
            
            comments: Joi.string()
            .required().messages({
                'string.base': 'Поле "Комментарий" должно быть строкой.',
                'any.required': 'Поле "Комментарий" обязательно для заполнения.',
                'string.empty': 'Поле "Комментарий" не может быть пустым.',
            }),    
    });

    // Валидация данных и возврат результата
    return schema.validate(data);
};
