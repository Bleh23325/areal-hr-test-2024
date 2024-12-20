const fs = require('fs');
const path = require('path');
const db = require('../db/Connect');
const { histori_of_changes_validation } = require('../validations/histori_of_changes_validation'); 
class historiOfChangesController{
    // создание прав доступа
    async createHistoriOfChanges(req, res) {
        const { date_and_time_of_operation,who_change,object_of_change,modified_fields } = req.body;

        // Валидация данных
        const validationResult = histori_of_changes_validation({
            date_and_time_of_operation,
            object_of_change,
            modified_fields,
        });

        if (validationResult.error) {
            return res.status(400).json({
                message: 'Ошибка валидации',
                error: validationResult.error.details.map((detail) => detail.message).join(', '),
            });
        }

        try {
            const newHistoriOfChanges = await db.query(
                'INSERT INTO histori_of_changes(date_and_time_of_operation,who_change,object_of_change,modified_fields) VALUES ($1,$2,$3,$4) RETURNING *', 
                [date_and_time_of_operation,who_change,object_of_change,modified_fields]
            );
            res.json(`История изменений ${newHistoriOfChanges.rows[0].name} добавлена в базу данных`);
        } catch (error) {
            res.status(500).json({ message: 'Ошибка при добавлении истории изменений', error });
        }
    }
    
        // просмотр прав доступа
        async getHistoriOfChanges(req, res) {
            try {
                const historsiOfChanges = await db.query('SELECT * FROM histori_of_changes');
                res.json(historsiOfChanges.rows);
            } catch (error) {
                res.status(500).json({ message: 'Ошибка при получении истории доступа', error });
            }
        }
    
        // возврат 1 прав доступа по айди
        async getOneHistoriOfChanges(req, res) {
            const { id } = req.params;
            try {
                const HistoriOfChanges = await db.query('SELECT * FROM histori_of_changes WHERE id_histori_of_changes = $1', [id]);
                if (HistoriOfChanges.rows.length === 0) {
                    res.status(404).json({ message: 'Стория изменений не найденф' });
                } else {
                    res.json(HistoriOfChanges.rows[0]);
                }
            } catch (error) {
                res.status(500).json({ message: 'Ошибка при получении истории изменений', error });
            }
        }
    
        // обновление прав доступа
        async updateHistoriOfChanges(req, res) {
            const { id } = req.params;
            const { date_and_time_of_operation,who_change,object_of_change,modified_fields } = req.body;

            // Валидация данных
        const validationResult = histori_of_changes_validation({
            date_and_time_of_operation,
            object_of_change,
            modified_fields,
        });

        if (validationResult.error) {
            return res.status(400).json({
                message: 'Ошибка валидации',
                error: validationResult.error.details.map((detail) => detail.message).join(', '),
            });
        }

            try {
                const updateHistoriOfChanges = await db.query(
                    'UPDATE histori_of_changes SET date_and_time_of_operation =$1,who_change =$2,object_of_change =$3,modified_fields =$4 WHERE id_histori_of_changes = $5 RETURNING *', 
                    [date_and_time_of_operation,who_change,object_of_change,modified_fields, id]
                );
                if (updateHistoriOfChanges.rows.length === 0) {
                    res.status(404).json({ message: 'История изменений не найдена' });
                } else {
                    res.json(`История изменений ${updateHistoriOfChanges.rows[0].name} обновлена`);
                }
            } catch (error) {
                res.status(500).json({ message: 'Ошибка при обновлении истории должности', error });
            }
        }
    
        // удаление прав доступа
        async deleteHistoriOfChanges(req, res) {
            const { id } = req.params;
            try {
                const deleteHistoriOfChanges = await db.query('DELETE FROM histori_of_changes WHERE id_histori_of_changes = $1 RETURNING *', [id]);
                if (deleteHistoriOfChanges.rows.length === 0) {
                    res.status(404).json({ message: 'История изменений не найденф' });
                } else {
                    res.json(`История изменений ${deleteHistoriOfChanges.rows[0].name} удалена`);
                }
            } catch (error) {
                res.status(500).json({ message: 'Ошибка при удалении истории изменений', error });
            }
        }

        // Экспорт данных пользователей в файл
    async exportHistoriOfChangesToFile(req, res) {
        try {
            // Получаем данные из базы
            const result = await db.query('SELECT * FROM histori_of_changes');
            const histori_of_changes = result.rows;

            // Путь для сохранения файла
            const exportDirectory = path.join(__dirname, '..', 'export'); // Папка export

            // Проверка существования папки и её создание
            if (!fs.existsSync(exportDirectory)) {
                fs.mkdirSync(exportDirectory);
            }

            // Создание пути для JSON файла
            const filePath = path.join(exportDirectory, 'histori_of_changes.json');
            
            // Запись данных в файл
            fs.writeFileSync(filePath, JSON.stringify(histori_of_changes, null, 2));

            // Отправка файла на скачивание
            res.download(filePath, 'histori_of_changes.json', (err) => {
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
module.exports = new historiOfChangesController