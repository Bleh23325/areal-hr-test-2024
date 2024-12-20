const Router = require('express')
const router = new Router()
// импорт объекта контролера, т.к буду делать через функции
const departmentController = require('../Controller/department_controller')

// Определяем маршруты для функций. первый параметр - url по которому отабатывается функция, второй - функция
router.post('/department', departmentController.createDepartment)
router.get('/department', departmentController.getDepartment)
router.get('/department/:id', departmentController.getOneDepartment)
router.put('/department/:id', departmentController.updateDepartment)
router.delete('/department/:id', departmentController.deleteDepartment)

// путь для экспорта данных в json файл
router.get('/export-department', departmentController.exportDepartmentToFile);

module.exports = router