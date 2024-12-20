const Router = require('express')
const router = new Router()
// импорт объекта контролера, т.к буду делать через функции
const workerController = require('../Controller/worker_controller')

// Определяем маршруты для функций. первый параметр - url по которому отабатывается функция, второй - функция
router.post('/worker', workerController.createWorker)
router.get('/worker', workerController.getWorker)
router.get('/worker/:id', workerController.getOneWorker)
router.put('/worker/:id', workerController.updateWorker)
router.delete('/worker/:id', workerController.deleteWorker)

// путь для экспорта данных в json файл
router.get('/export-workers', workerController.exportWorkersToFile);

module.exports = router