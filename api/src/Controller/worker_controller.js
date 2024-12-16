const fs = require('fs');
const path = require('path');
const db = require('../db/Connect');
const { workerValidation } = require('../validations/worker_validation');

class workerController {
    // создание работника
    async createWorker(req, res) {
        const { lastname, name, patronumic, phone } = req.body;

        // Валидация данных
        const validationResult = workerValidation({
            lastname,
            name,
            patronumic,
            phone,
        });

        // Проверка наличия ошибки в валидации
        if (validationResult && validationResult.error) {
            return res.status(400).json({
                message: 'Ошибка валидации',
                error: validationResult.error.details.map((detail) => detail.message).join(', '),
            });
        }

        try {
            const newWorker = await db.query(
                'INSERT INTO workers(lastname, name, patronumic, phone) VALUES ($1, $2, $3, $4) RETURNING *', 
                [lastname, name, patronumic, phone]
            );
            res.json({ message: `Работник ${newWorker.rows[0].name} добавлен в базу данных`, worker: newWorker.rows[0] });
        } catch (error) {
            res.status(500).json({ message: 'Ошибка при добавлении работника', error: error.message });
        }
    }

    // просмотр всех работников
    async getWorker(req, res) {
        try {
            const workers = await db.query('SELECT * FROM workers');
            res.json(workers.rows);
        } catch (error) {
            res.status(500).json({ message: 'Ошибка при получении работников', error: error.message });
        }
    }

    // возврат одного работника по ID
    async getOneWorker(req, res) {
        const { id } = req.params;
        try {
            const worker = await db.query('SELECT * FROM workers WHERE id_worker = $1', [id]);
            if (worker.rows.length === 0) {
                return res.status(404).json({ message: 'Работник не найден' });
            }
            res.json(worker.rows[0]);
        } catch (error) {
            res.status(500).json({ message: 'Ошибка при получении работника', error: error.message });
        }
    }

    // обновление работника
    async updateWorker(req, res) {
        const { id } = req.params;
        const { lastname, name, patronumic, phone } = req.body;

        // Валидация данных
        const validationResult = workerValidation({
            lastname,
            name,
            patronumic,
            phone
        });

        // Проверка наличия ошибки в валидации
        if (validationResult && validationResult.error) {
            return res.status(400).json({
                message: 'Ошибка валидации',
                error: validationResult.error.details.map((detail) => detail.message).join(', '),
            });
        }

        try {
            const updateWorker = await db.query(
                'UPDATE workers SET lastname = $1, name = $2, patronumic = $3, phone = $4 WHERE id_worker = $5 RETURNING *', 
                [lastname, name, patronumic, phone, id]
            );
            if (updateWorker.rows.length === 0) {
                return res.status(404).json({ message: 'Работник не найден' });
            }
            res.json({ message: `Работник ${updateWorker.rows[0].name} обновлен`, worker: updateWorker.rows[0] });
        } catch (error) {
            res.status(500).json({ message: 'Ошибка при обновлении работника', error: error.message });
        }
    }

    // удаление работника
    async deleteWorker(req, res) {
        const { id } = req.params;
        try {
            const deleteWorker = await db.query('DELETE FROM workers WHERE id_worker = $1 RETURNING *', [id]);
            if (deleteWorker.rows.length === 0) {
                return res.status(404).json({ message: 'Работник не найден' });
            }
            res.json({ message: `Работник с ID ${id} удален`, worker: deleteWorker.rows[0] });
        } catch (error) {
            res.status(500).json({ message: 'Ошибка при удалении работника', error: error.message });
        }
    }
    // выгрузка данных в файл
    async exportWorkersToFile(req, res) {
        try {
            // получаем данные из базы
            const result = await db.query('SELECT * FROM workers');
            const workers = result.rows;

            // путь для сохранения файла
            const exportDirectory = path.join(__dirname, '..', 'export'); // путь к папке export

            // проверка существования папки и её создание при отсутствии
            if (!fs.existsSync(exportDirectory)) {
                fs.mkdirSync(exportDirectory);
            }

            // создаем путь для JSON файла
            const filePath = path.join(exportDirectory, 'workers.json');
            
            // запись данных в файл
            fs.writeFileSync(filePath, JSON.stringify(workers, null, 2));

            // отправляем файл на скачивание
            res.download(filePath, 'workers.json', (err) => {
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

module.exports = new workerController();
