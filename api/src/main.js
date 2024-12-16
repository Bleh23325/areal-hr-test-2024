const express = require('express')
const cors = require('cors');
const jobTitleRouter = require('./routes/job_title_rotes')
const organizationRouter = require('./routes/organization_routes')
const departmentRouter = require('./routes/department_rotes')
const hiringRouter = require('./routes/hiring_routes')
const addressRouter = require('./routes/address_routes')
const workerRouter = require('./routes/worker_routes')
const rootsRouter = require('./routes/roots_routes')
const keysRouter = require('./routes/keys_roures')
const historiOfChangesRouter = require('./routes/histori_of_changes_route')
const personelOperationsRouter = require('./routes/personal_operation_route')
const passportRouter = require('./routes/passport_routes')
const photosRouter = require('./routes/photo_routes')
// задаём порт. значение после || задаёт порт в ручную, елси его нет в env
const PORT = process.env.PORT || 2508
const  app = express()

// без этого cors не будет работать
app.use(cors());

// обязательная штука для нормальной работы!
app.use(express.json())

// для должностей
app.use('/api', jobTitleRouter)

// для организация
app.use('/api', organizationRouter)

// для отделов
app.use('/api', departmentRouter)

// для "найма"
app.use('/api', hiringRouter)

// для адреса
app.use('/api', addressRouter)

// для работников
app.use('/api', workerRouter)

// для прав доступпа
app.use('/api', rootsRouter)

// для ключей доступа
app.use('/api', keysRouter)

// для истории изменений
app.use('/api', historiOfChangesRouter)

// для персональных операция
app.use('/api', personelOperationsRouter)

// для паспорта
app.use('/api', passportRouter)

// для фото паспорта
app.use('/api', photosRouter)

//вывод порта в консоль
app.listen(PORT, () => console.log(`Порт сервера: http://localhost:${PORT}`))