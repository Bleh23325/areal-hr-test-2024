const Joi = require('joi');

exports.passport_validation = (data) => {
    const schema = Joi.object({
        passport_series: Joi.number().min(0).max(9999).required().messages({
    'number.base': 'Серия паспорта должна быть числом.',
    'any.required': 'Поле "Серия паспорта" обязательно.',
    'number.min': 'Серия паспорта не может быть меньше 0.',
    'number.max': 'Серия паспорта не может быть больше 9999.',
}),

        passport_number: Joi.number()
            .integer().min(0).max(999999).required().messages({
                'number.base': 'Номер паспорта должен быть числом.',
                'number.min': 'Номер паспорта не может быть меньше 0.',
                'number.max': 'Номер паспорта не может быть больше 999999.',
                'any.required': 'Поле "Номер паспорта" обязательно.',
            }),
        date_of_issue: Joi.date()
        .iso().required().messages({  // iso проверяет, что дата в формате '2023-11-25'
            'date.base': 'Поле должно быть валидной датой.',
            'date.format': 'Дата должна быть в формате "YYYY-MM-DD"',
            'any.required': 'Поле "Дата" обязательно для заполнения.',
        }),

        department_code: Joi.string()
            .pattern(/^\d{3}-\d{3}$/).required().messages({
                'string.pattern.base': 'Код отдела должен быть в формате XXX-XXX.',
                'any.required': 'Поле "Код отдела" обязательно.',
                'string.empty': 'Поле "Код отдела" не может быть пустым.',
            }),

            who_issue: Joi.string()
            .required().max(80).messages({
                'string.base': 'Поле "Кто выдал" должно быть строкой.',
                'any.required': 'Поле "Кто выдал" обязательно для заполнения.',
                'string.empty': 'Поле "Кто выдал" не может быть пустым.',
            }),
    });

    // Валидация данных и возврат результата
    return schema.validate(data);
};
