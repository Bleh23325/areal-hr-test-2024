const Joi = require('joi');

exports.histori_of_changes_validation = (data) => {
    const schema = Joi.object({
        date_and_time_of_operation: Joi.date()
        .iso().required().messages({  // iso проверяет, что дата в формате '2023-11-25'
            'date.base': 'Поле должно быть валидной датой.',
            'date.format': 'Дата должна быть в формате "YYYY-MM-DD"',
            'any.required': 'Поле "Дата" обязательно для заполнения.',
        }),
            object_of_operation: Joi.string()
            .max(30).required().messages({
                'string.base': 'Поле "Объект операций" должно быть строкой.',
                'string.max': 'Поле "Объект операций" не может превышать 30 символов.',
                'any.required': 'Поле "Объект операций" обязательно для заполнения.',
                'string.empty': 'Поле "Объект операций" не может быть пустым.',
            }),
            modified_fields: Joi.string()
            .max(30).required().messages({
                'string.base': 'Поле "Изменённые поля" должно быть строкой.',
                'string.max': 'Поле "Изменённые поля" не может превышать 30 символов.',
                'any.required': 'Поле "Изменённые поля" обязательно для заполнения.',
                'string.empty': 'Поле "Изменённые поля" не может быть пустым.',
            }),

    
    });

    // Валидация данных и возврат результата
    return schema.validate(data);
};
