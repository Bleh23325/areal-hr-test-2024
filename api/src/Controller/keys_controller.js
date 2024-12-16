const fs = require('fs');
const path = require('path');
const db = require('../db/Connect');
const { users_validation } = require('../validations/users_validation'); 

class usersController {
    // Создание нового пользователя
    async createKeys(req, res) {
        const { user_name, password, root } = req.body;
        
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
            const newUser = await db.query(
                'INSERT INTO users(user_name, password, root) VALUES ($1, $2, $3) RETURNING *', 
                [user_name, password, root]
            );
            res.status(201).json(newUser.rows[0]);
        } catch (error) {
            console.error("Ошибка при добавлении пользователя:", error);
            res.status(500).json({ message: 'Ошибка при добавлении пользователя', error });
        }
    }
    
    // Получение списка пользователей
    async getKeys(req, res) {
        try {
            const users = await db.query('SELECT * FROM users');
            res.json(users.rows);
        } catch (error) {
            console.error("Ошибка при получении пользователей:", error);
            res.status(500).json({ message: 'Ошибка при получении пользователей', error });
        }
    }

    // Получение одного пользователя по ID
    async getOneKeys(req, res) {
        const { id } = req.params;
        try {
            const user = await db.query('SELECT * FROM users WHERE id_us = $1', [id]);
            if (user.rows.length === 0) {
                res.status(404).json({ message: 'Пользователь не найден' });
            } else {
                res.json(user.rows[0]);
            }
        } catch (error) {
            console.error("Ошибка при получении пользователя:", error);
            res.status(500).json({ message: 'Ошибка при получении пользователя', error });
        }
    }

    // Обновление данных пользователя
    async updateKeys(req, res) {
        const { id } = req.params;
        const { user_name, password, root } = req.body;

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
            const updatedUser = await db.query(
                'UPDATE users SET user_name = $1, password = $2, root = $3 WHERE id_us = $4 RETURNING *', 
                [user_name, password, root, id]
            );
            if (updatedUser.rows.length === 0) {
                res.status(404).json({ message: 'Пользователь не найден' });
            } else {
                res.json(updatedUser.rows[0]);
            }
        } catch (error) {
            console.error("Ошибка при обновлении пользователя:", error);
            res.status(500).json({ message: 'Ошибка при обновлении пользователя', error });
        }
    }

    // Удаление пользователя
    async deleteKeys(req, res) {
        const { id } = req.params;
        try {
            const deletedUser = await db.query('DELETE FROM users WHERE id_us = $1 RETURNING *', [id]);
            if (deletedUser.rows.length === 0) {
                res.status(404).json({ message: 'Пользователь не найден' });
            } else {
                res.json(deletedUser.rows[0]);
            }
        } catch (error) {
            console.error("Ошибка при удалении пользователя:", error);
            res.status(500).json({ message: 'Ошибка при удалении пользователя', error });
        }
    }

    // Экспорт данных пользователей в файл
    async exportUsersToFile(req, res) {
        try {
            // Получаем данные из базы
            const result = await db.query('SELECT * FROM users');
            const users = result.rows;

            // Путь для сохранения файла
            const exportDirectory = path.join(__dirname, '..', 'export'); // Папка export

            // Проверка существования папки и её создание
            if (!fs.existsSync(exportDirectory)) {
                fs.mkdirSync(exportDirectory);
            }

            // Создание пути для JSON файла
            const filePath = path.join(exportDirectory, 'users.json');
            
            // Запись данных в файл
            fs.writeFileSync(filePath, JSON.stringify(users, null, 2));

            // Отправка файла на скачивание
            res.download(filePath, 'users.json', (err) => {
                if (err) {
                    console.error("Ошибка при скачивании файла:", err);
                    res.status(500).json({ message: "Ошибка при скачивании файла" });
                } 
            });
        } catch (error) {
            console.error("Ошибка при выгрузке данных:", error);
            res.status(500).json({ message: 'Ошибка при выгрузке данных', error });
        }
    }
}

module.exports = new usersController();
