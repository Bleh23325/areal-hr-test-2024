const Joi = require('joi');

exports.personel_operations_validation = (data) => {
    const schema = Joi.object({
        change_salary: Joi.number()
            .required().messages({
                'number.base': 'Поле "Изменение зарплаты" должно быть числом.', 
                'any.required': 'Поле "Изменение зарплаты" обязательно для заполнения.',
                'number.empty': 'Поле "Изменение зарплаты" не может быть пустым.',
            }), 

        change_department: Joi.string()
            .max(30).required().messages({
                'string.base': 'Поле "Изменение отдела" должно быть строкой.',
                'string.max': 'Поле "Изменение отдела" не может превышать 30 символов.',
                'any.required': 'Поле "Изменение отдела" обязательно для заполнения.',
                'string.empty': 'Поле "Изменение отдела" не может быть пустым.',
            }),

        is_dismissed: Joi.bool()
            .required().messages({
                'boolean.base': 'Поле "Уволен" должно быть булевым значением.',
                'any.required': 'Поле "Уволен" обязательно для заполнения.',
            }),    
    });

    // Валидация данных и возврат результата
    return schema.validate(data);
};
