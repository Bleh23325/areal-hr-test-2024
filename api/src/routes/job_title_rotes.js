const Router = require('express')
const router = new Router()
// импорт объекта контролера, т.к буду делать через функции
const jobTitleController = require('../Controller/job_title_controller')

// Определяем маршруты для функций. первый параметр - url по которому отабатывается функция, второй - функция
router.post('/jobTitle', jobTitleController.createJobTitle)
router.get('/jobTitle', jobTitleController.getJobTitle)
router.get('/jobTitle/:id', jobTitleController.getOneJobTitle)
router.put('/jobTitle/:id', jobTitleController.updateJobTitle)
router.delete('/jobTitle/:id', jobTitleController.deleteJobTitle)

// путь для экспорта данных в json файл
router.get('/export-job-titles', jobTitleController.exportJobTitlesToFile);

module.exports = router