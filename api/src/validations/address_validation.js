const Joi = require('joi');

exports.address_validation = (data) => {
    const schema = Joi.object({
        region: Joi.string()
            .max(30).required().messages({
                'string.base': 'Поле "Регион" должно быть строкой.',
                'string.max': 'Поле "Регион" не может превышать 30 символов.',
                'any.required': 'Поле "Регион" обязательно для заполнения.',
                'string.empty': 'Поле "Регион" не может быть пустым.',
            }),
            settlement: Joi.string()
            .max(30).required().messages({
                'string.base': 'Поле "Поселение" должно быть строкой.',
                'string.max': 'Поле "Поселение" не может превышать 30 символов.',
                'any.required': 'Поле "Поселение" обязательно для заполнения.',
                'string.empty': 'Поле "Поселение" не может быть пустым.',
            }),
            street: Joi.string()
            .max(30).required().messages({
                'number.base': 'Поле "Дом" должно быть строкой.',
                'string.max': 'Поле "Дом" не может превышать 30 символов.',
                'any.required': 'Поле "Дом" обязательно для заполнения.',
                'string.empty': 'Поле "Дом" не может быть пустым.',
            }),
            house: Joi.number()
            .integer().positive().required().messages({
                'string.base': 'Поле "Дом" должно быть строкой.',
                'any.required': 'Поле "Дом" обязательно для заполнения.',
                'string.empty': 'Поле "Дом" не может быть пустым.',
            }),
            building: Joi.string()
            .max(30).required().messages({
                'string.base': 'Поле "Корпус" должно быть строкой.',
                'string.max': 'Поле "Корпус" не может превышать 30 символов.',
                'any.required': 'Поле "Корпус" обязательно для заполнения.',
                'string.empty': 'Поле "Корпус" не может быть пустым.',
            }),

            apartment: Joi.string()
            .max(30).required().messages({
                'string.base': 'Поле "Квартира" должно быть строкой.',
                'string.max': 'Поле "Квартира" не может превышать 30 символов.',
                'any.required': 'Поле "Квартира" обязательно для заполнения.',
                'string.empty': 'Поле "Квартира" не может быть пустым.',
            }),


    
    });

    // Валидация данных и возврат результата
    return schema.validate(data);
};
