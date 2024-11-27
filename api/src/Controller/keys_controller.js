const db = require('../db/Connect');
const { users_validation } = require('../validations/users_validation'); 
class usersController{
    // создание прав доступа
    async createusers(req, res) {
        const { user_name, password, root, worker } = req.body;
        console.log(user_name, password, root, worker);

        // Валидация данных
        const validationResult = users_validation({
            user_name,
            password,
        });

        if (validationResult.error) {
            return res.status(400).json({
                message: 'Ошибка валидации',
                error: validationResult.error.details.map((detail) => detail.message).join(', '),
            });
        }


        try {
            const newKey = await db.query(
                'INSERT INTO users(user_name, password, root, worker) VALUES ($1,$2,$3,$4) RETURNING *', 
                [user_name, password, root, worker]
            );
            res.json(`Ключ ${newKey.rows[0].name} добавлен в базу данных`);
        } catch (error) {
            res.status(500).json({ message: 'Ошибка при добавлении ключа', error });
        }
    }
    
        // просмотр прав доступа
        async getusers(req, res) {
            try {
                const users = await db.query('SELECT * FROM users');
                res.json(users.rows);
            } catch (error) {
                res.status(500).json({ message: 'Ошибка при получении ключей', error });
            }
        }
    
        // возврат 1 прав доступа по айди
        async getOneusers(req, res) {
            const { id } = req.params;
            try {
                const users = await db.query('SELECT * FROM users WHERE id_users = $1', [id]);
                if (users.rows.length === 0) {
                    res.status(404).json({ message: 'Ключ не найден' });
                } else {
                    res.json(users.rows[0]);
                }
            } catch (error) {
                res.status(500).json({ message: 'Ошибка при получении ключа', error });
            }
        }
    
        // обновление прав доступа
        async updateusers(req, res) {
            const { id } = req.params;
            const { user_name, password, root, worker } = req.body;

            // Валидация данных
        const validationResult = users_validation({
            user_name,
            password,
        });

        if (validationResult.error) {
            return res.status(400).json({
                message: 'Ошибка валидации',
                error: validationResult.error.details.map((detail) => detail.message).join(', '),
            });
        }

            try {
                const updatedusers = await db.query(
                    'UPDATE users SET user_name = $1, password = $2, root = $3, worker = $4 WHERE id_roots = $5 RETURNING *', 
                    [user_name, password, root, worker, id]
                );
                if (updatedusers.rows.length === 0) {
                    res.status(404).json({ message: 'Ключ не найден' });
                } else {
                    res.json(`Ключь ${updatedusers.rows[0].name} обновлён`);
                }
            } catch (error) {
                res.status(500).json({ message: 'Ошибка при обновлении ключа', error });
            }
        }
    
        // удаление прав доступа
        async deleteusers(req, res) {
            const { id } = req.params;
            try {
                const deleteusers = await db.query('DELETE FROM users WHERE id_users = $1 RETURNING *', [id]);
                if (deleteusers.rows.length === 0) {
                    res.status(404).json({ message: 'Ключ не найден' });
                } else {
                    res.json(`Ключ ${deleteusers.rows[0].name} удалён`);
                }
            } catch (error) {
                res.status(500).json({ message: 'Ошибка при удалении ключа', error });
            }
        }
    }
// экспортируем объект контроллера
module.exports = new usersController