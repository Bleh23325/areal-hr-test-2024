const Router = require('express')
const router = new Router()
// импорт объекта контролера, т.к буду делать через функции
const hiringController = require('../Controller/hiring_controller')

// Определяем маршруты для функций. первый параметр - url по которому отабатывается функция, второй - функция
router.post('/hiring', hiringController.createHiring)
router.get('/hiring', hiringController.getHiring)
router.get('/hiring/:id', hiringController.getOneHiring)
router.put('/hiring/:id', hiringController.updateHiring)
router.delete('/hiring/:id', hiringController.deleteHiring)

// путь для экспорта данных в json файл
router.get('/export-hiring', hiringController.exportHiringToFile);

module.exports = router