const fs = require('fs');
const path = require('path');
const db = require('../db/Connect');
const { organization_validation } = require('../validations/organization_validation'); 
class organizationController{
    // создание организации
        async createOrganization(req, res) {
            const { name, comments } = req.body;
            console.log(name, comments);

            // Валидация данных
            const validationResult = organization_validation({
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
                const newOrganization = await db.query(
                    'INSERT INTO organization(name, comments) VALUES ($1, $2) RETURNING *', 
                    [name, comments]
                );
                res.json(`Организация ${newOrganization.rows[0].name} добавлена в базу данных`);
            } catch (error) {
                res.status(500).json({ message: 'Ошибка при добавлении организации', error });
            }
        }
        // просмотр организации
        async getOrganization(req, res) {
            try {
                const organizations = await db.query('SELECT * FROM organization');
                res.json(organizations.rows);
            } catch (error) {
                res.status(500).json({ message: 'Ошибка при получении организаций', error });
            }
        }
    
        // возврат 1 организации по айди
        async getOneOrganization(req, res) {
            const { id } = req.params;
            try {
                const organization = await db.query('SELECT * FROM organization WHERE id_organization = $1', [id]);
                if (organization.rows.length === 0) {
                    res.status(404).json({ message: 'Организация не найдена' });
                } else {
                    res.json(organization.rows[0]);
                }
            } catch (error) {
                res.status(500).json({ message: 'Ошибка при получении организация', error });
            }
        }
    
        // обновление организации
        async updateOrganization(req, res) {
            const { id } = req.params;
            const { name, comments } = req.body;

            // Валидация данных
            const validationResult = organization_validation({
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
                const updatedOrganization = await db.query(
                    'UPDATE organization SET name = $1, comments = $2 WHERE id_organization = $3 RETURNING *', 
                    [name, comments, id]
                );
                if (updatedOrganization.rows.length === 0) {
                    res.status(404).json({ message: 'Организация не найдена' });
                } else {
                    res.json(`Организация ${updatedOrganization.rows[0].name} обновлена`);
                }
            } catch (error) {
                res.status(500).json({ message: 'Ошибка при обновлении организации', error });
            }
        }
    
        // удаление организации
        async deleteOrganization(req, res) {
            const { id } = req.params;
            try {
                const deletedOrganizations = await db.query('DELETE FROM organization WHERE id_organization = $1 RETURNING *', [id]);
                if (deletedOrganizations.rows.length === 0) {
                    res.status(404).json({ message: 'Организация не найдена' });
                } else {
                    res.json(`Организация ${deletedOrganizations.rows[0].name} удалена`);
                }
            } catch (error) {
                res.status(500).json({ message: 'Ошибка при удалении организации', error });
            }
        }
        // выгрузка данных в файл
    async exportOrganizationToFile(req, res) {
        try {
            // получаем данные из базы
            const result = await db.query('SELECT * FROM organization');
            const organization = result.rows;

            // путь для сохранения файла
            const exportDirectory = path.join(__dirname, '..', 'export'); // путь к папке export

            // проверка существования папки и её создание при отсутствии
            if (!fs.existsSync(exportDirectory)) {
                fs.mkdirSync(exportDirectory);
            }

            // создаем путь для JSON файла
            const filePath = path.join(exportDirectory, 'organization.json');
            
            // запись данных в файл
            fs.writeFileSync(filePath, JSON.stringify(organization, null, 2));

            // отправляем файл на скачивание
            res.download(filePath, 'organization.json', (err) => {
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
module.exports = new organizationController