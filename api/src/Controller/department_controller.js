const fs = require('fs');
const path = require('path');
const db = require('../db/Connect');
const { department_validation } = require('../validations/department_validation'); 
class departmentController{
    // создание Отдела
        async createDepartment(req, res) {
            const { name, comments, organization } = req.body;
            console.log(name, comments, organization);

            // Валидация данных
            const validationResult = department_validation({
                name,
                comments,
            });

            if (validationResult.error) {
                return res.status(400).json({
                    message: 'Ошибка валидации',
                    error: validationResult.error.details.map((detail) => detail.message).join(', '),
                });
            }

            try {
                const newDepartment = await db.query(
                    'INSERT INTO department(organization, name, comments) VALUES ($1, $2, $3) RETURNING *', 
                    [organization, name, comments]
                );
                res.json(`Отдел ${newDepartment.rows[0].name} добавлен в базу данных`);
            } catch (error) {
                res.status(500).json({ message: 'Ошибка при добавлении отдела', error });
            }
        }
        // просмотр организации
        async getDepartment(req, res) {
            try {
                const departments = await db.query('SELECT * FROM department');
                res.json(departments.rows);
            } catch (error) {
                res.status(500).json({ message: 'Ошибка при получении отдела', error });
            }
        }
    
        // возврат 1 Отдела по айди
        async getOneDepartment(req, res) {
            const { id } = req.params;
            try {
                const department = await db.query('SELECT * FROM department WHERE id_department = $1', [id]);
                if (department.rows.length === 0) {
                    res.status(404).json({ message: 'Отдел не найдена' });
                } else {
                    res.json(department.rows[0]);
                }
            } catch (error) {
                res.status(500).json({ message: 'Ошибка при получении отдела', error });
            }
        }
    
        // обновление Отдела
        async updateDepartment(req, res) {
            const { id } = req.params;
            const { name, comments, organization } = req.body;

                // Валидация данных
            const validationResult = department_validation({
                name,
                comments,
            });

            if (validationResult.error) {
                return res.status(400).json({
                    message: 'Ошибка валидации',
                    error: validationResult.error.details.map((detail) => detail.message).join(', '),
                });
            }
            
            try {
                const updatedDepartment = await db.query(
                    'UPDATE department SET organization = $1, name = $2, comments = $3 WHERE id_department = $4 RETURNING *', 
                    [organization, name, comments, id]
                );
                if (updatedDepartment.rows.length === 0) {
                    res.status(404).json({ message: 'Отдел не найдена' });
                } else {
                    res.json(`Отдел ${updatedDepartment.rows[0].name} обновлена`);
                }
            } catch (error) {
                res.status(500).json({ message: 'Ошибка при обновлении отдела', error });
            }
        }
    
        // удаление Отдела
        async deleteDepartment(req, res) {
            const { id } = req.params;
            try {
                const deleteDepartment = await db.query('DELETE FROM department WHERE id_department = $1 RETURNING *', [id]);
                if (deleteDepartment.rows.length === 0) {
                    res.status(404).json({ message: 'Отдел не найден' });
                } else {
                    res.json(`Отдел ${deleteDepartment.rows[0].name} удалён`);
                }
            } catch (error) {
                res.status(500).json({ message: 'Ошибка при удалении отдела', error });
            }
        }
        // выгрузка данных в файл
    async exportDepartmentToFile(req, res) {
        try {
            // получаем данные из базы
            const result = await db.query('SELECT * FROM department');
            const department = result.rows;

            // путь для сохранения файла
            const exportDirectory = path.join(__dirname, '..', 'export'); // путь к папке export

            // проверка существования папки и её создание при отсутствии
            if (!fs.existsSync(exportDirectory)) {
                fs.mkdirSync(exportDirectory);
            }

            // создаем путь для JSON файла
            const filePath = path.join(exportDirectory, 'department.json');
            
            // запись данных в файл
            fs.writeFileSync(filePath, JSON.stringify(department, null, 2));

            // отправляем файл на скачивание
            res.download(filePath, 'department.json', (err) => {
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
module.exports = new departmentController