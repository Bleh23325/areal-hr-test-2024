<template>
    <div class="workers-container">
      <h1>Список работников</h1>
  
      <!-- Таблица работников -->
      <table v-if="workers.length">
        <thead>
          <tr>
            <th>ID</th>
            <th>Фамилия</th>
            <th>Имя</th>
            <th>Отчество</th>
            <th>Телефон</th>
            <th>Действия</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="worker in workers" :key="worker.id_worker">
            <td>{{ worker.id_worker }}</td>
            <td>
              <input
                v-if="editingWorker && editingWorker.id_worker === worker.id_worker"
                v-model="editingWorker.lastname"
                placeholder="Фамилия"
              />
              <span v-else>{{ worker.lastname }}</span>
            </td>
            <td>
              <input
                v-if="editingWorker && editingWorker.id_worker === worker.id_worker"
                v-model="editingWorker.name"
                placeholder="Имя"
              />
              <span v-else>{{ worker.name }}</span>
            </td>
            <td>
              <input
                v-if="editingWorker && editingWorker.id_worker === worker.id_worker"
                v-model="editingWorker.patronumic"
                placeholder="Отчество"
              />
              <span v-else>{{ worker.patronumic }}</span>
            </td>
            <td>
              <input
                v-if="editingWorker && editingWorker.id_worker === worker.id_worker"
                ref="phoneInputEdit"
                v-model="editingWorker.phone"
                placeholder="Телефон"
                @input="applyPhoneMask($event, 'edit')"
              />
              <span v-else>{{ worker.phone }}</span>
            </td>
            <td>
              <button v-if="!editingWorker || editingWorker.id_worker !== worker.id_worker" @click="enableEditing(worker)">
                Редактировать
              </button>
              <button v-else @click="saveWorkerChanges">Сохранить</button>
              <button @click="deleteWorker(worker.id_worker)">Удалить</button>
            </td>
          </tr>
        </tbody>
      </table>
  
      <!-- Форма для добавления нового работника -->
      <div class="add-worker">
        <input v-model="newLastname" placeholder="Введите фамилию" />
        <input v-model="newName" placeholder="Введите имя" />
        <input v-model="newPatronumic" placeholder="Введите отчество" />
        <input
          v-model="newPhone"
          placeholder="Введите телефон"
          ref="phoneInput"
          @input="applyPhoneMask($event)"
        />
        <button @click="addWorker">Добавить работника</button>
      </div>
    </div>
  </template>
  
  <script>
  import axios from "axios";
  import IMask from "imask"; // Подключаем IMask
  
  export default {
    data() {
      return {
        workers: [], // Список работников
        newLastname: "",
        newName: "",
        newPatronumic: "",
        newPhone: "",
        editingWorker: null,
        phoneMask: null, // Для хранения маски телефона
      };
    },
    methods: {
      // Загрузка работников
      async loadWorkers() {
        try {
          const response = await axios.get("http://localhost:2508/api/worker");
          this.workers = response.data;
        } catch (error) {
          console.error("Ошибка при загрузке работников:", error);
          alert("Не удалось загрузить работников.");
        }
      },
  
      // Включить режим редактирования
      enableEditing(worker) {
        this.editingWorker = { ...worker }; // Создаем копию работника для редактирования
      },
  
      // Сохранить изменения
      async saveWorkerChanges() {
        if (!this.editingWorker) return;
  
        const { id_worker, lastname, name, patronumic, phone } = this.editingWorker;
  
        // Проверка на наличие всех обязательных данных
        if (!lastname || !name || !patronumic || !phone) {
          alert("Заполните все обязательные поля!");
          return;
        }
  
        try {
          const response = await axios.put(`http://localhost:2508/api/worker/${id_worker}`, {
            lastname,
            name,
            patronumic,
            phone
          });
  
          if (response.status === 200) {
            const index = this.workers.findIndex(worker => worker.id_worker === id_worker);
            if (index !== -1) {
              this.workers[index] = response.data.worker;
            }
            this.editingWorker = null; // Отключаем режим редактирования
          } else {
            console.error("Ошибка при сохранении данных", response);
            alert("Ошибка при сохранении данных.");
          }
        } catch (error) {
          console.error("Ошибка при сохранении изменений:", error);
          alert("Не удалось сохранить изменения. Телефон должен иметь вид +7(000)000-00-00");
        }
      },
  
      // Удалить работника
      async deleteWorker(workerId) {
        try {
          const response = await axios.delete(`http://localhost:2508/api/worker/${workerId}`);
          if (response.status === 200) {
            this.workers = this.workers.filter(worker => worker.id_worker !== workerId);
          } else {
            console.error("Ошибка при удалении работника", response);
            alert("Не удалось удалить работника.");
          }
        } catch (error) {
          console.error("Ошибка при удалении работника:", error);
          alert("Не удалось удалить работника.");
        }
      },
  
      // Добавить работника
      async addWorker() {
        if (!this.newLastname || !this.newName || !this.newPatronumic || !this.newPhone) {
          alert("Введите все данные работника");
          return;
        }
  
        const workerData = {
          lastname: this.newLastname.trim(),
          name: this.newName.trim(),
          patronumic: this.newPatronumic.trim(),
          phone: this.newPhone.trim(),
        };
  
        try {
          const response = await axios.post("http://localhost:2508/api/worker", workerData);
  
          if (response.status === 200 || response.status === 201) {
            console.log('Работник добавлен:', response.data.message);
            alert(response.data.message);
  
            this.workers.push(response.data.worker);
  
            this.newLastname = "";
            this.newName = "";
            this.newPatronumic = "";
            this.newPhone = "";
          } else {
            console.error("Ошибка при добавлении работника", response);
            alert("Ошибка при добавлении работника.");
          }
        } catch (error) {
          console.error("Ошибка при добавлении работника:", error);
          alert("Не удалось добавить работника.");
        }
      },
  
      // Применить маску для телефона
      applyPhoneMask(event, type = 'add') {
        const target = event.target;
        let maskInstance;
        if (type === 'edit' && this.phoneMask) {
          maskInstance = this.phoneMask;
        } else {
          maskInstance = IMask(target, {
            mask: '+{7}(000)000-00-00'
          });
        }
  
        maskInstance.updateValue();
        if (type === 'edit') {
          this.phoneMask = maskInstance;
        }
      },
    },
    created() {
      this.loadWorkers(); // Загрузка списка работников при создании компонента
    },
  };
  </script>
  
  <style scoped>
  .workers-container {
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
  
  .add-worker {
    margin-top: 20px;
  }
  
  input {
    margin-right: 10px;
    padding: 5px;
  }
  </style>  