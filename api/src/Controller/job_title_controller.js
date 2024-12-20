const fs = require('fs');
const path = require('path');
const db = require('../db/Connect');
const { job_title_validation } = require('../validations/job_title_validation'); 

class jobTitleController {
    // создание должности
    async createJobTitle(req, res) {
        const { name } = req.body;
        console.log(name);

        const validationResult = job_title_validation({
            name,
        });

        if (validationResult.error) {
            return res.status(400).json({
                message: 'Ошибка валидации',
                error: validationResult.error.details.map((detail) => detail.message).join(', '),
            });
        }

        try {
            const newJobTitle = await db.query(
                'INSERT INTO job_title(name) VALUES ($1) RETURNING *', 
                [name]
            );
            res.json(`Должность ${newJobTitle.rows[0].name} добавлена в базу данных`);
        } catch (error) {
            res.status(500).json({ message: 'Ошибка при добавлении должности', error });
        }
    }

    // просмотр должностей
    async getJobTitle(req, res) {
        try {
            const jobTitles = await db.query('SELECT * FROM job_title');
            res.json(jobTitles.rows);
        } catch (error) {
            res.status(500).json({ message: 'Ошибка при получении должностей', error });
        }
    }

    // возврат 1 должности по айди
    async getOneJobTitle(req, res) {
        const { id } = req.params;
        try {
            const jobTitle = await db.query('SELECT * FROM job_title WHERE id_job_title = $1', [id]);
            if (jobTitle.rows.length === 0) {
                res.status(404).json({ message: 'Должность не найдена' });
            } else {
                res.json(jobTitle.rows[0]);
            }
        } catch (error) {
            res.status(500).json({ message: 'Ошибка при получении должности', error });
        }
    }

    // обновление должности
    async updateJobTitle(req, res) {
        const { id } = req.params;
        const { name } = req.body;

        const validationResult = job_title_validation({
            name,
        });

        if (validationResult.error) {
            return res.status(400).json({
                message: 'Ошибка валидации',
                error: validationResult.error.details.map((detail) => detail.message).join(', '),
            });
        }

        try {
            const updatedJobTitle = await db.query(
                'UPDATE job_title SET name = $1 WHERE id_job_title = $2 RETURNING *', 
                [name, id]
            );
            if (updatedJobTitle.rows.length === 0) {
                res.status(404).json({ message: 'Должность не найдена' });
            } else {
                res.json(`Должность ${updatedJobTitle.rows[0].name} обновлена`);
            }
        } catch (error) {
            res.status(500).json({ message: 'Ошибка при обновлении должности', error });
        }
    }

    // удаление должности
    async deleteJobTitle(req, res) {
        const { id } = req.params;
        try {
            const deletedJobTitle = await db.query('DELETE FROM job_title WHERE id_job_title = $1 RETURNING *', [id]);
            if (deletedJobTitle.rows.length === 0) {
                res.status(404).json({ message: 'Должность не найдена' });
            } else {
                res.json(`Должность ${deletedJobTitle.rows[0].name} удалена`);
            }
        } catch (error) {
            res.status(500).json({ message: 'Ошибка при удалении должности', error });
        }
    }

    // выгрузка данных в файл
    async exportJobTitlesToFile(req, res) {
        try {
            // получаем данные из базы
            const result = await db.query('SELECT * FROM job_title');
            const jobTitles = result.rows;

            // путь для сохранения файла
            const exportDirectory = path.join(__dirname, '..', 'export'); // путь к папке export

            // проверка существования папки и её создание при отсутствии
            if (!fs.existsSync(exportDirectory)) {
                fs.mkdirSync(exportDirectory);
            }

            // создаем путь для JSON файла
            const filePath = path.join(exportDirectory, 'job_titles.json');
            
            // запись данных в файл
            fs.writeFileSync(filePath, JSON.stringify(jobTitles, null, 2));

            // отправляем файл на скачивание
            res.download(filePath, 'job_titles.json', (err) => {
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
module.exports = new jobTitleController;
