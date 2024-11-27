const Joi = require('joi');

exports.job_title_validation = (data) => {
    const schema = Joi.object({
            name: Joi.string()
            .max(30).required().messages({
                'string.base': 'Поле "Объект операций" должно быть строкой.',
                'string.max': 'Поле "Объект операций" не может превышать 30 символов.',
                'any.required': 'Поле "Объект операций" обязательно для заполнения.',
                'string.empty': 'Поле "Объект операций" не может быть пустым.',
            }),
    
    });

    // Валидация данных и возврат результата
    return schema.validate(data);
};
