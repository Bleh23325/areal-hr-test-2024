const Router = require('express')
const router = new Router()
// импорт объекта контролера, т.к буду делать через функции
const rootsController = require('../Controller/roots_controller')

// Определяем маршруты для функций. первый параметр - url по которому отабатывается функция, второй - функция
router.post('/roots', rootsController.createRoots)
router.get('/roots', rootsController.getRoots)
router.get('/roots/:id', rootsController.getOneRoots)
router.put('/roots/:id', rootsController.updateRoots)
router.delete('/roots/:id', rootsController.deleteRoots)

// путь для экспорта данных в json файл
router.get('/export-roots', rootsController.exportRootsToFile);

module.exports = router