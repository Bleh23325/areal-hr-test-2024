const Joi = require('joi');

exports.users_validation = (data) => {
    const schema = Joi.object({
        user_name: Joi.string()
            .max(30).required().messages({
                'string.base': 'Поле "Логин" должно быть строкой.',
                'string.max': 'Поле "Логин" не может превышать 30 символов.',
                'any.required': 'Поле "Логин" обязательно для заполнения.',
                'string.empty': 'Поле "Логин" не может быть пустым.',
            }),
            password: Joi.string()
            .min(4).required().messages({
                'string.base': 'Поле "Пароль" должно быть строкой.',
                'string.min': 'Пароль должен быть не короче 4 символов.',
                'any.required': 'Поле "Пароль" обязательно для заполнения.',
                'string.empty': 'Поле "Пароль" не может быть пустым.',
            }),  
    });

    // Валидация данных и возврат результата
    return schema.validate(data);
};
