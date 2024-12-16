const fs = require('fs');
const path = require('path');
const db = require('../db/Connect');
const { roots_validation } = require('../validations/roots_validation'); 
class rootsController{
    // создание прав доступа
    async createRoots(req, res) {
        const { name } = req.body;
        console.log(name);

        // Валидация данных
        const validationResult = roots_validation({
            name,
        });

        if (validationResult.error) {
            return res.status(400).json({
                message: 'Ошибка валидации',
                error: validationResult.error.details.map((detail) => detail.message).join(', '),
            });
        }

        try {
            const newRoots = await db.query(
                'INSERT INTO roots(name) VALUES ($1) RETURNING *', 
                [name]
            );
            res.json(`Права дуступа ${newRoots.rows[0].name} добавлены в базу данных`);
        } catch (error) {
            res.status(500).json({ message: 'Ошибка при добавлении прав доступа', error });
        }
    }
    
        // просмотр прав доступа
        async getRoots(req, res) {
            try {
                const Roots = await db.query('SELECT * FROM roots');
                res.json(Roots.rows);
            } catch (error) {
                res.status(500).json({ message: 'Ошибка при получении прав доступа', error });
            }
        }
    
        // возврат 1 прав доступа по айди
        async getOneRoots(req, res) {
            const { id } = req.params;
            try {
                const Root = await db.query('SELECT * FROM roots WHERE id_roots = $1', [id]);
                if (Root.rows.length === 0) {
                    res.status(404).json({ message: 'Права доступа не найдены' });
                } else {
                    res.json(Root.rows[0]);
                }
            } catch (error) {
                res.status(500).json({ message: 'Ошибка при получении прав доступа', error });
            }
        }
    
        // обновление прав доступа
        async updateRoots(req, res) {
            const { id } = req.params;
            const { name } = req.body;

            // Валидация данных
        const validationResult = roots_validation({
            name,
        });

        if (validationResult.error) {
            return res.status(400).json({
                message: 'Ошибка валидации',
                error: validationResult.error.details.map((detail) => detail.message).join(', '),
            });
        }

            try {
                const updateRoots = await db.query(
                    'UPDATE roots SET name = $1 WHERE id_roots = $2 RETURNING *', 
                    [name, id]
                );
                if (updateRoots.rows.length === 0) {
                    res.status(404).json({ message: 'Права дуступа не найдены' });
                } else {
                    res.json(`Права дуступа ${updateRoots.rows[0].name} обновлены`);
                }
            } catch (error) {
                res.status(500).json({ message: 'Ошибка при обновлении прав доступа', error });
            }
        }
    
        // удаление прав доступа
        async deleteRoots(req, res) {
            const { id } = req.params;
            try {
                const deleteRoots = await db.query('DELETE FROM roots WHERE id_roots = $1 RETURNING *', [id]);
                if (deleteRoots.rows.length === 0) {
                    res.status(404).json({ message: 'Права доступа не найдены' });
                } else {
                    res.json(`Права доступы ${deleteRoots.rows[0].name} удалены`);
                }
            } catch (error) {
                res.status(500).json({ message: 'Ошибка при удалении прав доступа', error });
            }
        }

        // выгрузка данных в файл
    async exportRootsToFile(req, res) {
        try {
            // получаем данные из базы
            const result = await db.query('SELECT * FROM roots');
            const roots = result.rows;

            // путь для сохранения файла
            const exportDirectory = path.join(__dirname, '..', 'export'); // путь к папке export

            // проверка существования папки и её создание при отсутствии
            if (!fs.existsSync(exportDirectory)) {
                fs.mkdirSync(exportDirectory);
            }

            // создаем путь для JSON файла
            const filePath = path.join(exportDirectory, 'roots.json');
            
            // запись данных в файл
            fs.writeFileSync(filePath, JSON.stringify(roots, null, 2));

            // отправляем файл на скачивание
            res.download(filePath, 'roots.json', (err) => {
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
// экспортируем объект контроллера
module.exports = new rootsController