<template>
    <div class="operations_look">
      <h1>Персональные операции</h1>
  
      <!-- Таблица с персональными операциями -->
      <table v-if="personnelOperations.length">
        <thead>
          <tr>
            <th>ID</th>
            <th>Сотрудник</th>
            <th>Наём</th>
            <th>Изменение зарплаты</th>
            <th>Изменение отдела</th>
            <th>Уволен</th>
            <th>Действия</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="operation in personnelOperations" :key="operation.id_personel_operations">
            <td>{{ operation.id_personel_operations }}</td>
  
            <td>
              <!-- Выпадающий список для выбора сотрудника -->
              <select
                v-if="editOperationId === operation.id_personel_operations"
                v-model="editOperationData.worker"
              >
                <option
                  v-for="worker in workers"
                  :key="worker.id"
                  :value="worker.id"
                >
                  {{ worker.lastname }} {{ worker.name }}
                </option>
              </select>
              <span v-else>{{ getWorkerName(operation.worker) }}</span>
            </td>
  
            <td>
              <!-- Выпадающий список для выбора позиции найма -->
              <select
                v-if="editOperationId === operation.id_personel_operations"
                v-model="editOperationData.hiring"
              >
                <option
                  v-for="hire in hiring"
                  :key="hire.id"
                  :value="hire.id"
                >
                  {{ hire.job_title }} ({{ hire.department }})
                </option>
              </select>
              <span v-else>{{ getHiringDetails(operation.hiring) }}</span>
            </td>
  
            <td>
              <input
                v-if="editOperationId === operation.id_personel_operations"
                type="number"
                v-model="editOperationData.change_salary"
                placeholder="Изменение зарплаты"
              />
              <span v-else>{{ operation.change_salary }}</span>
            </td>
  
            <td>
              <input
                v-if="editOperationId === operation.id_personel_operations"
                v-model="editOperationData.change_department"
                placeholder="Введите новый отдел"
              />
              <span v-else>{{ operation.change_department }}</span>
            </td>
  
            <td>
              <!-- Выпадающий список для статуса "Уволен" -->
              <select
                v-if="editOperationId === operation.id_personel_operations"
                v-model="editOperationData.is_dismissed"
              >
                <option :value="true">Да</option>
                <option :value="false">Нет</option>
              </select>
              <span v-else>{{ operation.is_dismissed ? 'Да' : 'Нет' }}</span>
            </td>
  
            <td>
              <button
                v-if="editOperationId !== operation.id_personel_operations"
                @click="startEditOperation(operation)"
              >
                Редактировать
              </button>
              <button v-else @click="saveEditOperation">Сохранить</button>
              <button
                v-if="editOperationId === operation.id_personel_operations"
                @click="cancelEditOperation"
              >
                Отмена
              </button>
              <button @click="deleteOperation(operation.id_personel_operations)">
                Удалить
              </button>
            </td>
          </tr>
        </tbody>
      </table>
  
      <!-- Форма для добавления новой операции -->
      <div class="add_operation">
        <select v-model="newOperation.worker">
          <option value="" disabled>Выберите сотрудника</option>
          <option v-for="worker in workers" :key="worker.id" :value="worker.id">
            {{ worker.lastname }} {{ worker.name }}
          </option>
        </select>
        <select v-model="newOperation.hiring">
          <option value="" disabled>Выберите позицию</option>
          <option v-for="hire in hiring" :key="hire.id" :value="hire.id">
            {{ hire.job_title }} ({{ hire.department }})
          </option>
        </select>
        <input
          type="number"
          v-model="newOperation.change_salary"
          placeholder="Изменение зарплаты"
        />
        <input
          v-model="newOperation.change_department"
          placeholder="Введите новый отдел"
        />
        <br />
        <label>
          Уволен:
          <select v-model="newOperation.is_dismissed">
            <option :value="true">Да</option>
            <option :value="false">Нет</option>
          </select>
        </label>
        <br />
        <button @click="addOperation">Добавить операцию</button>
      </div>
    </div>
  </template>
  
  <script>
  import axios from "axios";
  
  export default {
    data() {
      return {
        workers: [],
        hiring: [],
        personnelOperations: [],
        newOperation: {
          worker: null,
          hiring: null,
          change_salary: null,
          change_department: "",
          is_dismissed: false,
        },
        editOperationId: null,
        editOperationData: {
          worker: null,
          hiring: null,
          change_salary: null,
          change_department: "",
          is_dismissed: false,
        },
      };
    },
    methods: {
      async loadWorkers() {
        try {
          const response = await axios.get("http://localhost:2508/api/worker");
          this.workers = response.data;
        } catch (error) {
          console.error("Ошибка при загрузке сотрудников:", error.message);
        }
      },
      async loadHiring() {
        try {
          const response = await axios.get("http://localhost:2508/api/hiring");
          this.hiring = response.data;
        } catch (error) {
          console.error("Ошибка при загрузке позиций:", error.message);
        }
      },
      async loadOperations() {
        try {
          const response = await axios.get("http://localhost:2508/api/export-personelOperations");
          this.personnelOperations = response.data;
        } catch (error) {
          console.error("Ошибка при загрузке операций:", error.message);
        }
      },
      getWorkerName(workerId) {
        const worker = this.workers.find((w) => w.id === workerId);
        return worker ? `${worker.lastname} ${worker.name}` : "Неизвестно";
      },
      getHiringDetails(hiringId) {
        const hire = this.hiring.find((h) => h.id === hiringId);
        return hire ? `${hire.job_title} (${hire.department})` : "Неизвестно";
      },
      async addOperation() {
        try {
          const response = await axios.post(
            "http://localhost:2508/api/personnelOperations",
            this.newOperation
          );
  
          if (response.status === 201) {
            this.newOperation = {
              worker: null,
              hiring: null,
              change_salary: null,
              change_department: "",
              is_dismissed: false,
            };
            await this.loadOperations();
          } else {
            console.error("Ошибка при добавлении операции: некорректный ответ сервера.");
          }
        } catch (error) {
          console.error("Ошибка при добавлении операции:", error.message);
        }
      },
      startEditOperation(operation) {
        this.editOperationId = operation.id_personel_operations;
        this.editOperationData = { ...operation }; // Клонирование объекта
      },
      cancelEditOperation() {
        this.editOperationId = null;
        this.editOperationData = {
          worker: null,
          hiring: null,
          change_salary: null,
          change_department: "",
          is_dismissed: false,
        };
      },
      async saveEditOperation() {
        try {
          const response = await axios.put(
            `http://localhost:2508/api/personnelOperations/${this.editOperationId}`,
            this.editOperationData
          );
          if (response.status === 200) {
            this.editOperationId = null;
            this.editOperationData = {
              worker: null,
              hiring: null,
              change_salary: null,
              change_department: "",
              is_dismissed: false,
            };
            await this.loadOperations();
          } else {
            console.error("Ошибка при сохранении: некорректный ответ сервера.");
          }
        } catch (error) {
          console.error("Ошибка при сохранении операции:", error.message);
        }
      },
      async deleteOperation(id) {
        try {
          await axios.delete(`http://localhost:2508/api/personnelOperations/${id}`);
          this.loadOperations();
        } catch (error) {
          console.error("Ошибка при удалении операции:", error.message);
        }
      },
    },
    created() {
      this.loadWorkers();
      this.loadHiring();
      this.loadOperations();
    },
  };
  </script>
  
  <style scoped>
  .operations_look {
    font-family: Arial, sans-serif;
    padding: 20px;
  }
  
  table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 20px;
  }
  
  th,
  td {
    border: 1px solid #ddd;
    padding: 10px;
    text-align: left;
  }
  
  th {
    background-color: #f4f4f4;
  }
  
  button {
    margin-right: 5px;
  }
  
  .add_operation {
    margin-top: 20px;
  }
  
  input,
  select {
    margin-right: 10px;
    padding: 5px;
  }
  </style>  